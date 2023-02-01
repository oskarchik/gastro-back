/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { createApp } from '../../../app';
import * as AllergenService from '../allergens.service';

const app = createApp();

const allergenPayload = {
  _id: 'ee639a5a049fc933bddebab2',
  name: 'test',
  icon: 'test allergen icon',
};

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

const deleteAllergenByIdServiceMock = jest.spyOn(AllergenService, 'removeAllergenById');

const deleteAllAllergensServiceMock = jest.spyOn(AllergenService, 'removeAllAllergens');

const deleteAllergenByNameServiceMock = jest.spyOn(AllergenService, 'removeAllergenByName');

describe('HAPPY PATH', () => {
  describe('deletes allergen by id', () => {
    it('should delete allergen', async () => {
      // @ts-ignore
      deleteAllergenByIdServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app).delete(
        `/api/v1/allergens/ee639a5a049fc933bddebab2`
      );
      expect(statusCode).toBe(200);
      expect(body.message).toBeDefined();
      expect(body.message).toMatch(/deleted allergen ee639a5a049fc933bddebab2/i);
      expect(deleteAllergenByIdServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletes allergen by name', () => {
    it('should delete allergen with name provided', async () => {
      // @ts-ignore
      deleteAllergenByNameServiceMock.mockReturnValueOnce(allergenPayload);
      const { statusCode, body } = await request(app)
        .delete(`/api/v1/allergens`)
        .query({ name: allergenPayload.name });

      expect(statusCode).toBe(200);
      expect(body.message).toBeDefined();
      expect(body.message).toMatch(/removed allergen with name: test/i);
      expect(deleteAllergenByNameServiceMock).toHaveBeenNthCalledWith(1, allergenPayload.name);
    });
  });

  describe('deletes all allergens', () => {
    it('should delete all allergens', async () => {
      // @ts-ignore
      deleteAllAllergensServiceMock.mockReturnValueOnce({});

      const { statusCode, body } = await request(app).delete('/api/v1/allergens');

      expect(statusCode).toBe(200);
      expect(body.message).toBeDefined();
      expect(body.message).toMatch(/deleted all allergens/i);
      expect(deleteAllAllergensServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('UNHAPPY PATH', () => {
  describe('unexpected error deleting all allergens', () => {
    it('should return 500', async () => {
      deleteAllAllergensServiceMock.mockRejectedValueOnce('oops');

      const { statusCode, body } = await request(app).delete(`/api/v1/allergens`);
      expect(statusCode).toBe(500);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteAllergenByIdServiceMock).not.toHaveBeenCalled();
    });
  });

  describe('unexpected error with correct given name', () => {
    it('should return 500', async () => {
      // @ts-ignore
      deleteAllergenByNameServiceMock.mockRejectedValueOnce('ooops');
      const { statusCode, body } = await request(app)
        .delete(`/api/v1/allergens`)
        .query({ name: allergenPayload.name });

      expect(statusCode).toBe(500);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteAllergenByNameServiceMock).toHaveBeenNthCalledWith(1, allergenPayload.name);
    });
  });

  describe('unexpected error with correct id', () => {
    it('should return 500', async () => {
      deleteAllergenByIdServiceMock.mockRejectedValueOnce('ooops');

      const { statusCode, body } = await request(app).delete(
        `/api/v1/allergens/ee639a5a049fc933bddebab2`
      );

      expect(statusCode).toBe(500);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(deleteAllergenByIdServiceMock).toHaveBeenCalled();
    });
  });

  describe('invalid id format provided', () => {
    it('should return 400', async () => {
      const { statusCode, body } = await request(app).delete(
        `/api/v1/allergens/ee639a5a049fc933bdde`
      );

      expect(statusCode).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/invalid id/i);
      expect(deleteAllergenByIdServiceMock).not.toHaveBeenCalled();
    });
  });

  describe('wrong id provided', () => {
    it('should return 404', async () => {
      // @ts-ignore
      deleteAllergenByIdServiceMock.mockReturnValueOnce(null);

      const { statusCode, body } = await request(app).delete(
        `/api/v1/allergens/ee639a5a049fc933bddebab3`
      );

      expect(statusCode).toBe(404);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/allergen not found to delete/i);
      expect(deleteAllergenByIdServiceMock).toHaveBeenNthCalledWith(1, 'ee639a5a049fc933bddebab3');
    });
  });

  describe('wrong name provided', () => {
    it('should return 404', async () => {
      // @ts-ignore
      deleteAllergenByNameServiceMock.mockReturnValueOnce(null);
      const { statusCode, body } = await request(app)
        .delete(`/api/v1/allergens`)
        .query({ name: 'wrong name' });

      expect(statusCode).toBe(404);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/no allergen found with given name/i);
      expect(deleteAllergenByNameServiceMock).toHaveBeenNthCalledWith(1, 'wrong name');
    });
  });
});
