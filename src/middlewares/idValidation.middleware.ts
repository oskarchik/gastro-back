import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from 'src/error/ApiError';

export const idValidator = (req: Request, res: Response, next: NextFunction) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

  if (isValid) return next();

  return next(ApiError.badRequest('Invalid id'));
};
