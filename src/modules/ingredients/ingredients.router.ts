import { Router } from 'express';
import { validate } from 'src/middlewares/validationRequest';
import { paginationMiddleware } from 'src/middlewares/pagination.middleware';
import { cache } from 'src/middlewares/cache.middleware';
import { idValidator } from 'src/middlewares/idValidation.middleware';
import {
  deleteAllIngredients,
  deleteIngredientById,
  findIngredientById,
  findIngredients,
  makeIngredient,
  patchIngredient,
} from './ingredients.controller';
import {
  createIngredientSchema,
  deleteIngredientSchema,
  deleteIngredientByIdSchema,
  getIngredientByIdSchema,
  getIngredientSchema,
  updateIngredientSchema,
} from './ingredients.schema';

export const ingredientsRouter = Router();

ingredientsRouter.get(
  '/',
  validate(getIngredientSchema),
  paginationMiddleware(),
  cache,
  findIngredients
);
ingredientsRouter.get(
  '/:id',
  validate(getIngredientByIdSchema),
  idValidator,
  cache,
  findIngredientById
);

ingredientsRouter.post('/', validate(createIngredientSchema), makeIngredient);

ingredientsRouter.delete('/', validate(deleteIngredientSchema), deleteAllIngredients);
ingredientsRouter.delete(
  '/:id',
  validate(deleteIngredientByIdSchema),
  idValidator,
  deleteIngredientById
);

ingredientsRouter.patch('/:id', validate(updateIngredientSchema), idValidator, patchIngredient);
