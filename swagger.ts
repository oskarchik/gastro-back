import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from './package.json';
import { Logger } from 'src/logger/logger';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GastroPad REST API Docs',
      version,
    },
  },
  apis: ['./docs/**/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  Logger.info(`Docs available at http://localhost:${port}/docs`);
};
