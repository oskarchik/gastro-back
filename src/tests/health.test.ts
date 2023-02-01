/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { createApp } from 'src/app';
import { redis } from 'src/utils/redis';

const baseApiUrl = '/api/v1/health';

const app = createApp();

afterEach(() => {
  redis.flushdb();
});

describe('health', () => {
  it('should return 200', async () => {
    const { statusCode, body } = await request(app).get(baseApiUrl);

    expect(statusCode).toBe(200);
    expect(body.data).toBeDefined();
  });
});
