import { Router } from 'express';
import { allergensRouter } from './modules/allergens/allergens.router';
import { ingredientsRouter } from './modules/ingredients/ingredients.router';

export const apiRouter = Router();

apiRouter.use('/allergens', allergensRouter);
apiRouter.use('/ingredients', ingredientsRouter);
