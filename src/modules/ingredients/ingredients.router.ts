import { Router } from 'express';
import { validate } from 'src/middlewares/validationRequest';
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
import { cache } from 'src/middlewares/cache.middleware';
import { paginationMiddleware } from 'src/middlewares/pagination.middleware';

export const ingredientsRouter = Router();

ingredientsRouter.get(
  '/',
  validate(getIngredientSchema),
  paginationMiddleware(),
  cache,
  findIngredients
);
ingredientsRouter.get('/:id', validate(getIngredientByIdSchema), cache, findIngredientById);

ingredientsRouter.post('/', validate(createIngredientSchema), makeIngredient);

ingredientsRouter.delete('/', validate(deleteIngredientSchema), deleteAllIngredients);
ingredientsRouter.delete('/:id', validate(deleteIngredientByIdSchema), deleteIngredientById);

ingredientsRouter.patch('/:id', validate(updateIngredientSchema), patchIngredient);
