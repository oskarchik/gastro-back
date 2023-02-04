import { NextFunction, Request, Response } from 'express';
import { filterProperties } from 'src/utils/filterProperties';
import { redis } from 'src/utils/redis';
import { createRedisKey } from 'src/utils/redisKey';
import {
  createRecipe,
  getRecipes,
  getRecipesByAllergen,
  getRecipesWithName,
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
