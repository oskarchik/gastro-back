import { Request, Response, NextFunction } from 'express';
import { redis } from 'src/utils/redis';

export const cache = async (req: Request, res: Response, next: NextFunction) => {
  const getRouter = (baseUrl: string) => baseUrl.split('/').pop() as string;

  const router = getRouter(req.baseUrl);
  const { id } = req.params;

  const key: string = id ? `${router}_${id}` : router;

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
