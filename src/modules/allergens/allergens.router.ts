import { Router } from 'express';
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
import {
  findAllergens,
  findAllergenById,
  makeAllergen,
  patchAllergen,
  deleteAllAllergens,
  deleteAllergenById,
} from './allergens.controller';

export const allergensRouter = Router();

allergensRouter.get('/:id', findAllergenById);
allergensRouter.get('/', findAllergens);

allergensRouter.post('/', makeAllergen);

allergensRouter.patch('/:id', patchAllergen);

allergensRouter.delete('/', deleteAllAllergens);
allergensRouter.delete('/:id', deleteAllergenById);
// allergensRouter.delete('/:name', removeAllergenByName);
