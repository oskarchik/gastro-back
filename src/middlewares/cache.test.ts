import { Request, Response, NextFunction } from 'express';
import { redis } from 'src/utils/redis';
import { cache } from './cache.middleware';

const mockRequest = {
  baseUrl: '/allergens',
  params: {},
} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;
const mockNext: NextFunction = jest.fn();

const mockRedis = jest.spyOn(redis, 'get');

afterEach(() => {
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

describe('cache middleware', () => {
  it('should return cached data', async () => {
    await redis.setex('allergens', 2000, JSON.stringify({ data: 'testdata' }));

    await cache(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ data: { data: 'testdata' } });
  });
  it('should call next if no cached data', async () => {
    await redis.get('allergens');

    await cache(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
  it('should call next with error', async () => {
    mockRedis.mockRejectedValueOnce('oh no');

    await cache(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith('oh no');
  });
});
