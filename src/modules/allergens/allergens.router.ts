import { Router } from 'express';
import {
  findAllergens,
  findAllergenById,
  makeAllergen,
  patchAllergen,
  deleteAllAllergens,
  deleteAllergenById,
} from './allergens.controller';
import { validate } from 'src/middlewares/validationRequest';
import {
  getAllergensByIdSchema,
  getAllergenSchema,
  creteAllergenSchema,
  updateAllergenSchema,
  deleteAllergenSchema,
  deleteAllergenByIdSchema,
} from './allergens.schema';
import { cache } from 'src/middlewares/cache.middleware';
import { paginationMiddleware } from 'src/middlewares/pagination.middleware';

export const allergensRouter = Router();

allergensRouter.get('/:id', validate(getAllergensByIdSchema), cache, findAllergenById);
allergensRouter.get('/', validate(getAllergenSchema), cache, paginationMiddleware(), findAllergens);

allergensRouter.post('/', validate(creteAllergenSchema), makeAllergen);

allergensRouter.patch('/:id', validate(updateAllergenSchema), patchAllergen);

allergensRouter.delete('/', validate(deleteAllergenSchema), deleteAllAllergens);
allergensRouter.delete('/:id', validate(deleteAllergenByIdSchema), deleteAllergenById);
// allergensRouter.delete('/:name', removeAllergenByName);
