import { NextFunction, Request, Response } from 'express';
import { filterProperties } from 'src/utils/filterProperties';
import { isValidId } from 'src/utils/idValidation';
import { ApiError } from '../../error/ApiError';
import { redis } from 'src/utils/redis';
import {
  getIngredients,
  getIngredientById,
  getIngredientsByAllergen,
  createIngredient,
  updateIngredient,
  removeIngredientById,
  removeAllIngredients,
} from './ingredients.service';
import { getPaginatedData } from 'src/middlewares/pagination.middleware';
import { IngredientDocument, Metadata } from 'src/types/types';
import { deleteAllRedisKeys, deleteRedisKeys, updateRedisKeys } from 'src/utils/redisKey';
import { IngredientModel } from './ingredients.model';

export const findIngredients = async (req: Request, res: Response, next: NextFunction) => {
  const { allergenNames } = req.query;
  const { pagination } = req;

  const properties = ['name', 'category', 'hasAllergens', 'allergens', 'allergenNames'];

  const filteredQuery = filterProperties(properties, req.query);

  let info: Metadata | undefined;
  try {
    info = await getPaginatedData(IngredientModel, filteredQuery, req, req.originalUrl);
  } catch (error) {
    return next(error);
  }

  if (allergenNames) {
    const parsedNames = Array.isArray(allergenNames) ? allergenNames : [allergenNames.toString()];

    try {
      const foundIngredients = await getIngredientsByAllergen(parsedNames, pagination);

      redis.setex(
        `ingredients_allergen_${parsedNames}_limit=${pagination.limit}_page=${pagination.page}`,
        3600,
        JSON.stringify(foundIngredients)
      );

      return res.status(200).send({ info, data: foundIngredients });
    } catch (error) {
      return next(error);
    }
  }
  try {
    const foundIngredients = await getIngredients(filteredQuery, pagination);

    Object.keys(filteredQuery).length > 0
      ? redis.setex(
          `ingredients_${Object.keys(filteredQuery)}_limit=${pagination.limit}_page=${
            pagination.page
          }`,
          3600,
          JSON.stringify(foundIngredients)
        )
      : redis.setex(
          `ingredients_limit=${pagination.limit}_page=${pagination.page}`,
          3600,
          JSON.stringify(foundIngredients)
        );

    return res.status(200).send({ info, data: foundIngredients });
  } catch (error) {
    return next(error);
  }
};

export const findIngredientById = async (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.id;

  if (!isValidId(ingredientId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const foundIngredient = await getIngredientById(ingredientId);

    if (!foundIngredient) {
      return next(ApiError.notFound('Ingredient not found'));
    }

    redis.setex(`ingredientsId_${ingredientId}`, 3600, JSON.stringify(foundIngredient));

    return res.status(200).send({ data: foundIngredient });
  } catch (error) {
    return next(error);
  }
};

export const makeIngredient = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category, hasAllergens, allergens, allergenNames } = req.body;

  if (!name || hasAllergens === undefined) {
    return next(ApiError.badRequest('name and hasAllergens are required'));
  }

  try {
    const savedIngredient = await createIngredient({
      name,
      category,
      hasAllergens,
      allergens,
      allergenNames,
    });

    await deleteRedisKeys('ingredients');

    return res.status(200).send({ data: savedIngredient });
  } catch (error) {
    return next(error);
  }
};

export const deleteAllIngredients = async (req: Request, res: Response, next: NextFunction) => {
  const properties = ['name', 'category', 'hasAllergens', 'allergens', 'allergenNames'];

  const filteredQuery = filterProperties(properties, req.query);

  try {
    const result = await removeAllIngredients(filteredQuery);

    await deleteAllRedisKeys('allergens');

    return res.status(200).send({ message: `${result} ingredients deleted from db` });
  } catch (error) {
    return next(error);
  }
};

export const deleteIngredientById = async (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.id;

  if (!isValidId(ingredientId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const deletedIngredient = await removeIngredientById(ingredientId);

    if (deletedIngredient === null) {
      return next(ApiError.notFound('Ingredient not found to delete'));
    }

    return res.status(200).send({ message: `Deleted ingredient ${ingredientId}` });
  } catch (error) {
    return next(error);
  }
};

export const patchIngredient = async (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.id;

  if (!isValidId(ingredientId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  const update = req.body;

  try {
    const updatedIngredient = await updateIngredient({ ingredientId, update });

    if (updatedIngredient === null) {
      return next(ApiError.notFound('Ingredient not found to update'));
    }

    await updateRedisKeys({
      controller: 'allergens',
      document: updatedIngredient as IngredientDocument,
    });
    return res.status(200).send({ data: updatedIngredient });
  } catch (error) {
    return next(error);
  }
};
