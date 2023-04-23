/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { createApp } from '../../../app';
import * as RecipesService from '../recipes.service';

const app = createApp();

const recipePayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'paella',
  subCategory: 'rice',
  ingredients: ['639eea5a049fc933bddebab2'],
  ingredientNames: ['rice', 'green beans', 'chicken'],
  hasAllergens: false,
  allergens: [],
  allergenNames: [],
};

const baseApiUrl = '/api/v1/recipes';

const updateRecipesServiceMock = jest.spyOn(RecipesService, 'updateRecipe');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

describe('HAPPY PATH', () => {
  it('should return 200 and a recipe object with the info updated', async () => {
    // @ts-ignore
    updateRecipesServiceMock.mockReturnValueOnce({ ...recipePayload, category: 'main' });

    const { statusCode, body } = await request(app)
      .patch(`${baseApiUrl}/${recipePayload._id}`)
      .send({ category: 'main' });

    expect(statusCode).toBe(200);
    expect(body.data).toMatchObject({ ...recipePayload, category: 'main' });
    expect(body.data.category).toEqual('main');
    expect(updateRecipesServiceMock).toHaveBeenNthCalledWith(1, {
      recipeId: recipePayload._id,
      update: { category: 'main' },
    });
  });
});
describe('HAPPY PATH', () => {
  describe('unexpected error', () => {
    it('should return 500 when updating recipe', async () => {
      updateRecipesServiceMock.mockRejectedValueOnce(new Error('oh noo'));

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/${recipePayload._id}`)
        .send({ category: 'main' });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(updateRecipesServiceMock).toHaveBeenNthCalledWith(1, {
        recipeId: recipePayload._id,
        update: { category: 'main' },
      });
    });
  });

  describe('bad request', () => {
    it('should return 400 when given id has wrong format', async () => {
      updateRecipesServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ ...recipePayload, category: 'main' });

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/1234`)
        .send({ category: 'main' });

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(updateRecipesServiceMock).not.toHaveBeenCalled();
    });
  });

  describe('not found error', () => {
    it('should return 400 when recipe not found', async () => {
      updateRecipesServiceMock
        // @ts-ignore
        .mockReturnValueOnce(null);

      const { statusCode, body } = await request(app)
        .patch(`${baseApiUrl}/639eea5a049fc933bddebab3`)
        .send({ category: 'main' });

      expect(statusCode).toBe(404);
      expect(body.error).toMatch(/recipe not found to update/i);
      expect(updateRecipesServiceMock).toHaveBeenNthCalledWith(1, {
        recipeId: '639eea5a049fc933bddebab3',
        update: { category: 'main' },
      });
    });
  });
});
