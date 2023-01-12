/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { createApp } from '../../../app';
import { IngredientInput } from '../ingredients.model';
import * as IngredientService from '../ingredients.service';

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

const createIngredientServiceMock = jest.spyOn(IngredientService, 'createIngredient');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('HAPPY PATH', () => {
  describe('create ingredient', () => {
    it('should return 200 and return ingredientPayload', async () => {
      // @ts-ignore
      createIngredientServiceMock.mockReturnValueOnce(ingredientPayload);

      const { statusCode, body } = await request(app).post(baseApiUrl).send(ingredientInput);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(ingredientPayload);
      expect(createIngredientServiceMock).toHaveBeenNthCalledWith(1, ingredientInput);
    });
  });
});

describe('UNHAPPY PATH', () => {
  describe('unexpected error while creating ingredient', () => {
    it('should return 500', async () => {
      // @ts-ignore
      createIngredientServiceMock.mockRejectedValueOnce('ooh noo');

      const { statusCode, body } = await request(app).post(baseApiUrl).send(ingredientInput);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(createIngredientServiceMock).toHaveBeenNthCalledWith(1, ingredientInput);
    });
  });

  describe('wrong data format', () => {
    it('should return 400 bad request if name is missing', async () => {
      // @ts-ignore
      createIngredientServiceMock.mockReturnValueOnce(ingredientPayload);

      const { statusCode, body } = await request(app)
        .post(baseApiUrl)
        .send({ ...ingredientInput, name: '' });
      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/name and hasAllergens are required/i);
      expect(createIngredientServiceMock).not.toHaveBeenCalled();
    });
  });
});
