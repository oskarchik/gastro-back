/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import * as RecipesService from '../recipes.service';
import { createApp } from 'src/app';
import { RecipeInput } from '../recipes.model';
import { redis } from 'src/utils/redis';

const app = createApp();

const recipeInput: RecipeInput = {
  name: 'paella',
  category: 'main',
  subCategory: 'rice',
  ingredients: ['639eea5a049fc933bddebab2'],
  ingredientNames: ['rice', 'green beans', 'chicken'],
  hasAllergens: false,
  allergens: [],
  allergenNames: [],
};

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

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

describe('HAPPY PATH', () => {
  describe('no recipes in db', () => {
    it('should return 200 and an empty array', async () => {
      // @ts-ignore
      getRecipesServiceMock.mockReturnValueOnce([]);
      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(1, {});
    });
  });

  describe('with recipes in db', () => {
    it('should return 200 and an empty array', async () => {
      // @ts-ignore
      getRecipesServiceMock.mockReturnValueOnce([recipePayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(1, {});
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
      expect(getRecipesWithNameServiceMock).toHaveBeenNthCalledWith(1, /pa/);
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
      expect(getRecipesByAllergenServiceMock).toHaveBeenNthCalledWith(1, ['fish']);
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
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getRecipesServiceMock).toHaveBeenNthCalledWith(1, {});
    });
  });

  describe('unexpected error', () => {
    it('should return 500 when error while getting recipes by name', async () => {
      // @ts-ignore
      getRecipesWithNameServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).get(baseApiUrl).query({ name: 'pa' });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getRecipesWithNameServiceMock).toHaveBeenNthCalledWith(1, /pa/);
    });
    it('should return 500 when error while getting recipes by allergen', async () => {
      // @ts-ignore
      getRecipesByAllergenServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app)
        .get(baseApiUrl)
        .query({ allergenNames: ['fish'] });

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getRecipesByAllergenServiceMock).toHaveBeenNthCalledWith(1, ['fish']);
    });
    it('should return 500 when error while getting recipes by id', async () => {
      // @ts-ignore
      getRecipesByIdServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).get(`${baseApiUrl}/${recipePayload._id}`);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getRecipesByIdServiceMock).toHaveBeenNthCalledWith(1, recipePayload._id);
    });
  });

  describe('invalid id when getting recipe by id', () => {
    it('should return 400 error', async () => {
      const { statusCode, body } = await request(app).get(`${baseApiUrl}/1234`);

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(getRecipesByIdServiceMock).not.toHaveBeenCalled();
    });
  });
});
