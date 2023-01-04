/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import { createApp } from '../../../app';
import * as AllergenService from '../allergens.service';

const app = createApp();

const allergenPayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'test',
  icon: 'test allergen icon',
};

const allergenInput = {
  name: 'test',
  icon: 'test allergen icon',
};

const createAllergenServiceMock = jest.spyOn(AllergenService, 'createAllergen');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  // jest.restoreAllMocks();
});

describe('allergens', () => {
  describe('POST/allergen', () => {
    createAllergenServiceMock;
    it('should return allergen payload', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app).post('/api/v1/allergens').send(allergenInput);

      expect(statusCode).toBe(200);
      expect(body.data).toEqual(allergenPayload);
      expect(createAllergenServiceMock).toHaveBeenCalledWith(allergenInput);
    });
    it('should return 400', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockReturnValueOnce(allergenPayload);

      const { statusCode, body } = await request(app)
        .post('/api/v1/allergens')
        .send({ ...allergenInput, name: '' });

      expect(statusCode).toBe(400);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/name is required/i);
      expect(createAllergenServiceMock).not.toHaveBeenCalledTimes(1);
    });
    it('should return 500', async () => {
      // @ts-ignore
      createAllergenServiceMock.mockRejectedValueOnce(new Error('error in test'));

      const { statusCode, body } = await request(app).post('/api/v1/allergens').send(allergenInput);

      expect(statusCode).toBe(500);
      expect(body.error).toBeTruthy();
      expect(body.error).toMatch(/unexpected internal error/i);
      expect(createAllergenServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});
