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
