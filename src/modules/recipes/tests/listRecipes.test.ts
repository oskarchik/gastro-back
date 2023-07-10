/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Model, Query } from 'mongoose';
import { redis } from 'src/utils/redis';
import { createApp } from 'src/app';
import { ApiError } from 'src/error/ApiError';
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

const error = new Error('oh noo');

const getRecipesServiceMock = jest.spyOn(RecipesService, 'getRecipes');
const getRecipesWithNameServiceMock = jest.spyOn(RecipesService, 'getRecipesWithName');
const getRecipesByAllergenServiceMock = jest.spyOn(RecipesService, 'getRecipesByAllergen');
const getRecipesByIdServiceMock = jest.spyOn(RecipesService, 'getRecipeById');

const countDocumentMock = jest.spyOn(Model, 'countDocuments');

beforeEach(() => {
  redis.flushdb();
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});
afterAll(async () => {
  await redis.quit();
});

describe('HAPPY PATH', () => {
  describe('no recipes in db', () => {
    it('should return 200 and an empty array', async () => {
      // @ts-ignore
      getRecipesServiceMock.mockReturnValueOnce([]);
      countDocumentMock.mockReturnValueOnce(0 as unknown as Query<number, unknown>);
      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(
        1,
        {},
        { page: 1, limit: 10, offset: 0 }
      );
    });
  });

  describe('with recipes in db', () => {
    it('should return 200 and an empty array', async () => {
      // @ts-ignore
      getRecipesServiceMock.mockReturnValueOnce([recipePayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(
        1,
        {},
        { page: 1, limit: 10, offset: 0 }
      );
    });
  });

  describe('recipes with name', () => {
    it('should return 200 and an array of objects', async () => {
      // @ts-ignore
      getRecipesWithNameServiceMock.mockReturnValueOnce([recipePayload, recipePayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl).query({ name: 'pa' });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(2);
      expect(getRecipesWithNameServiceMock).toHaveBeenNthCalledWith(1, /pa/, {
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
  });
  describe('recipes by allergen', () => {
    it('should return 200 and an array of objects', async () => {
      // @ts-ignore
      getRecipesByAllergenServiceMock.mockReturnValueOnce([recipePayload]);

      const { statusCode, body } = await request(app)
        .get(baseApiUrl)
        .query({ allergenNames: ['fish'] });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getRecipesByAllergenServiceMock).toHaveBeenNthCalledWith(1, ['fish'], {
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
  });
  describe('recipe by id', () => {
    it('should return 200 and a recipe object', async () => {
      // @ts-ignore
      getRecipesByIdServiceMock.mockReturnValueOnce(recipePayload);

      const { statusCode, body } = await request(app).get(`${baseApiUrl}/${recipePayload._id}`);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(recipePayload);
      expect(getRecipesByIdServiceMock).toHaveBeenNthCalledWith(1, recipePayload._id);
    });
  });
});
describe('UNHAPPY PATH', () => {
  describe('no recipes in db', () => {
    it('should return 500', async () => {
      // @ts-ignore
      getRecipesServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(
        1,
        {},
        { page: 1, limit: 10, offset: 0 }
      );
    });
  });

  describe('unexpected error', () => {
    it('should return 500 when error while getting recipes by name', async () => {
      // @ts-ignore
      getRecipesWithNameServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).get(baseApiUrl).query({ name: 'pa' });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(getRecipesWithNameServiceMock).toHaveBeenNthCalledWith(1, /pa/, {
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
    it('should return 500 when error while getting recipes by allergen', async () => {
      // @ts-ignore
      getRecipesByAllergenServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app)
        .get(baseApiUrl)
        .query({ allergenNames: ['fish'] });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(getRecipesByAllergenServiceMock).toHaveBeenNthCalledWith(1, ['fish'], {
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
    it('should return 500 when error while getting recipes by id', async () => {
      // @ts-ignore
      getRecipesByIdServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).get(`${baseApiUrl}/${recipePayload._id}`);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(getRecipesByIdServiceMock).toHaveBeenNthCalledWith(1, recipePayload._id);
    });

    describe('invalid id when getting recipe by id', () => {
      it('should return 400 error', async () => {
        const { statusCode, body } = await request(app).get(`${baseApiUrl}/1234`);

        expect(statusCode).toBe(400);
        expect(body.error).toMatch(/invalid id/i);
        expect(getRecipesByIdServiceMock).not.toHaveBeenCalled();
      });
    });

    describe('not found error when getting recipe by id', () => {
      it('should return 404 error', async () => {
        const { statusCode, body } = await request(app).get(
          `${baseApiUrl}/639eea5a049fc933bddebab2`
        );

        expect(statusCode).toBe(404);
        expect(body.error).toMatch(/recipe not found/i);
        expect(getRecipesByIdServiceMock).toHaveBeenNthCalledWith(1, '639eea5a049fc933bddebab2');
      });
    });
  });
});
