import { Router } from 'express';
import { allergensRouter } from './modules/allergens/allergens.router';

export const apiRouter = Router();

apiRouter.use('/allergens', allergensRouter);
