import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { IngredientInput } from 'src/modules/ingredients/ingredients.model';
import { RecipeInput } from 'src/modules/recipes/recipes.model';
import { getRoute } from './getRoute';

export type KeyFromQuery = {
  queryObject: Partial<Request> | Partial<FilterQuery<IngredientInput | RecipeInput>>;
  controller?: string;
};

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
