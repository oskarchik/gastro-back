/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { Model, Query } from 'mongoose';
import { redis } from 'src/utils/redis';
import { createApp } from '../../../app';
import * as AllergenService from '../allergens.service';

const app = createApp();

const allergenPayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'test',
  icon: 'test allergen icon',
};

const getAllergenServiceMock = jest.spyOn(AllergenService, 'getAllergens');
const getAllergenByNameServiceMock = jest.spyOn(AllergenService, 'getAllergensByName');
const getAllergenByIdServiceMock = jest.spyOn(AllergenService, 'getAllergenById');

const countDocumentMock = jest.spyOn(Model, 'countDocuments');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
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
  describe('no allergens in db', () => {
    it('should return an empty array and 200', async () => {
      // @ts-ignore
      getAllergenServiceMock.mockReturnValueOnce([]);
      countDocumentMock.mockReturnValueOnce(0 as unknown as Query<number, unknown>);
      const { statusCode, body } = await request(app).get('/api/v1/allergens');

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(getAllergenServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('there are allergens in db', () => {
    it('should return an array of allergens and 200', async () => {
      // @ts-ignore
      getAllergenServiceMock.mockReturnValueOnce([allergenPayload]);

      const { statusCode, body } = await request(app).get('/api/v1/allergens');

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getAllergenServiceMock).toBeCalledTimes(1);
    });
  });

  describe('allergens by name', () => {
    it('should return 200 and allergen object', async () => {
      // @ts-ignore
      getAllergenByNameServiceMock.mockReturnValueOnce([allergenPayload]);

      const { statusCode, body } = await request(app)
        .get('/api/v1/allergens')
        .query({ name: 'test' });

      expect(statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(1);
      expect(getAllergenByNameServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('allergens by id', () => {
    it('should return 200 and an allergen object', async () => {
      // @ts-ignore
      getAllergenByIdServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app).get(
        `/api/v1/allergens/${allergenPayload._id}`
      );
      expect(statusCode).toBe(200);
      expect(body.data).toEqual(allergenPayload);
      expect(getAllergenByIdServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('UNHAPPY PATH', () => {
  describe('unexpected error getting allergens', () => {
    it('should return 500 if error while getting allergens', async () => {
      // @ts-ignore
      getAllergenServiceMock.mockRejectedValueOnce('Oh no');
      const { statusCode } = await request(app).get('/api/v1/allergens');

      expect(statusCode).toBe(500);
      expect(getAllergenServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('not found error getting allergens by name', () => {
    it('should return 404 if no name found', async () => {
      const { statusCode, body } = await request(app)
        .get('/api/v1/allergens')
        .query({ name: 'no name' });

      expect(statusCode).toBe(404);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/not allergen found with given name/i);
      expect(getAllergenByNameServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('unexpected error getting allergens by name', () => {
    it('should return 500 if error while getting allergens', async () => {
      // @ts-ignore
      getAllergenByNameServiceMock.mockRejectedValueOnce(new Error('ooops'));

      const { statusCode, body } = await request(app)
        .get(`/api/v1/allergens`)
        .query({ name: 'test' });
      expect(statusCode).toBe(500);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getAllergenByNameServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('not found error getting allergens by id', () => {
    it('should return 404 and not found error message', async () => {
      // @ts-ignore
      getAllergenByIdServiceMock.mockReturnValueOnce();

      const { statusCode, body } = await request(app).get(
        `/api/v1/allergens/639eea5a049fc933bddebab2`
      );
      expect(statusCode).toBe(404);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/allergen not found/i);
      expect(getAllergenByIdServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('unexpected error getting allergens by id', () => {
    it('should return 500 error', async () => {
      // @ts-ignore
      getAllergenByIdServiceMock.mockRejectedValueOnce(new Error('ooops'));

      const { statusCode, body } = await request(app).get(
        `/api/v1/allergens/639eea5a049fc933bddebab2`
      );
      expect(statusCode).toBe(500);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(getAllergenByIdServiceMock).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if wrong id format provided', async () => {
      // @ts-ignore
      getAllergenByIdServiceMock.mockRejectedValueOnce('Wrong Id');

      const { statusCode, body } = await request(app).get(`/api/v1/allergens/123245`);
      expect(statusCode).toBe(400);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/invalid id/i);
      expect(getAllergenByIdServiceMock).toHaveBeenCalledTimes(0);
    });
  });
});
