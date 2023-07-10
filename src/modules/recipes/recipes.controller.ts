import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/error/ApiError';
import { filterProperties } from 'src/utils/filterProperties';
import { redis } from 'src/utils/redis';
import {
  createRedisKey,
  deleteAllRedisKeys,
  deleteRedisKeys,
  updateRedisKeys,
} from 'src/utils/redisKey';
import { Metadata, RecipeDocument } from 'src/types/types';
import {
  createRecipe,
  getRecipeById,
  getRecipes,
  getRecipesByAllergen,
  getRecipesWithName,
  removeRecipeById,
  removeRecipes,
  updateRecipe,
} from './recipes.service';
import { getPaginatedData } from 'src/middlewares/pagination.middleware';
import { RecipeModel } from './recipes.model';

export const findRecipes = async (req: Request, res: Response, next: NextFunction) => {
  const { allergenNames } = req.query;
  const { pagination } = req;
  const recipeName = req.query.name as string;

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

  let info: Metadata | undefined;
  try {
    info = await getPaginatedData(RecipeModel, filteredQuery, req, req.originalUrl);
  } catch (error) {
    return next(error);
  }

  if (recipeName) {
    const regexName = new RegExp(recipeName);

    try {
      const foundRecipes = await getRecipesWithName(regexName, pagination);

      redis.setex(
        `recipes_name_${recipeName}_limit=${pagination.limit}_page=${pagination.page}`,
        3600,
        JSON.stringify(foundRecipes)
      );

      return res.status(200).send({ info, data: foundRecipes });
    } catch (error) {
      return next(error);
    }
  }
  if (allergenNames) {
    const parsedNames = Array.isArray(allergenNames) ? allergenNames : [allergenNames.toString()];

    try {
      const foundRecipes = await getRecipesByAllergen(parsedNames, pagination);

      redis.setex(
        `recipes_allergen_${parsedNames}_limit=${pagination.limit}_page=${pagination.page}`,
        3600,
        JSON.stringify(foundRecipes)
      );

      return res.status(200).send({ info, data: foundRecipes });
    } catch (error) {
      return next(error);
    }
  }

  try {
    const foundRecipes = await getRecipes(filteredQuery, pagination);

    const redisKey = createRedisKey({
      queryObject: filteredQuery,
      controller: 'recipes',
    }) as string;
    await redis.setex(
      `${redisKey}_limit=${pagination.limit}_page=${pagination.page}`,
      3600,
      JSON.stringify(foundRecipes)
    );

    return res.status(200).send({ info, data: foundRecipes });
  } catch (error) {
    return next(error);
  }
};

export const findRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  const recipeId = req.params.id;

  try {
    const foundRecipe = await getRecipeById(recipeId);

    if (!foundRecipe) {
      return next(ApiError.notFound('Recipe not found'));
    }

    redis.setex(`recipesId_${recipeId}`, 3600, JSON.stringify(foundRecipe));

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

    await deleteRedisKeys('recipes');

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

    await deleteAllRedisKeys('recipes');

    return res.status(200).send({ message: `${result} recipes deleted from db` });
  } catch (error) {
    return next(error);
  }
};

export const deleteRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  const recipeId = req.params.id;

  try {
    const deletedRecipe = await removeRecipeById(recipeId);

    if (deletedRecipe === null) {
      return next(ApiError.notFound('Recipe not found to delete'));
    }

    await deleteAllRedisKeys('recipes');
    return res.status(200).send({ message: `Deleted Recipe ${recipeId}` });
  } catch (error) {
    return next(error);
  }
};

export const patchRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const recipeId = req.params.id;

  const update = req.body;

  try {
    const updatedRecipe = await updateRecipe({ recipeId, update });

    if (updatedRecipe === null) {
      return next(ApiError.notFound('Recipe not found to update'));
    }

    await updateRedisKeys({ controller: 'recipes', document: updatedRecipe as RecipeDocument });

    return res.status(200).send({ data: updatedRecipe });
  } catch (error) {
    return next(error);
  }
};
