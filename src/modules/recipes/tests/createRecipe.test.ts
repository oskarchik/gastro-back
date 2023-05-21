/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import * as RecipesService from '../recipes.service';
import { createApp } from 'src/app';
import { redis } from 'src/utils/redis';
import { createRecipeInput, createRecipePayload } from './recipesMother';

const app = createApp();

const recipeInput = createRecipeInput({});
const recipePayload = createRecipePayload({});

const baseApiUrl = '/api/v1/recipes';

const error = new Error('oh noo');

const createRecipesServiceMock = jest.spyOn(RecipesService, 'createRecipe');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
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
describe('UNHAPPY PATH', () => {
  describe('unexpected error while creating recipe', () => {
    it('should return 500 when error', async () => {
      // @ts-ignore
      createRecipesServiceMock.mockRejectedValueOnce(error);

      const { statusCode, body } = await request(app).post(baseApiUrl).send(recipeInput);

      expect(statusCode).toBe(500);
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(createRecipesServiceMock).toHaveBeenNthCalledWith(1, recipeInput);
    });

    describe('wrong data format', () => {
      it('should return 400 bad request is name is missing', async () => {
        // @ts-ignore
        createRecipesServiceMock.mockReturnValueOnce(recipePayload);

        const { statusCode, body } = await request(app)
          .post(baseApiUrl)
          .send({ ...recipeInput, name: undefined });

        expect(statusCode).toBe(400);
        expect(body.error[0].message).toMatch(/name is required/i);
        expect(createRecipesServiceMock).not.toHaveBeenCalled();
      });
    });
  });
});
