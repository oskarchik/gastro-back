/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { createApp } from '../../../app';
import * as AllergenService from '../allergens.service';
import { createAllergenInput, createAllergenPayload } from './allergenMother';

const app = createApp();

const allergenInput = createAllergenInput({});
const allergenPayload = createAllergenPayload({});

const createAllergenServiceMock = jest.spyOn(AllergenService, 'createAllergen');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

describe('allergens', () => {
  describe('POST/allergen', () => {
    it('should return allergen payload', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app).post('/api/v1/allergens').send(allergenInput);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(allergenPayload);
      expect(createAllergenServiceMock).toHaveBeenCalledWith(allergenInput);
    });
    it('should return 400', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app)
        .post('/api/v1/allergens')
        .send({ ...allergenInput, name: '' });

      expect(statusCode).toBe(400);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/name is required/i);
      expect(createAllergenServiceMock).not.toHaveBeenCalledTimes(1);
    });
    it('should return 500', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockRejectedValueOnce(new Error('error in test'));

      const { statusCode, body } = await request(app).post('/api/v1/allergens').send(allergenInput);

      expect(statusCode).toBe(500);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(createAllergenServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});
