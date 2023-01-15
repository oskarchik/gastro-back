import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from 'src/error/ApiError';

export const validate =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          path: `${issue.path[0]}:${issue.path[1]}`,
          message: `${issue.message}`,
        }));
        return res.status(400).send({ error: formattedErrors });
      }
      return next(ApiError.badRequest('Bad request'));
    }
  };
