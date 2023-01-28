/* eslint-disable import/order */
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import config from 'config';
import { createApp } from './app';
import { Logger } from './logger/logger';
import { dbConnect } from './utils/dbConnection';
import { swaggerDocs } from '../swagger';

const port = config.get<number>('port');
const dbUri = config.get<string>('db_uri');

const app = createApp();
dbConnect(dbUri);

app.listen(port, () => {
  Logger.info(`running on http://localhost:${port}`);
  swaggerDocs(app, port);
});
