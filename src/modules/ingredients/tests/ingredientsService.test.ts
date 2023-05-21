/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */

import {
  createIngredient,
  getIngredientById,
  getIngredients,
  getIngredientsByAllergen,
  removeAllIngredients,
  removeIngredientById,
  removeIngredientsByAllergen,
  updateIngredient,
} from '../ingredients.service';
import { IngredientModel } from '../ingredients.model';
import { createIngredientInput, createIngredientPayload } from './ingredientMother';

jest.mock('../ingredients.model');

const ingredientInput = createIngredientInput({});
const ingredientPayload = createIngredientPayload({});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

const createIngredientSpy = jest.spyOn(IngredientModel, 'create');
const removeAllIngredientsSpy = jest.spyOn(IngredientModel, 'deleteMany');
const removeIngredientByIdSpy = jest.spyOn(IngredientModel, 'findByIdAndDelete');

describe('ingredients service', () => {
  const filteredQuery = {};
  const pagination = { page: 1, limit: 10, offset: 0 };
  describe('createIngredient', () => {
    it('should call ingredientModel.create with given ingredient input', async () => {
      await createIngredient(ingredientInput);

      expect(createIngredientSpy).toHaveBeenNthCalledWith(1, ingredientInput);
    });
    it('should handle error when creating ingredient', async () => {
      // @ts-ignore
      createIngredientSpy.mockRejectedValue(new Error('oh no!'));

      const result = await createIngredient(ingredientInput);

      expect(createIngredientSpy).toHaveBeenNthCalledWith(1, ingredientInput);
      // @ts-ignore
      expect(result.message).toEqual('oh no!');
    });
  });

  describe('getAllergenicIngredients', () => {
    it('should call ingredientsModel.find with given allergen name', async () => {
      const query = { ...filteredQuery, hasAllergens: true };
      const getAllergenicIngredientsSpy = jest.spyOn(IngredientModel, 'find');

      await getIngredients(query, pagination);

      expect(getAllergenicIngredientsSpy).toHaveBeenNthCalledWith(1, {
        hasAllergens: ingredientInput.hasAllergens,
      });
    });
  });

  describe('getIngredientsById', () => {
    it('should call ingredientsModel.findById', async () => {
      const getIngredientsByIdSpy = jest.spyOn(IngredientModel, 'findById');

      await getIngredientById(ingredientPayload._id);
      expect(getIngredientsByIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIngredients', () => {
    it('should call ingredientModel.find', async () => {
      const getIngredientsSpy = jest.spyOn(IngredientModel, 'find');

      await getIngredients({}, pagination);
      expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIngredientsByAllergen', () => {
    it('should call ingredientModel.find with given allergen name', async () => {
      const getIngredientByAllergenSpy = jest.spyOn(IngredientModel, 'find');
      const query = { ...filteredQuery, allergenNames: ingredientInput.allergenNames };
      await getIngredientsByAllergen(query.allergenNames, pagination);

      expect(getIngredientByAllergenSpy).toHaveBeenNthCalledWith(1, {
        allergenNames: { $in: query.allergenNames },
      });
    });
  });

  describe('getIngredientsByName', () => {
    it('should call ingredientModel.find with given ingredient name', async () => {
      const getIngredientByNameSpy = jest.spyOn(IngredientModel, 'find');
      const query = { ...filteredQuery, name: ingredientInput.name };
      await getIngredients(query, pagination);

      expect(getIngredientByNameSpy).toHaveBeenNthCalledWith(1, { name: ingredientInput.name });
    });
  });

  describe('getIngredientsByCategory', () => {
    it('should call ingredientModel.find with given category name', async () => {
      const getIngredientByCategorySpy = jest.spyOn(IngredientModel, 'find');

      const query = { ...filteredQuery, category: ingredientInput.category };
      await getIngredients(query, pagination);

      expect(getIngredientByCategorySpy).toHaveBeenNthCalledWith(1, {
        category: ingredientInput.category,
      });
    });
  });

  describe('removeAllIngredients', () => {
    it('should call ingredientModel.deleteMany ', async () => {
      await removeAllIngredients({});

      expect(removeAllIngredientsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeAllAllergenicIngredients', () => {
    it('should call ingredientModel.deleteMany with given allergenic property ', async () => {
      await removeAllIngredients({ hasAllergens: true });

      expect(removeAllIngredientsSpy).toHaveBeenNthCalledWith(1, { hasAllergens: true });
    });
  });

  describe('removeIngredientById', () => {
    it('should call ingredientModel.findByIdAndDelete with given ingredient id ', async () => {
      await removeIngredientById(ingredientPayload._id);

      expect(removeIngredientByIdSpy).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
    it('should handle error when deleting ingredient by id', async () => {
      removeIngredientByIdSpy.mockRejectedValueOnce('oh no!');
      await removeIngredientById(ingredientPayload._id);

      expect(removeIngredientByIdSpy).toHaveBeenNthCalledWith(1, ingredientPayload._id);
    });
  });

  describe('removeIngredientsByAllergen', () => {
    it('should call ingredientModel.deleteMany with given allergen name ', async () => {
      await removeIngredientsByAllergen(ingredientInput.allergens);

      expect(removeAllIngredientsSpy).toHaveBeenNthCalledWith(1, {
        allergens: { $in: ingredientInput.allergens },
      });
    });
    it('should handle error when deleting ingredients by allergen', async () => {
      removeAllIngredientsSpy.mockRejectedValueOnce('oh no!!');

      await removeIngredientsByAllergen(ingredientInput.allergens);

      expect(removeAllIngredientsSpy).toHaveBeenNthCalledWith(1, {
        allergens: { $in: ingredientInput.allergens },
      });
    });
  });

  describe('removeIngredientsByCategory', () => {
    it('should call ingredientModel.deleteMany with given category name ', async () => {
      await removeAllIngredients({ category: ingredientInput.category });

      expect(removeAllIngredientsSpy).toHaveBeenNthCalledWith(1, {
        category: ingredientInput.category,
      });
    });
  });

  describe('updateIngredient', () => {
    it('should call ingredientModel.findByIdAndUpdate with given category name ', async () => {
      const updateIngredientSpy = jest.spyOn(IngredientModel, 'findByIdAndUpdate');

      const update = {
        name: 'new name',
      };

      await updateIngredient({ ingredientId: ingredientPayload._id, update });

      expect(updateIngredientSpy).toHaveBeenNthCalledWith(1, ingredientPayload._id, update, {
        new: true,
      });
    });
  });
});
