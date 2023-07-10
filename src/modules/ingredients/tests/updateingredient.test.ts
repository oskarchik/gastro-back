/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { ApiError } from 'src/error/ApiError';
import { createApp } from '../../../app';
import * as IngredientService from '../ingredients.service';
import { createIngredientPayload } from './ingredientMother';

const app = createApp();

const ingredientPayload = createIngredientPayload({});

const nameUpdateInput = 'updated';

const baseApiUrl = '/api/v1/ingredients';

const updateIngredientServiceMock = jest.spyOn(IngredientService, 'updateIngredient');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

describe('HAPPY PATH', () => {
  describe('should return 200 and updated ingredient', () => {
    it('should return an ingredient with new given name', async () => {
      updateIngredientServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ ...ingredientPayload, name: nameUpdateInput });

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/${ingredientPayload._id}`)
        .send({ name: nameUpdateInput });

      expect(statusCode).toBe(200);
      expect(body.data).toMatchObject({ ...ingredientPayload, name: nameUpdateInput });
      expect(body.data.name).toEqual(nameUpdateInput);
      expect(updateIngredientServiceMock).toHaveBeenNthCalledWith(1, {
        ingredientId: ingredientPayload._id,
        update: { name: nameUpdateInput },
      });
    });
  });
});
describe('UNHAPPY PATH', () => {
  describe('unexpected error', () => {
    it('should return 500 when updating ingredient', async () => {
      updateIngredientServiceMock.mockRejectedValueOnce('oh no!');

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/${ingredientPayload._id}`)
        .send({ name: nameUpdateInput });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(updateIngredientServiceMock).toHaveBeenNthCalledWith(1, {
        ingredientId: ingredientPayload._id,
        update: { name: nameUpdateInput },
      });
    });
  });
  describe('invalid id format', () => {
    it('should return 400', async () => {
      updateIngredientServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ ...ingredientPayload, name: nameUpdateInput });

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/1234`)
        .send({ name: nameUpdateInput });

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(updateIngredientServiceMock).not.toHaveBeenCalled();
    });
  });
  describe('not found ingredient to update', () => {
    it('should return 404', async () => {
      updateIngredientServiceMock
        // @ts-ignore
        .mockReturnValueOnce(null);

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/639eea5a049fc933bddebab3`)
        .send({ name: nameUpdateInput });

      expect(statusCode).toBe(404);
      expect(body.error).toMatch(ApiError.DEFAULT_NOT_FOUND_MESSAGE);
      expect(updateIngredientServiceMock).toHaveBeenNthCalledWith(1, {
        ingredientId: '639eea5a049fc933bddebab3',
        update: { name: nameUpdateInput },
      });
    });
  });
});
