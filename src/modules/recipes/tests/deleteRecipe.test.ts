/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { ApiError } from 'src/error/ApiError';
import * as RecipeService from '../recipes.service';
import { createApp } from '../../../app';

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

const deleteRecipesServiceMock = jest.spyOn(RecipeService, 'removeRecipes');
const deleteRecipeByIdServiceMock = jest.spyOn(RecipeService, 'removeRecipeById');

const error = new Error('oh noo');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

describe('HAPPY PATH', () => {
  describe('remove all recipes', () => {
    it('it should return 200 and a message with number of documents deleted', async () => {
      // @ts-ignore
      deleteRecipesServiceMock.mockReturnValueOnce(4);

      const { statusCode, body } = await request(app).delete(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/4 recipes deleted from db/i);
      expect(deleteRecipesServiceMock).toHaveBeenNthCalledWith(1, {});
    });

    it('should return 200 when given category is passed as query', async () => {
      // @ts-ignore
      deleteRecipesServiceMock.mockReturnValueOnce(4);

      const { statusCode, body } = await request(app)
        .delete(baseApiUrl)
        .query({ category: 'main' });

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/4 recipes deleted from db/i);
      expect(deleteRecipesServiceMock).toHaveBeenNthCalledWith(1, { category: 'main' });
    });
  });
  describe('remove recipe by id', () => {
    it('should return 200 and a message with the id', async () => {
      // @ts-ignore
      deleteRecipeByIdServiceMock.mockReturnValueOnce(recipePayload);

      const { statusCode, body } = await request(app).delete(`${baseApiUrl}/${recipePayload._id}`);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/deleted recipe 639eea5a049fc933bddebab2/i);
      expect(deleteRecipeByIdServiceMock).toHaveBeenNthCalledWith(1, recipePayload._id);
    });
  });
});
describe('UNHAPPY PATH', () => {
  describe('unexpected error', () => {
    it('should return 500 when deleting recipes', async () => {
      // @ts-ignore
      deleteRecipesServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app)
        .delete(baseApiUrl)
        .query({ category: 'main' });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(deleteRecipesServiceMock).toHaveBeenNthCalledWith(1, { category: 'main' });
    });
    it('should return 500 when deleting recipe by id', async () => {
      // @ts-ignore
      deleteRecipeByIdServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).delete(`${baseApiUrl}/${recipePayload._id}`);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(deleteRecipeByIdServiceMock).toHaveBeenNthCalledWith(1, recipePayload._id);
    });
  });

  describe('bad request error', () => {
    it('should return 400 error when given id has wrong format', async () => {
      const { statusCode, body } = await request(app).delete(`${baseApiUrl}/123`);

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(deleteRecipeByIdServiceMock).not.toHaveBeenCalled();
    });
  });
  describe('not found error', () => {
    it('should return 404 when given recipe id is not found', async () => {
      // @ts-ignore
      deleteRecipeByIdServiceMock.mockReturnValueOnce(null);
      const { statusCode, body } = await request(app).delete(
        `${baseApiUrl}/639eea5a049fc933bddebab3`
      );

      expect(statusCode).toBe(404);
      expect(body.error).toMatch(/recipe not found to delete/i);
      expect(deleteRecipeByIdServiceMock).toHaveBeenNthCalledWith(1, '639eea5a049fc933bddebab3');
    });
  });
});
