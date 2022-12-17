import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { httpLogger } from './logger/httpLogger';
import { Logger } from './logger/logger';
import { errorHandler, isTrustedError } from './error/error-handler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(httpLogger);

  app.get('/', (_req: Request, res: Response, next: NextFunction) => {
    return res.send('hello');
  });
  app.get('/health', (_req: Request, res: Response) => {
    const data = {
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      message: 'ok',
      date: new Date(),
    };
    return res.status(200).send(data);
  });

  app.use(errorHandler);

  process.on('uncaughtException', async (error: Error) => {
    Logger.error(error);
    if (!isTrustedError(error)) {
      process.exit(1);
    }
  });
  process.on('unhandledRejection', (reason: string) => {
    Logger.error(reason);
    process.exit(1);
  });

  return app;
};
