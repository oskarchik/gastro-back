import Redis from 'ioredis';
import config from 'config';
import { Logger } from 'src/logger/logger';

const redisDb = config.get<number>('redis_db');

export const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: redisDb,
});

redis.on('ready', () => Logger.info('redis ready'));
redis.on('error', (error) => {
  Logger.error(`error with redis connection: ${error}`);
  return redis.disconnect();
});
