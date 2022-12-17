/* eslint-disable no-unused-expressions */
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../logger/logger';
import { ApiError } from './ApiError';
import { BaseError } from './BaseError';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    process.env.NODE_ENV === 'test' ? null : Logger.error(err);
    return res.status(err.httpCode).send({ error: err.message });
  }

  const error = new Error('Unexpected internal error');

  process.env.NODE_ENV === 'test' ? null : Logger.error(err);
  return res.status(500).send({ error: error.message });
};

export const isTrustedError = (error: Error) => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};
