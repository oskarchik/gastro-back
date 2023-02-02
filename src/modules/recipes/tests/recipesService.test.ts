/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getRecipes, getRecipeById } from '../recipes.service';
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
});
