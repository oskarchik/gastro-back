import { FilterQuery } from 'mongoose';
import { RecipeModel, RecipeDocument, RecipeInput } from './recipes.model';

const fieldsToReturn =
  '_id name category subcategory ingredients ingredientNames hasAllergens allergens allergenNames';

export const getRecipes = async (query: FilterQuery<RecipeInput>) => {
  try {
    return await RecipeModel.find(query).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getRecipeById = async (id: RecipeDocument['_id']) => {
  try {
    return await RecipeModel.findById(id).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const createRecipe = async (recipe: RecipeInput) => {
  try {
    return await RecipeModel.create(recipe);
  } catch (error) {
    return error;
  }
};
