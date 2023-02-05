/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
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
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteRecipesServiceMock).toHaveBeenNthCalledWith(1, { category: 'main' });
    });
  });
});
