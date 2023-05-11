import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isValidId } from 'src/utils/idValidation';
import { getPaginatedData } from 'src/middlewares/pagination.middleware';
import { filterProperties } from 'src/utils/filterProperties';
import { Metadata, AllergenDocument } from 'src/types/types';
import { deleteAllRedisKeys, deleteRedisKeys, updateRedisKeys } from 'src/utils/redisKey';
import { redis } from 'src/utils/redis';
import { ApiError } from '../../error/ApiError';
import {
  getAllergens,
  getAllergenById,
  getAllergensByName,
  createAllergen,
  updateAllergen,
  removeAllergenById,
  removeAllergenByName,
  removeAllAllergens,
} from './allergens.service';
import { AllergenModel } from './allergens.model';

export const findAllergens = async (req: Request, res: Response, next: NextFunction) => {
  const allergenName = req.query.name;
  const { query, pagination } = req;

  const property = ['name'];

  const filteredQuery = filterProperties(property, req.query);

  let info: Metadata | undefined;
  try {
    info = await getPaginatedData(AllergenModel, filteredQuery, req, req.originalUrl);
  } catch (error) {
    return next(error);
  }

  if (allergenName) {
    try {
      const foundAllergens = await getAllergensByName(String(allergenName), pagination);
      if (!foundAllergens) {
        return next(ApiError.notFound('not allergen found with given name'));
      }

      redis.setex(
        `allergens_${allergenName}_limit=${pagination.limit}_page=${pagination.page}`,
        3600,
        JSON.stringify(foundAllergens)
      );

      return res.status(200).send({ info, data: foundAllergens });
    } catch (error) {
      return next(error);
    }
  }
  try {
    const foundAllergens = await getAllergens(query, pagination);

    redis.setex(
      `allergens_limit=${pagination.limit}_page=${pagination.page}`,
      3600,
      JSON.stringify(foundAllergens)
    );

    return res.status(200).send({ info, data: foundAllergens });
  } catch (error) {
    return next(error);
  }
};

export const findAllergenById = async (req: Request, res: Response, next: NextFunction) => {
  const allergenId = req.params.id;

  if (!isValidId(allergenId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const foundAllergen = await getAllergenById(allergenId);

    if (!foundAllergen) {
      return next(ApiError.notFound('Allergen not found'));
    }

    redis.setex(`allergensId_${allergenId}`, 3600, JSON.stringify(foundAllergen));
    return res.status(200).send({ data: foundAllergen });
  } catch (error) {
    return next(error);
  }
};

export const makeAllergen = async (req: Request, res: Response, next: NextFunction) => {
  const { name, icon } = req.body;
  if (!name) {
    return next(ApiError.badRequest('Name is required'));
  }
  try {
    const savedAllergen = await createAllergen({ name, icon });

    await deleteRedisKeys('allergens');
    return res.status(200).send({ data: savedAllergen });
  } catch (error) {
    return next(error);
  }
};

export const patchAllergen = async (req: Request, res: Response, next: NextFunction) => {
  const allergenId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(allergenId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  const update = {
    name: req.body.name,
    icon: req.body.icon,
  };

  try {
    const updatedAllergen = await updateAllergen({ allergenId, update });

    if (updatedAllergen === null) {
      return next(ApiError.notFound('allergen not found to update'));
    }

    await updateRedisKeys({
      controller: 'allergens',
      document: updatedAllergen as AllergenDocument,
    });

    return res.status(200).send({ data: updatedAllergen });
  } catch (error) {
    return next(error);
  }
};

export const deleteAllAllergens = async (req: Request, res: Response, next: NextFunction) => {
  const allergenName = req.query.name;

  if (allergenName) {
    try {
      const deletedAllergen = await removeAllergenByName(String(allergenName));
      if (deletedAllergen === null) {
        return next(ApiError.notFound('No allergen found with given name'));
      }

      return res.status(200).send({ message: `removed allergen with name: ${allergenName}` });
    } catch (error) {
      return next(error);
    }
  }
  try {
    await removeAllAllergens();
    await deleteAllRedisKeys('allergens');

    return res.status(200).send({ message: 'Deleted all allergens' });
  } catch (error) {
    return next(error);
  }
};

export const deleteAllergenById = async (req: Request, res: Response, next: NextFunction) => {
  const allergenId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(allergenId)) {
    return next(ApiError.badRequest('Invalid id'));
  }

  try {
    const deletedAllergen = await removeAllergenById(allergenId);

    if (deletedAllergen === null) {
      return next(ApiError.notFound('Allergen not found to delete'));
    }

    await deleteAllRedisKeys('allergens');

    return res.status(200).send({ message: `Deleted allergen ${allergenId}` });
  } catch (error) {
    return next(error);
  }
};
