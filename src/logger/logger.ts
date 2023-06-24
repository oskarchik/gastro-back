/* eslint-disable no-unused-expressions */
import winston from 'winston';
import { get as getContext } from 'express-http-context';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const requestId: string = getContext('requestId');
    return requestId
      ? `${requestId}: ${info.timestamp} ${info.level}: ${info.message}`
      : `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

const transports: (
  | winston.transports.ConsoleTransportInstance
  | winston.transports.FileTransportInstance
)[] = [
  new winston.transports.Console({
    format: winston.format.colorize({ all: true }),
  }),
];

process.env.NODE_ENV !== 'test'
  ? transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        silent: process.env.NODE_ENV !== 'development',
        format: winston.format.uncolorize(),
      })
    )
  : null;

export const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
