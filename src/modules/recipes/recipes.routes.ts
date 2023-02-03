import { Router } from 'express';
import { findRecipes, makeRecipe } from './recipes.controller';
import { cache } from 'src/middlewares/cache.middleware';
import { validate } from 'src/middlewares/validationRequest';
import { createRecipeSchema, getRecipeSchema } from './recipes.schema';

export const recipesRouter = Router();

recipesRouter.get('/', validate(getRecipeSchema), cache, findRecipes);

recipesRouter.post('/', validate(createRecipeSchema), makeRecipe);
