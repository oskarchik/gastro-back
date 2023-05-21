import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Metadata } from 'src/types/types';
import { getPaginatedData, paginationMiddleware } from '../pagination.middleware';

const model = mongoose.model('Test', new mongoose.Schema());
const defaultPagination = {
  page: 1,
  limit: 10,
  offset: 0,
};
const query = {
  page: '',
  limit: '',
  offset: '',
};
const req = {} as Request;
let res: Response;
const next: NextFunction = jest.fn();
const defaultOriginalUrl = 'http://example.com/test?page=1&limit=10';

beforeEach(() => {
  jest.clearAllMocks();
});
describe('getPaginatedData', () => {
  it('should return metadata for the first page', async () => {
    req.pagination = defaultPagination;
    const countDocumentsSpy = jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(20);

    const result = await getPaginatedData(model, query, req, defaultOriginalUrl);

    expect(result).toEqual<Metadata>({
      totalPages: 2,
      currentPage: 1,
      totalDocuments: 20,
      nextPageUrl: 'http://example.com/test?page=2&limit=10',
      prevPageUrl: null,
    });
    expect(countDocumentsSpy).toHaveBeenCalledWith(query);
  });

  it('should return metadata for the last page', async () => {
    req.pagination.page = 2;
    const countDocumentsSpy = jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(20);

    const result = await getPaginatedData(model, query, req, defaultOriginalUrl);

    expect(result).toEqual<Metadata>({
      totalPages: 2,
      currentPage: 2,
      totalDocuments: 20,
      nextPageUrl: null,
      prevPageUrl: 'http://example.com/test?page=1&limit=10',
    });
    expect(countDocumentsSpy).toHaveBeenCalledWith(query);
  });

  it('should return null for the next or previous page if they are not available', async () => {
    req.pagination.page = 2;
    const countDocumentsSpy = jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(5);

    const result = await getPaginatedData(model, query, req, defaultOriginalUrl);

    expect(result).toEqual<Metadata>({
      totalPages: 1,
      currentPage: 2,
      totalDocuments: 5,
      nextPageUrl: null,
      prevPageUrl: 'http://example.com/test?page=1&limit=10',
    });
    expect(countDocumentsSpy).toHaveBeenCalledWith(query);
  });

  it('should return an error if an exception is thrown', async () => {
    const errorMessage = 'Internal server error';
    const countDocumentsSpy = jest
      .spyOn(model, 'countDocuments')
      .mockRejectedValueOnce(new Error(errorMessage));

    const result = await getPaginatedData(model, query, req, defaultOriginalUrl);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(errorMessage);
    expect(countDocumentsSpy).toHaveBeenCalledWith(query);
  });
});
describe('paginationMiddleware', () => {
  beforeEach(() => {
    req.query = {};
    req.originalUrl = '';
  });

  it('should add pagination data to the request object', () => {
    req.query.page = '2';
    req.query.limit = '5';

    paginationMiddleware()(req as Request, res, next);

    expect(req.pagination).toEqual({
      page: 2,
      limit: 5,
      offset: 5,
    });
  });
  it('should add limit and page to url if not provided', () => {
    const prevOriginalUrl = req.originalUrl;

    paginationMiddleware()(req, res, next);

    expect(req.originalUrl).toEqual('?limit=10&page=1');
    expect(req.originalUrl).not.toEqual(prevOriginalUrl);
  });
  it('should return req.originalUrl as provided', () => {
    const paginationParams = '?limit=2&page=1';
    const prevOriginalUrl = req.originalUrl;

    req.originalUrl = paginationParams;

    paginationMiddleware()(req, res, next);

    expect(req.originalUrl).toEqual(`?limit=2&page=1`);
    expect(req.originalUrl).not.toEqual(prevOriginalUrl);
  });

  it('should set default limit when limit query parameter is not provided', () => {
    req.query.page = '1';

    paginationMiddleware()(req, res, next);

    expect(req.pagination).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
    });
  });

  it('should call next with an error when limit query parameter is invalid', () => {
    req.query.page = '1';
    req.query.limit = '-1';

    paginationMiddleware()(req, res, next);

    expect(next).toHaveBeenNthCalledWith(1, new Error(`Limit must be between 1 and 100`));
  });
  it('should call next with an error when page query parameter is invalid', () => {
    req.query.page = '-1';
    req.query.limit = '10';

    paginationMiddleware()(req, res, next);

    expect(next).toHaveBeenNthCalledWith(1, new Error(`Page must be a positive integer`));
  });

  it('should set max limit when limit query parameter is greater than max limit', () => {
    req.query.page = '1';
    req.query.limit = '200';

    paginationMiddleware({ maxLimit: 200 })(req, res, next);

    expect(req.pagination).toEqual({
      page: 1,
      limit: 200,
      offset: 0,
    });
  });

  it('should add pagination query parameters to the original URL', () => {
    req.query.page = '3';
    req.query.limit = '7';
    req.originalUrl = '/example';

    paginationMiddleware()(req, res, next);

    expect(req.originalUrl).toBe('/example?limit=7&page=3');
  });

  it('should set default limit when limit query parameter is invalid', () => {
    req.query.page = '1';
    req.query.limit = '0';

    paginationMiddleware()(req, res, next);

    expect(req.pagination?.limit).toEqual(10);
  });
});
