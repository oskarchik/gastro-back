import { Router } from 'express';
import { paginationMiddleware } from 'src/middlewares/pagination.middleware';
import { cache } from 'src/middlewares/cache.middleware';
import { validate } from 'src/middlewares/validationRequest';
import {
  findAllergens,
  findAllergenById,
  makeAllergen,
  patchAllergen,
  deleteAllAllergens,
  deleteAllergenById,
} from './allergens.controller';
import {
  getAllergensByIdSchema,
  getAllergenSchema,
  creteAllergenSchema,
  updateAllergenSchema,
  deleteAllergenSchema,
  deleteAllergenByIdSchema,
} from './allergens.schema';
import { idValidator } from 'src/middlewares/idValidation.middleware';

export const allergensRouter = Router();

allergensRouter.get('/:id', validate(getAllergensByIdSchema), idValidator, cache, findAllergenById);
allergensRouter.get('/', validate(getAllergenSchema), cache, paginationMiddleware(), findAllergens);

allergensRouter.post('/', validate(creteAllergenSchema), makeAllergen);

allergensRouter.patch('/:id', validate(updateAllergenSchema), idValidator, patchAllergen);

allergensRouter.delete('/', validate(deleteAllergenSchema), deleteAllAllergens);
allergensRouter.delete('/:id', validate(deleteAllergenByIdSchema), idValidator, deleteAllergenById);
// allergensRouter.delete('/:name', removeAllergenByName);
