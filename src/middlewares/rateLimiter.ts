import { NextFunction, Request, Response } from 'express';
import { redis } from 'src/utils/redis';

export interface Limiter {
  windowSize: number;
  allowedRequests: number;
}
export const rateLimiter =
  ({ windowSize, allowedRequests }: Limiter) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

    const formatIp = (ipAddress: string) => {
      if (ipAddress.substring(0, 7) === '::ffff:') {
        return ipAddress.replace('::ffff:', '');
      }
      return ipAddress;
    };
    const formattedIp = formatIp(ip);

    const requests = await redis.incr(formattedIp);

    let ttl: number;

    if (requests === 1) {
      await redis.expire(ip, windowSize);
      ttl = 60;
    } else {
      await redis.ttl(ip);
    }

    if (requests > allowedRequests) {
      return res.status(429).send({ error: 'too many requests' });
    }
    return next();
  };
