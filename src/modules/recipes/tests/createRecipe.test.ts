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

const createRecipesServiceMock = jest.spyOn(RecipesService, 'createRecipe');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

describe('HAPPY PATH', () => {
  describe('createRecipe', () => {
    it('should return 200 and an recipe object', async () => {
      // @ts-ignore
      createRecipesServiceMock.mockReturnValueOnce(recipePayload);

      const { statusCode, body } = await request(app).post(baseApiUrl).send(recipeInput);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(recipePayload);
      expect(createRecipesServiceMock).toHaveBeenNthCalledWith(1, recipeInput);
    });
  });
});
// describe('HAPPY PATH', () => {});
