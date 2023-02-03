/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  removeRecipes,
  removeRecipeById,
  getRecipesWithName,
} from '../recipes.service';
import { RecipeInput, RecipeModel } from '../recipes.model';

jest.mock('../recipes.model');

const recipeInput: RecipeInput = {
  name: 'paella',
  category: 'main',
  subCategory: 'rice',
  ingredients: ['639eea5a049fc933bddebab2'],
  ingredientNames: ['rice', 'green beans', 'chicken'],
  hasAllergens: false,
  allergens: [],
  allergenNames: [],
};

const recipePayload = {
  _id: '639eea5a049fc933bddebab2',
  name: 'paella',
  subCategory: 'rice',
  ingredients: ['639eea5a049fc933bddebab2'],
  ingredientNames: ['rice', 'green beans', 'chicken'],
  hasAllergens: false,
  allergens: [],
  allergenNames: [],
};

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

const getRecipeSpy = jest.spyOn(RecipeModel, 'find');
const getRecipeByIdSpy = jest.spyOn(RecipeModel, 'findById');
const createRecipeSpy = jest.spyOn(RecipeModel, 'create');
const updateRecipeSpy = jest.spyOn(RecipeModel, 'findByIdAndUpdate');
const removeRecipesSpy = jest.spyOn(RecipeModel, 'deleteMany');
const removeRecipeByIdSpy = jest.spyOn(RecipeModel, 'findByIdAndDelete');

describe('recipes service', () => {
  describe('getRecipes', () => {
    it('should call recipesModel.find and return a recipe object', async () => {
      await getRecipes({});

      expect(getRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call recipesModel.find and return an error', async () => {
      const result = await getRecipes({});

      expect(getRecipeSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toBeDefined();
      // @ts-ignore
      expect(result.stack).toBeDefined();
    });
  });

  describe('getRecipeById', () => {
    it('should call recipesModel.findById and return a recipe object', async () => {
      await getRecipeById(recipePayload._id);

      expect(getRecipeByIdSpy).toHaveBeenNthCalledWith(1, recipePayload._id);
    });

    it('should call recipesModel.findById and return an error', async () => {
      const result = await getRecipeById(recipePayload._id);

      expect(getRecipeByIdSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toBeDefined();
      // @ts-ignore
      expect(result.stack).toBeDefined();
    });
  });

  describe('getRecipesWithName', () => {
    it('should call recipesModel.find and return an array of recipe objects', async () => {
      const regex = /paella/i;
      await getRecipesWithName(regex);

      expect(getRecipeSpy).toHaveBeenNthCalledWith(1, { name: regex });
    });
  });

  describe('createRecipe', () => {
    it('should call recipe.create with given recipe input', async () => {
      await createRecipe(recipeInput);

      expect(createRecipeSpy).toHaveBeenNthCalledWith(1, recipeInput);
    });

    it('should call recipe.create with given recipe input and return an error', async () => {
      // @ts-ignore
      createRecipeSpy.mockRejectedValueOnce(new Error('oh nooo'));

      const result = await createRecipe(recipeInput);

      expect(createRecipeSpy).toHaveBeenNthCalledWith(1, recipeInput);
      // @ts-ignore
      expect(result.message).toEqual('oh nooo');
    });
  });

  describe('updateRecipe', () => {
    it('should call recipesModel.findByIAndUpdate and return a recipe object', async () => {
      await updateRecipe({ recipeId: recipePayload._id, update: { name: 'new paella' } });

      expect(updateRecipeSpy).toHaveBeenNthCalledWith(
        1,
        recipePayload._id,
        { name: 'new paella' },
        { new: true }
      );
    });

    it('should call recipesModel.findByIAndUpdate and return an error', async () => {
      const result = await updateRecipe({
        recipeId: recipePayload._id,
        update: { name: 'new paella' },
      });

      expect(updateRecipeSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toBeDefined();
      // @ts-ignore
      expect(result.stack).toBeDefined();
    });
  });

  describe('removeRecipes', () => {
    it('should call recipesModel.deleteMany and return a recipe object', async () => {
      await removeRecipes({});

      expect(removeRecipesSpy).toHaveBeenNthCalledWith(1, {});
    });

    it('should call recipesModel.findById and return an error', async () => {
      removeRecipesSpy.mockRejectedValueOnce(new Error('oh nooo'));
      const result = await removeRecipes({});

      expect(removeRecipesSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('oh nooo');
    });
  });

  describe('removeRecipeById', () => {
    it('should call recipesModel.findById and return a recipe object', async () => {
      await removeRecipeById(recipePayload._id);

      expect(removeRecipeByIdSpy).toHaveBeenNthCalledWith(1, recipePayload._id);
    });

    it('should call recipesModel.findById and return an error', async () => {
      removeRecipeByIdSpy.mockRejectedValueOnce(new Error('oh nooo'));
      const result = await removeRecipeById(recipePayload._id);

      expect(removeRecipeByIdSpy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(result.message).toEqual('oh nooo');
    });
  });
});
