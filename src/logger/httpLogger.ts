// import dotenv from 'dotenv';
import morgan, { StreamOptions } from 'morgan';
import { Logger } from './logger';

const stream: StreamOptions = {
  write: (message) => Logger.http(message?.replace(/\n$/, '')),
};

const skip = () => {
  const env = process.env.NODE_ENV;
  return env !== 'development';
};

export const httpLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip,
});
