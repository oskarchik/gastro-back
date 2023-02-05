import { Router } from 'express';
import {
  findRecipeById,
  findRecipes,
  makeRecipe,
  deleteRecipes,
  deleteRecipeById,
} from './recipes.controller';
import { cache } from 'src/middlewares/cache.middleware';
import { validate } from 'src/middlewares/validationRequest';
import {
  createRecipeSchema,
  deleteRecipeByIdSchema,
  deleteRecipeSchema,
  getRecipeSchema,
} from './recipes.schema';

export const recipesRouter = Router();

recipesRouter.get('/', validate(getRecipeSchema), cache, findRecipes);
recipesRouter.get('/:id', validate(getRecipeSchema), cache, findRecipeById);

recipesRouter.post('/', validate(createRecipeSchema), makeRecipe);

recipesRouter.delete('/', validate(deleteRecipeSchema), deleteRecipes);
recipesRouter.delete('/:id', validate(deleteRecipeByIdSchema), deleteRecipeById);
