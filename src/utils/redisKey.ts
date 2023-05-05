/* eslint-disable no-return-await */
import { getRoute } from './getRoute';
import { redis } from './redis';
import { DeleteRedis, KeyFromQuery, UpdateRedis } from '../types/types';

export const createRedisKey = ({ queryObject, controller }: KeyFromQuery) => {
  const route = getRoute(queryObject.baseUrl) || controller;

  if (queryObject.params?.id) {
    return `${route}_${queryObject.params.id}`;
  }
  if (queryObject.query && Object.keys(queryObject.query).length > 0) {
    return `${route}_${JSON.stringify(queryObject.query)}`;
  }
  if (controller) {
    return Object.keys(queryObject).length > 0
      ? `${controller}_${JSON.stringify(queryObject)}`
      : controller;
  }

  return route;
};

export const updateRedisKeys = async ({ controller, document }: UpdateRedis) => {
  const keys = await redis.keys(`*${controller}*`);

  Promise.all(
    keys
      .filter((key) => {
        return !key.match(/id/i);
      })
      .map(async (key) => {
        await redis.del(key);
      })
  );

  await redis.setex(`${controller}_${document._id}`, 3600, JSON.stringify(document));
};

export const deleteRedisKeys = async (keys: DeleteRedis) => {
  const redisKeys = await redis.keys(`*${keys}*`);

  return Promise.all(
    redisKeys.map(async (key) => {
      if (!key.match(/id/i)) {
        await redis.del(key);
      }
    })
  );
};

export const deleteAllRedisKeys = async (keys: DeleteRedis) => {
  const redisKeys = await redis.keys(`*${keys}*`);

  return Promise.all(redisKeys.map(async (key) => await redis.del(key)));
};
