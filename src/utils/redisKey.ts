import { Request } from 'express';
import { getRoute } from './getRoute';

export const createRedisKey = (object: Partial<Request>) => {
  const route = getRoute(object.baseUrl);

  if (object.params?.id) {
    return `${route}_${object.params.id}`;
  }
  if (object.query && Object.keys(object.query).length > 0) {
    return `${route}_${Object.keys(object.query)}`;
  }

  return route;
};
