import { NextFunction, Request, Response } from 'express';
import { filterProperties } from 'src/utils/filterProperties';
import { getRecipes } from './recipes.service';

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
