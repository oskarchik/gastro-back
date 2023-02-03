import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/error/ApiError';
import { filterProperties } from 'src/utils/filterProperties';
import { redis } from 'src/utils/redis';
import { createRecipe, getRecipes, getRecipesWithName } from './recipes.service';

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

  const regexName = new RegExp(recipeName);

  if (recipeName) {
    try {
      const foundRecipes = await getRecipesWithName(regexName);

      redis.setex(`recipes_name_${recipeName}`, 3600, JSON.stringify(foundRecipes));
      return res.status(200).send({ data: foundRecipes });
    } catch (error) {
      return next(error);
    }
  }
  const filteredQuery = filterProperties(properties, req.query);

  try {
    const foundRecipes = await getRecipes(filteredQuery);

    return res.status(200).send({ data: foundRecipes });
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

  if (!name || hasAllergens === undefined) {
    return next(ApiError.badRequest('name and hasAllergens are required'));
  }

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
