/* eslint-disable no-return-await */
import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { AllergenDocument } from 'src/modules/allergens/allergens.model';
import { IngredientDocument, IngredientInput } from 'src/modules/ingredients/ingredients.model';
import { RecipeDocument, RecipeInput } from 'src/modules/recipes/recipes.model';
import { getRoute } from './getRoute';
import { redis } from './redis';

export type KeyFromQuery = {
  queryObject: Partial<Request> | Partial<FilterQuery<IngredientInput | RecipeInput>>;
  controller?: string;
};

export type DBDocument = Partial<RecipeDocument | IngredientDocument | AllergenDocument>;

export type UpdateRedis = {
  controller: string;
  document: DBDocument;
};

export type DeleteRedis = string | string[];

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
      .filter((key) => !key.match(/\d+/))
      .map(async (key) => {
        await redis.del(key);
      })
  );

  await redis.setex(`${controller}_${document._id}`, 3600, JSON.stringify(document));
};

export const deleteRedisKeys = async (keys: DeleteRedis) => {
  const redisKeys = await redis.keys(`*${keys}*`);

  return Promise.all(redisKeys.map(async (key) => redis.del(key)));
};
