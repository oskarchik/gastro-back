import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../../error/ApiError';
import {
  createIngredient,
  getIngredientById,
  getIngredients,
  getIngredientsByAllergen,
  removeAllIngredients,
  removeAllergenicIngredients,
  removeIngredientById,
  removeIngredientsByAllergen,
  removeIngredientsByCategory,
  updateIngredient,
} from './ingredients.service';

export const findIngredients = async (req: Request, res: Response, next: NextFunction) => {
  const { allergenNames } = req.query;

  const parsedQuery = {
    name: req.query.name,
    category: req.query.category,
    hasAllergens: Boolean(req.query.hasAllergens),
    allergens: req.query.allergens,
    allergenNames: req.query.allergenNames,
  };

  if (allergenNames) {
    const parsedNames = Array.isArray(allergenNames) ? allergenNames : [allergenNames.toString()];
    try {
      const foundIngredients = await getIngredientsByAllergen(parsedNames);

      if (!foundIngredients) {
        return next(ApiError.notFound('not ingredients found with given allergens'));
      }
      return res.status(200).send({ data: foundIngredients });
    } catch (error) {
      return next(error);
    }
  }
  try {
    const result = await getIngredients(parsedQuery);

    return res.status(200).send({ data: result });
  } catch (error) {
    return next(error);
  }
};

export const findIngredientById = async (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const foundIngredient = await getIngredientById(ingredientId);

    if (!foundIngredient) {
      return next(ApiError.notFound('Ingredient not found'));
    }

    return res.status(200).send({ data: foundIngredient });
  } catch (error) {
    return next(error);
  }
};
