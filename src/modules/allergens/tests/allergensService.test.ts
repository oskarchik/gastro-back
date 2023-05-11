/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import {
  getAllergens,
  getAllergenById,
  getAllergensByName,
  createAllergen,
  updateAllergen,
  removeAllergenById,
  removeAllergenByName,
  removeAllAllergens,
} from '../allergens.service';
import { AllergenModel } from '../allergens.model';

jest.mock('../allergens.model');

const allergenInput = {
  name: 'test',
  icon: 'test allergen icon',
};

const allergenPayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'test',
  icon: 'test allergen icon',
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('allergens service', () => {
  const pagination = { page: 1, limit: 10, offset: 0 };
  describe('getAllergens', () => {
    it('should call allergenModel.find', async () => {
      const getAllergenSpy = jest.spyOn(AllergenModel, 'find');

      getAllergens({}, pagination);
      expect(getAllergenSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllergenById', () => {
    it('should call allergenModel.findById', async () => {
      const getAllergenByIdSpy = jest.spyOn(AllergenModel, 'findById');

      await getAllergenById(allergenPayload._id);

      expect(getAllergenByIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllergenById', () => {
    it('should call allergenModel.find', async () => {
      const getAllergensByNameSpy = jest.spyOn(AllergenModel, 'find');

      await getAllergensByName(allergenInput.name, pagination);

      expect(getAllergensByNameSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAllergen', () => {
    it('should call allergenModel.create', async () => {
      const createAllergenSpy = jest.spyOn(AllergenModel, 'create');

      await createAllergen(allergenInput);

      expect(createAllergenSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle error when creating allergen', async () => {
      const createAllergenSpy = jest
        .spyOn(AllergenModel, 'create')
        // @ts-ignore
        .mockRejectedValueOnce(new Error('error in service test'));
      const result = await createAllergen(allergenInput);

      expect(createAllergenSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('error in service test');
    });
  });

  describe('updateAllergen', () => {
    it('should call allergenModel.findBuIdAndUpdate', async () => {
      const updateAllergenSpy = jest.spyOn(AllergenModel, 'findByIdAndUpdate');

      const update = {
        name: 'mockName',
      };

      await updateAllergen({ allergenId: allergenPayload._id, update });

      expect(updateAllergenSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeAllergenById', () => {
    it('should call allergenModel.findByIdAndDelete', async () => {
      const removeAllergenByIdSpy = jest.spyOn(AllergenModel, 'findByIdAndDelete');

      await removeAllergenById(allergenPayload._id);

      expect(removeAllergenByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle error when removing allergen by id', async () => {
      const removeAllergenByIdSpy = jest
        .spyOn(AllergenModel, 'findByIdAndDelete')
        // @ts-ignore
        .mockRejectedValueOnce(new Error('error in service test removeAllergenById'));

      const result = await removeAllergenById(allergenPayload._id);

      expect(removeAllergenByIdSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('error in service test removeAllergenById');
    });
  });

  describe('removeAllergenByName', () => {
    it('should call allergenModel.findOneAndDelete', async () => {
      const removeAllergenByNameSpy = jest.spyOn(AllergenModel, 'findOneAndDelete');

      await removeAllergenByName(allergenPayload.name);

      expect(removeAllergenByNameSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle error when removing allergen by name', async () => {
      const removeAllergenByNameSpy = jest
        .spyOn(AllergenModel, 'findOneAndDelete')
        // @ts-ignore
        .mockRejectedValueOnce(new Error('error in service test removeAllergenByName'));

      const result = await removeAllergenByName(allergenPayload.name);

      expect(removeAllergenByNameSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('error in service test removeAllergenByName');
    });
  });

  describe('removeAllAllergens', () => {
    it('should call allergenModel.deleteMany', async () => {
      const removeAllAllergenSpy = jest.spyOn(AllergenModel, 'deleteMany');

      await removeAllAllergens();

      expect(removeAllAllergenSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle error when removing all allergens', async () => {
      const removeAllAllergenSpy = jest
        .spyOn(AllergenModel, 'deleteMany')
        // @ts-ignore
        .mockRejectedValueOnce(new Error('error in service test removeAllAllergens'));

      const result = await removeAllAllergens();

      expect(removeAllAllergenSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('error in service test removeAllAllergens');
    });
  });
});
