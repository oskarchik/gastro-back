import config from 'config';
import { createApp } from './app';
import { Logger } from './logger/logger';

const port = config.get<number>('port');
const app = createApp();

app.listen(port, () => Logger.info(`running on http://localhost:${port}`));
