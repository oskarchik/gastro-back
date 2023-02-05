import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/error/ApiError';
import { filterProperties } from 'src/utils/filterProperties';
import { isValidId } from 'src/utils/idValidation';
import { redis } from 'src/utils/redis';
import { createRedisKey } from 'src/utils/redisKey';
import {
  createRecipe,
  getRecipeById,
  getRecipes,
  getRecipesByAllergen,
  getRecipesWithName,
  removeRecipeById,
  removeRecipes,
} from './recipes.service';

export const findRecipes = async (req: Request, res: Response, next: NextFunction) => {
  const properties = [
    'category',
    'subCategory',
    'ingredients',
    'ingredientNames',
    'hasAllergens',
    'allergens',
    'allergenNames',
  ];

  const recipeName = req.query.name as string;
  const { allergenNames } = req.query;

  if (recipeName) {
    const regexName = new RegExp(recipeName);

    try {
      const foundRecipes = await getRecipesWithName(regexName);

      redis.setex(`recipes_name_${recipeName}`, 3600, JSON.stringify(foundRecipes));

      return res.status(200).send({ data: foundRecipes });
    } catch (error) {
      return next(error);
    }
  }
  if (allergenNames) {
    const parsedNames = Array.isArray(allergenNames) ? allergenNames : [allergenNames.toString()];

    try {
      const foundRecipes = await getRecipesByAllergen(parsedNames);

      redis.setex(`recipes_allergen_${parsedNames}`, 3600, JSON.stringify(foundRecipes));

      return res.status(200).send({ data: foundRecipes });
    } catch (error) {
      return next(error);
    }
  }

  const filteredQuery = filterProperties(properties, req.query);

  try {
    const foundRecipes = await getRecipes(filteredQuery);

    await redis.setex(
      createRedisKey({ queryObject: filteredQuery, controller: 'recipes' }) as string,
      3600,
      JSON.stringify(foundRecipes)
    );

    return res.status(200).send({ data: foundRecipes });
  } catch (error) {
    return next(error);
  }
};

export const findRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  const recipeId = req.params.id;

  if (!isValidId(recipeId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const foundRecipe = await getRecipeById(recipeId);

    if (!foundRecipe) {
      return next(ApiError.notFound('Recipe not found'));
    }

    redis.setex(`recipes_${recipeId}`, 3600, JSON.stringify(foundRecipe));

    return res.status(200).send({ data: foundRecipe });
  } catch (error) {
    return next(error);
  }
};

export const makeRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    category,
    subCategory,
    ingredients,
    ingredientNames,
    hasAllergens,
    allergens,
    allergenNames,
  } = req.body;

  try {
    const savedRecipe = await createRecipe({
      name,
      category,
      subCategory,
      ingredients,
      ingredientNames,
      hasAllergens,
      allergens,
      allergenNames,
    });

    return res.status(200).send({ data: savedRecipe });
  } catch (error) {
    return next(error);
  }
};

export const deleteRecipes = async (req: Request, res: Response, next: NextFunction) => {
  const properties = [
    'name',
    'category',
    'subCategory',
    'ingredients',
    'ingredientNames',
    'hasAllergens',
    'allergens',
    'allergenNames',
  ];

  const filteredQuery = filterProperties(properties, req.query);

  try {
    const result = await removeRecipes(filteredQuery);

    return res.status(200).send({ message: `${result} recipes deleted from db` });
  } catch (error) {
    return next(error);
  }
};

export const deleteRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  const recipeId = req.params.id;

  if (!isValidId(recipeId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const deletedRecipe = await removeRecipeById(recipeId);

    if (deletedRecipe === null) {
      return next(ApiError.notFound('Recipe not found to delete'));
    }

    return res.status(200).send({ message: `Deleted Recipe ${recipeId}` });
  } catch (error) {
    return next(error);
  }
};
