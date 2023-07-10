/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { validate } from '../validationRequest';
import { getAllergenSchema } from 'src/modules/allergens/allergens.schema';
import { ApiError } from 'src/error/ApiError';

const mockRequest = {
  baseUrl: '/allergens',
  params: {},
  query: { name: 'pepe' },
} as unknown as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;
const mockNext: NextFunction = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('validation request', () => {
  it('should pass the validation', async () => {
    const schema = validate(getAllergenSchema);

    await schema(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  it('should return 400 and error', async () => {
    const schema = validate(getAllergenSchema);

    const wrongRequest = {
      baseUrl: '/allergens',
      params: {},
      query: { name: 3 },
    } as unknown as Request;
    await schema(wrongRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: [{ path: 'query:name', message: 'Expected string, received number' }],
    });
  });
  it('should call next with ApiError.badRequest', async () => {
    const schema = validate({} as AnyZodObject);

    const error = new Error(ApiError.DEFAULT_BAD_REQUEST_MESSAGE);

    await schema(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenNthCalledWith(1, error);
  });
});
0;
