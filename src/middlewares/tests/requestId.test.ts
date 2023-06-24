import { Request, Response, NextFunction } from 'express';
import { requestIdMiddleware } from '../requestId.middleware';

const mockReq = {} as Request;
const mockRes = {
  set: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn();
describe('requestId middleware', () => {
  it('test_request_id_middleware_sets_unique_id', () => {
    requestIdMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.set).toHaveBeenCalledWith('X-Request-ID', expect.any(String));
    expect(mockNext).toHaveBeenCalled();
  });
  it('test_request_id_middleware_calls_next', () => {
    requestIdMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('test_request_id_middleware_no_modification', () => {
    requestIdMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq).toEqual({});
    expect(mockRes).toEqual({
      set: expect.any(Function),
    });
  });
});
