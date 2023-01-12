/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import * as IngredientsService from '../ingredients.service';
import { IngredientDocument, IngredientInput } from '../ingredients.model';
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

const deleteIngredientsServiceMock = jest.spyOn(IngredientsService, 'removeAllIngredients');
const deleteIngredientByIdServiceMock = jest.spyOn(IngredientsService, 'removeIngredientById');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('HAPPY PATH', () => {
  describe('deletes all ingredients', () => {
    it('should remove all ingredients in db', async () => {
      // @ts-ignore
      deleteIngredientsServiceMock.mockReturnValueOnce(4);

      const { statusCode, body } = await request(app).delete(baseApiUrl);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/4 ingredients deleted from db/i);
      expect(deleteIngredientsServiceMock).toHaveBeenNthCalledWith(1, {});
    });
  });
  describe('delete all ingredients of a category', () => {
    it('should remove all ingredients with given category', async () => {
      // @ts-ignore
      deleteIngredientsServiceMock.mockReturnValueOnce(3);

      const { statusCode, body } = await request(app)
        .delete(baseApiUrl)
        .query({ category: 'eggs' });

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/3 ingredients deleted from db/i);
      expect(deleteIngredientsServiceMock).toHaveBeenNthCalledWith(1, { category: 'eggs' });
    });
  });
  describe('delete all ingredients by name', () => {
    it('should remove all ingredients with given name', async () => {
      // @ts-ignore
      deleteIngredientsServiceMock.mockReturnValueOnce(1);

      const { statusCode, body } = await request(app)
        .delete(baseApiUrl)
        .query({ name: 'ingredient 1' });

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/1 ingredients deleted from db/i);
      expect(deleteIngredientsServiceMock).toHaveBeenNthCalledWith(1, { name: 'ingredient 1' });
    });
  });
  describe('delete all ingredients that have allergens', () => {
    it('should remove all ingredients with allergens', async () => {
      // @ts-ignore
      deleteIngredientsServiceMock.mockReturnValueOnce(6);

      const { statusCode, body } = await request(app)
        .delete(baseApiUrl)
        .query({ hasAllergens: true });

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/6 ingredients deleted from db/i);
      expect(deleteIngredientsServiceMock).toHaveBeenNthCalledWith(1, { hasAllergens: true });
    });
  });
  describe('deletes ingredient by id', () => {
    it('should remove ingredient with given id', async () => {
      // @ts-ignore
      deleteIngredientByIdServiceMock.mockReturnValueOnce(ingredientPayload);

      const { statusCode, body } = await request(app).delete(
        `${baseApiUrl}/${ingredientPayload._id}`
      );

      expect(statusCode).toBe(200);
      expect(body.message).toEqual(`Deleted ingredient ${ingredientPayload._id}`);
      expect(deleteIngredientByIdServiceMock).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
  });
});
describe('UNHAPPY PATH', () => {
  describe('unexpected error', () => {
    it('should return 500 error while deleting ingredients', async () => {
      // @ts-ignore
      deleteIngredientsServiceMock.mockRejectedValueOnce('oh no!');

      const { statusCode, body } = await request(app).delete(baseApiUrl);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteIngredientsServiceMock).toHaveBeenNthCalledWith(1, {});
    });
    it('should return 500 error while deleting ingredient by id', async () => {
      // @ts-ignore
      deleteIngredientByIdServiceMock.mockRejectedValueOnce('oh no!');

      const { statusCode, body } = await request(app).delete(
        `${baseApiUrl}/${ingredientPayload._id}`
      );

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteIngredientByIdServiceMock).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
  });
  describe('bad request error', () => {
    it('should return 400 error with wrong id format', async () => {
      // @ts-ignore
      deleteIngredientByIdServiceMock.mockReturnValueOnce(ingredientPayload);

      const { statusCode, body } = await request(app).delete(`${baseApiUrl}/1234`);

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/invalid id/i);
      expect(deleteIngredientsServiceMock).not.toHaveBeenCalled();
    });
  });
  describe('not found error', () => {
    it('should return 404 if given ingredient to delete is not found', async () => {
      // @ts-ignore
      deleteIngredientByIdServiceMock.mockReturnValueOnce(null);

      const { statusCode, body } = await request(app).delete(
        `${baseApiUrl}/639eea5a049fc933bddebab1`
      );

      expect(statusCode).toBe(404);
      expect(body.error).toMatch(/ingredient not found to delete/i);
      expect(deleteIngredientByIdServiceMock).toHaveBeenNthCalledWith(
        1,
        '639eea5a049fc933bddebab1'
      );
    });
  });
});
