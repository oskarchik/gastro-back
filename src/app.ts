import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { middleware as context } from 'express-http-context';
import { Logger } from './logger/logger';
import { errorHandler, isTrustedError } from './error/error-handler';
import { apiRouter } from './routes';
import { requestIdMiddleware } from './middlewares/requestId.middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(context);
  app.use(requestIdMiddleware);

  app.use('/api/v1', apiRouter);

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
