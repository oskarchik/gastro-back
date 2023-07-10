/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { redis } from 'src/utils/redis';
import { ApiError } from 'src/error/ApiError';
import { createApp } from '../../../app';
import * as AllergenService from '../allergens.service';
import { createAllergenPayload } from './allergenMother';

const app = createApp();

const allergenPayload = createAllergenPayload({});

const nameUpdateInput = 'updated';
const iconUpdateInput = 'updated';

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  redis.flushdb();
});

afterAll(async () => {
  await redis.quit();
});

const updateAllergenServiceMock = jest.spyOn(AllergenService, 'updateAllergen');

describe('HAPPY PATH', () => {
  describe('should return 200 and update allergen', () => {
    it('should return updated name', async () => {
      updateAllergenServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ ...allergenPayload, name: nameUpdateInput });

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/allergens/${allergenPayload._id}`)
        .send({ name: nameUpdateInput });

      expect(statusCode).toBe(200);
      expect(body.data).toMatchObject({ ...allergenPayload, name: nameUpdateInput });
      expect(body.data.name).toEqual(nameUpdateInput);
      expect(updateAllergenServiceMock).toHaveBeenNthCalledWith(1, {
        allergenId: allergenPayload._id,
        update: { name: nameUpdateInput },
      });
    });

    it('should return updated icon', async () => {
      updateAllergenServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ ...allergenPayload, icon: iconUpdateInput });

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/allergens/${allergenPayload._id}`)
        .send({ icon: iconUpdateInput });

      expect(statusCode).toBe(200);
      expect(body.data).toMatchObject({ ...allergenPayload, icon: iconUpdateInput });
      expect(body.data.icon).toEqual(iconUpdateInput);
      expect(updateAllergenServiceMock).toHaveBeenNthCalledWith(1, {
        allergenId: allergenPayload._id,
        update: { icon: iconUpdateInput },
      });
    });

    it('should return updated name and icon', async () => {
      updateAllergenServiceMock
        // @ts-ignore
        .mockReturnValueOnce({ name: nameUpdateInput, icon: iconUpdateInput });

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/allergens/${allergenPayload._id}`)
        .send({ name: nameUpdateInput, icon: iconUpdateInput });

      expect(statusCode).toBe(200);
      expect(body.data).toMatchObject({ name: nameUpdateInput, icon: iconUpdateInput });
      expect(body.data.name).toEqual(nameUpdateInput);
      expect(body.data.icon).toEqual(iconUpdateInput);
      expect(updateAllergenServiceMock).toHaveBeenNthCalledWith(1, {
        allergenId: allergenPayload._id,
        update: { name: nameUpdateInput, icon: iconUpdateInput },
      });
    });
  });
});

describe('UNHAPPY PATH', () => {
  describe('wrong id format provided', () => {
    it('should return 400', async () => {
      const { statusCode, body } = await request(app).patch(
        `/api/v1/allergens/ee639a5a049fc933bdde`
      );

      expect(statusCode).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/invalid id/i);
      expect(updateAllergenServiceMock).not.toHaveBeenCalled();
    });
  });

  describe('wrong id provided', () => {
    it('should return 404', async () => {
      // @ts-ignore
      updateAllergenServiceMock.mockReturnValueOnce(null);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/allergens/ee639a5a049fc933bddebab3`)
        .send({ name: nameUpdateInput, icon: iconUpdateInput });

      expect(statusCode).toBe(404);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(/allergen not found to update/i);
      expect(updateAllergenServiceMock).toHaveBeenNthCalledWith(1, {
        allergenId: 'ee639a5a049fc933bddebab3',
        update: { name: nameUpdateInput, icon: iconUpdateInput },
      });
    });
  });

  describe('unexpected error', () => {
    it('should return 500', async () => {
      updateAllergenServiceMock.mockRejectedValueOnce('ooops');

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/allergens/${allergenPayload._id}`)
        .send({ name: nameUpdateInput, icon: iconUpdateInput });

      expect(statusCode).toBe(500);
      expect(body.error).toBeDefined();
      expect(body.error).toMatch(ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE);
      expect(updateAllergenServiceMock).toHaveBeenNthCalledWith(1, {
        allergenId: allergenPayload._id,
        update: { name: nameUpdateInput, icon: iconUpdateInput },
      });
    });
  });
});
