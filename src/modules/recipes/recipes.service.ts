import { FilterQuery } from 'mongoose';
import { Request } from 'express';
import { RecipeModel } from './recipes.model';
import { RecipeDocument, RecipeInput } from 'src/types/types';

const fieldsToReturn =
  '_id name category subcategory ingredients ingredientNames hasAllergens allergens allergenNames';

export const getRecipes = async (
  query: FilterQuery<RecipeInput>,
  pagination: Request['pagination']
) => {
  const { offset, limit } = pagination;

  try {
    return await RecipeModel.find(query).skip(offset).limit(limit).select(fieldsToReturn);
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

export const getRecipesWithName = async (name: RegExp, pagination: Request['pagination']) => {
  const { offset, limit } = pagination;
  try {
    return await RecipeModel.find({ name }).skip(offset).limit(limit).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getRecipesByAllergen = async (
  allergens: FilterQuery<RecipeInput>,
  pagination: Request['pagination']
) => {
  const { offset, limit } = pagination;
  try {
    const result = await RecipeModel.find({ allergenNames: { $in: allergens } })
      .skip(offset)
      .limit(limit)
      .select(fieldsToReturn);
    return result;
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

export const updateRecipe = async ({
  recipeId,
  update,
}: {
  recipeId: RecipeDocument['_id'];
  update: FilterQuery<RecipeDocument>;
}) => {
  try {
    return await RecipeModel.findByIdAndUpdate(recipeId, update, { new: true }).select(
      fieldsToReturn
    );
  } catch (error) {
    return error;
  }
};

export const removeRecipes = async (query: FilterQuery<RecipeInput>) => {
  try {
    const deletedRecipes = await RecipeModel.deleteMany(query);
    return deletedRecipes.deletedCount;
  } catch (error) {
    return error;
  }
};

export const removeRecipeById = async (id: RecipeDocument['_id']) => {
  try {
    return await RecipeModel.findByIdAndDelete(id);
  } catch (error) {
    return error;
  }
};
