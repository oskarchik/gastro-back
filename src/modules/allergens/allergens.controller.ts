import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isValidId } from 'src/utils/idValidation';
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

export const findAllergens = async (req: Request, res: Response, next: NextFunction) => {
  const allergenName = req.query.name;
  const { query } = req;

  if (allergenName) {
    try {
      const foundAllergens = await getAllergensByName(String(allergenName));
      if (!foundAllergens) {
        return next(ApiError.notFound('not allergen found with given name'));
      }
      return res.status(200).send({ data: foundAllergens });
    } catch (error) {
      return next(error);
    }
  }
  try {
    const foundAllergens = await getAllergens(query);

    return res.status(200).send({ data: foundAllergens });
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

    return res.status(200).send({ message: `Deleted allergen ${allergenId}` });
  } catch (error) {
    return next(error);
  }
};
