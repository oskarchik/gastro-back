import { Request, Response } from 'express';
import { ApiError } from './ApiError';
import { BaseError } from './BaseError';
import { errorHandler, isTrustedError } from './error-handler';

describe('ApiError', () => {
  describe('bad request', () => {
    it('should return 400', () => {
      const { httpCode, isOperational, message } = ApiError.badRequest('bad request');
      expect(httpCode).toEqual(400);
      expect(isOperational).toEqual(true);
      expect(message).toEqual('bad request');
    });
  });
  describe('unauthorized', () => {
    it('should return 401', () => {
      const { httpCode, isOperational, message } = ApiError.unauthorized('unauthorized');
      expect(httpCode).toEqual(401);
      expect(isOperational).toEqual(true);
      expect(message).toEqual('unauthorized');
    });
  });
  describe('forbidden', () => {
    it('should return 403', () => {
      const { httpCode, isOperational, message } = ApiError.forbidden('forbidden');
      expect(httpCode).toEqual(403);
      expect(isOperational).toEqual(true);
      expect(message).toEqual('forbidden');
    });
  });
  describe('not found', () => {
    it('should return 404', () => {
      const { httpCode, isOperational, message } = ApiError.notFound('not found');
      expect(httpCode).toEqual(404);
      expect(isOperational).toEqual(true);
      expect(message).toEqual('not found');
    });
  });
  describe('internal', () => {
    it('should return 500', () => {
      const { httpCode, isOperational, message } = ApiError.internalError('internal error');
      expect(httpCode).toEqual(500);
      expect(isOperational).toEqual(true);
      expect(message).toEqual('internal error');
    });
  });
  describe('ApiError is instance of BaseError', () => {
    it('ApiError should be an instance of BaseError', () => {
      const mockError: ApiError = {
        httpCode: 400,
        isOperational: true,
        message: 'custom error',
        name: 'Error',
      };
      const error = new ApiError(mockError.httpCode, mockError.message, mockError.isOperational);
      expect(error).toBeInstanceOf(BaseError);
    });
  });
});
describe('error handler', () => {
  it('should return 500 and error handler message', () => {
    const mockError: Error = new Error('mock error');
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    mockResponse.send(mockNext);

    errorHandler(mockError, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Unexpected internal error' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  it('should return 400 and bad request message', () => {
    const mockApiError = ApiError.badRequest('bad request');
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    mockResponse.send(mockApiError);

    errorHandler(mockApiError, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: 'bad request' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('isTrustedError', () => {
  it('should return true if error is instance of BaseError', () => {
    const error = ApiError.badRequest('fake error');

    const result = isTrustedError(error);

    expect(result).toBe(true);
    expect(error.isOperational).toBe(true);
    expect(error.httpCode).toBe(400);
    expect(error.message).toMatch(/fake error/i);
  });

  it('should return false is error is not instance of BaseError', () => {
    const error = new Error('fake error');

    const result = isTrustedError(error);

    expect(result).toBe(false);
    expect(error).not.toEqual(expect.objectContaining({ isOperational: false }));
    expect(error).not.toEqual(expect.objectContaining({ httpCode: 500 }));
    expect(error.message).toMatch(/fake error/i);
  });
});
