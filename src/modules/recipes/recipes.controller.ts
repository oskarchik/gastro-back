import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/error/ApiError';
import { filterProperties } from 'src/utils/filterProperties';
import { createRecipe, getRecipes } from './recipes.service';

export const findRecipes = async (req: Request, res: Response, next: NextFunction) => {
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
