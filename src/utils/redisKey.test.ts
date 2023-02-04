import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { IngredientInput } from 'src/modules/ingredients/ingredients.model';
import { RecipeInput } from 'src/modules/recipes/recipes.model';
import { createRedisKey, KeyFromQuery } from './redisKey';

const queryObject: Partial<Request> = {
  params: {},
  query: {},
  baseUrl: 'allergens',
};
const object: KeyFromQuery = {
  queryObject,
  controller: 'allergens',
};

describe('redisKey', () => {
  it('should return allergens_1234', () => {
    const result = createRedisKey({
      ...object,
      queryObject: { ...object.queryObject, params: { id: '1234' } },
    });

    expect(result).toEqual('allergens_1234');
  });
  it('should return allergens_name-mushroom', () => {
    const result = createRedisKey({
      ...object,
      queryObject: { ...object.queryObject, query: { name: 'mushroom' } },
    }) as string;

    expect(result).toEqual('allergens_{"name":"mushroom"}');
  });
  it('should return allergens', () => {
    const result = createRedisKey({ ...object, controller: undefined });
    expect(result).toEqual('allergens');
  });

  it('should return recipes', () => {
    const result = createRedisKey({
      ...object.queryObject,
      queryObject: {},
      controller: 'recipes',
    });

    expect(result).toEqual('recipes');
  });
  it('should return recipes_name_pa', () => {
    const paramObject = { ...object, queryObject: {} };
    paramObject.queryObject = { name: 'pa' };
    paramObject.controller = 'recipes';

    const result = createRedisKey(paramObject);

    expect(result).toEqual('recipes_{"name":"pa"}');
  });
});
