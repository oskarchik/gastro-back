import { Router } from 'express';
import { findIngredientById, findIngredients } from './ingredients.controller';

export const ingredientsRouter = Router();

ingredientsRouter.get('/', findIngredients);
ingredientsRouter.get('/:id', findIngredientById);
