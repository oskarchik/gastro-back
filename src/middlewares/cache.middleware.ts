import { Request, Response, NextFunction } from 'express';
import { redis } from 'src/utils/redis';
import { createRedisKey } from 'src/utils/redisKey';

export const cache = async (req: Request, res: Response, next: NextFunction) => {
  const key = createRedisKey(req);

  try {
    const cachedResult = await redis.get(key);

    if (cachedResult !== null) {
      const parsedData = JSON.parse(cachedResult);

      return res.status(200).send({ data: parsedData });
    }
  } catch (error) {
    return next(error);
  }

  return next();
};
