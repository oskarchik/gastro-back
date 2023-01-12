/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import { STATUS_CODES } from 'http';
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

const nameUpdateInput = 'updated';

const baseApiUrl = '/api/v1/ingredients';

const updateIngredientServiceMock = jest.spyOn(IngredientService, 'updateIngredient');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
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
      expect(body.error).toMatch(/unexpected internal error/i);
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
      expect(body.error).toMatch(/ingredient not found to update/i);
      expect(updateIngredientServiceMock).toHaveBeenNthCalledWith(1, {
        ingredientId: '639eea5a049fc933bddebab3',
        update: { name: nameUpdateInput },
      });
    });
  });
});
