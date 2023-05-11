import { Router } from 'express';
import {
  findRecipeById,
  findRecipes,
  makeRecipe,
  deleteRecipes,
  deleteRecipeById,
  patchRecipe,
} from './recipes.controller';
import { cache } from 'src/middlewares/cache.middleware';
import { validate } from 'src/middlewares/validationRequest';
import {
  createRecipeSchema,
  deleteRecipeByIdSchema,
  deleteRecipeSchema,
  getRecipeSchema,
  updateRecipeSchema,
} from './recipes.schema';
import { paginationMiddleware } from 'src/middlewares/pagination.middleware';

export const recipesRouter = Router();

recipesRouter.get('/', validate(getRecipeSchema), cache, paginationMiddleware(), findRecipes);
recipesRouter.get('/:id', validate(getRecipeSchema), cache, findRecipeById);

recipesRouter.post('/', validate(createRecipeSchema), makeRecipe);

recipesRouter.delete('/', validate(deleteRecipeSchema), deleteRecipes);
recipesRouter.delete('/:id', validate(deleteRecipeByIdSchema), deleteRecipeById);

recipesRouter.patch('/:id', validate(updateRecipeSchema), patchRecipe);
