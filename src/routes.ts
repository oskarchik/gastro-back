import { Request, Response, Router } from 'express';
import { rateLimiter } from './middlewares/rateLimiter';
import { allergensRouter } from './modules/allergens/allergens.router';
import { ingredientsRouter } from './modules/ingredients/ingredients.router';
import { recipesRouter } from './modules/recipes/recipes.routes';
import { httpLogger } from './logger/httpLogger';

export const apiRouter = Router();

apiRouter.get(
  '/health',

  (_req: Request, res: Response) => {
    const data = {
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      message: 'ok',
      date: new Date(),
    };
    return res.status(200).send({ data });
  }
);
apiRouter.use(rateLimiter({ windowSize: 20, allowedRequests: 4 }));
apiRouter.use(httpLogger);
apiRouter.use('/allergens', allergensRouter);
apiRouter.use('/ingredients', ingredientsRouter);
apiRouter.use('/recipes', recipesRouter);
