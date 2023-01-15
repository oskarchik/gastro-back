/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import * as IngredientsService from '../ingredients.service';
import { IngredientInput } from '../ingredients.model';
import { createApp } from '../../../app';

const app = createApp();

const ingredientInput: IngredientInput = {
  name: 'ingredient 1',
  category: 'eggs',
  hasAllergens: true,
  allergens: ['639eea5a049fc933bddebab3'],
  allergenNames: ['celery'],
};

const ingredientPayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'ingredient 1',
  category: 'eggs',
  hasAllergens: true,
  allergens: ['639eea5a049fc933bddebab3'],
  allergenNames: ['celery'],
};

const baseApiUrl = '/api/v1/ingredients';

const getIngredientsServiceMock = jest.spyOn(IngredientsService, 'getIngredients');

const getIngredientsByAllergenServiceMock = jest.spyOn(
  IngredientsService,
  'getIngredientsByAllergen'
);

const getIngredientByIdServiceMock = jest.spyOn(IngredientsService, 'getIngredientById');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('HAPPY PATH', () => {
  describe('no ingredients in db', () => {
    it('should return 200 and an empty array', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockReturnValueOnce([]);

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getIngredientsServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('there are ingredients in db', () => {
    it('should return 200 and an array of ingredients', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockReturnValueOnce([ingredientPayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data[0]).toMatchObject(ingredientPayload);
      expect(body.data.length).toBe(1);
      expect(getIngredientsServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('ingredients by name', () => {
    it('should return 200 and an array of ingredient objects', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockReturnValueOnce([ingredientPayload]);

      const { statusCode, body } = await request(app)
        .get(baseApiUrl)
        .query({ name: 'ingredient 1' });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getIngredientsServiceMock).toHaveBeenNthCalledWith(1, {
        name: ingredientInput.name,
      });
    });
  });
  describe('ingredients by category', () => {
    it('should return 200 and an array of ingredient objects', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockReturnValueOnce([ingredientPayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl).query({ category: 'eggs' });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getIngredientsServiceMock).toHaveBeenNthCalledWith(1, {
        category: ingredientInput.category,
      });
    });
  });

  describe('ingredients by allergen', () => {
    it('should return 200 and an array of ingredient objects', async () => {
      // @ts-ignore
      getIngredientsByAllergenServiceMock.mockReturnValueOnce([ingredientPayload]);

      const { statusCode, body } = await request(app)
        .get(baseApiUrl)
        .query({ allergenNames: ['celery'] });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getIngredientsByAllergenServiceMock).toHaveBeenNthCalledWith(
        1,
        ingredientInput.allergenNames
      );
    });
  });

  describe('allergenic ingredients', () => {
    it('should return 200 and an array of ingredient objects', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockReturnValueOnce([ingredientPayload]);

      const { statusCode, body } = await request(app).get(baseApiUrl).query({ hasAllergens: true });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getIngredientsServiceMock).toHaveBeenNthCalledWith(1, {
        hasAllergens: ingredientInput.hasAllergens,
      });
    });
  });
  describe('get ingredient by id', () => {
    it('should return 200 and an ingredient objects', async () => {
      // @ts-ignore
      getIngredientByIdServiceMock.mockReturnValueOnce(ingredientPayload);

      const { statusCode, body } = await request(app).get(`${baseApiUrl}/${ingredientPayload._id}`);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(ingredientPayload);
      expect(getIngredientByIdServiceMock).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
  });
});
describe('UNHAPPY PATH', () => {
  describe('unexpected error getting ingredients', () => {
    it('should return 500 if error while getting ingredients', async () => {
      // @ts-ignore
      getIngredientsServiceMock.mockRejectedValueOnce('oh no!');

      const { statusCode, body } = await request(app).get(baseApiUrl);

      expect(statusCode).toBe(500);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getIngredientsServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should return 500 if error while getting ingredients by allergen', async () => {
    // @ts-ignore
    getIngredientsByAllergenServiceMock.mockRejectedValueOnce('oh no!');

    const { statusCode, body } = await request(app)
      .get(baseApiUrl)
      .query({ allergenNames: 'mustard' });

    expect(statusCode).toBe(500);
    expect(body.error).toMatch(/unexpected internal error/i);
    expect(getIngredientsByAllergenServiceMock).toHaveBeenCalledTimes(1);
  });
  describe('invalid id while getting ingredients by id', () => {
    it('should return 400 error', async () => {
      // @ts-ignore
      getIngredientByIdServiceMock.mockReturnValueOnce(ingredientPayload);
      const { statusCode, body } = await request(app).get(`${baseApiUrl}/12324`);

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(getIngredientByIdServiceMock).not.toHaveBeenCalled();
    });
  });
  describe('ingredient by id not found', () => {
    it('should return 404', async () => {
      const { statusCode, body } = await request(app).get(`${baseApiUrl}/639eea5a049fc933bddebab3`);

      expect(statusCode).toBe(404);
      expect(body.error).toMatch(/ingredient not found/i);
      expect(getIngredientByIdServiceMock).toHaveBeenNthCalledWith(1, '639eea5a049fc933bddebab3');
    });
    it('should return 500 if unexpected error occurs', async () => {
      // @ts-ignore
      getIngredientByIdServiceMock.mockRejectedValueOnce('ooops');

      const { statusCode, body } = await request(app).get(`${baseApiUrl}/${ingredientPayload._id}`);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getIngredientByIdServiceMock).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
  });
});
