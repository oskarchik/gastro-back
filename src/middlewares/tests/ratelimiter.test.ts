import { NextFunction, Request, Response } from 'express';
import { redis } from 'src/utils/redis';
import { Limiter } from 'src/types/types';
import { rateLimiter } from '../rateLimiter';

const IP_ADDRESS = '127.0.0.1';
const mockRequest = {
  headers: {
    'x-forwarded-for': IP_ADDRESS,
  },
} as unknown as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;
const mockNext: NextFunction = jest.fn();

const rateLimiterOptions: Limiter = {
  windowSize: 10,
  allowedRequests: 4,
};

afterEach(() => {
  jest.clearAllMocks();
  redis.del(IP_ADDRESS);
});

afterAll(async () => {
  await redis.quit();
});

const limiter = rateLimiter(rateLimiterOptions);

describe('rateLimiter', () => {
  it('should respond 200 when requests are under limit', async () => {
    await limiter(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should respond 429 when requests are over limit', async () => {
    for (let i = 0; i <= rateLimiterOptions.allowedRequests; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await limiter(mockRequest, mockResponse, mockNext);
    }

    expect(mockNext).toHaveBeenCalledTimes(4);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 429);
    expect(mockResponse.send).toHaveBeenNthCalledWith(1, { error: 'too many requests' });
  });

  it('should respond 200 after window time has passed', async () => {
    const shortLimiter = rateLimiter({ ...rateLimiterOptions, windowSize: 0 });

    for (let i = 0; i < 6; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await shortLimiter(mockRequest, mockResponse, mockNext);
    }

    expect(mockNext).toHaveBeenCalledTimes(6);
  });
});
