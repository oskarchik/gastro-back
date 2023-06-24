import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { set as setContext } from 'express-http-context';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  setContext('requestId', requestId);
  res.set('X-Request-ID', requestId);

  next();
};
