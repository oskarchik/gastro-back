import { Request } from 'express';
import { redis } from './redis';
import { createRedisKey, deleteRedisKeys, KeyFromQuery, updateRedisKeys } from './redisKey';

const queryObject: Partial<Request> = {
  params: {},
  query: {},
  baseUrl: 'allergens',
};
const object: KeyFromQuery = {
  queryObject,
  controller: 'allergens',
};

const DBDocument1 = {
  _id: '639eea5a049fc933bddebab2',
  name: 'ingredient 1',
  category: 'eggs',
  hasAllergens: true,
  allergens: ['639eea5a049fc933bddebab3'],
  allergenNames: ['celery'],
};
const DBDocument2 = {
  _id: '549eea5a049fc933bddebab8',
  name: 'ingredient 2',
  category: 'vegetables',
  hasAllergens: false,
  allergens: [],
  allergenNames: [],
};

afterEach(() => {
  redis.flushdb();
});

afterAll(async () => {
  await new Promise((resolve) => {
    redis.quit();
    redis.on('end', resolve);
  });
});

describe('create redisKey', () => {
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
describe('updated redisKeys', () => {
  it('should update record with id and remove the rest with given name in key', async () => {
    redis.flushdb();
    const DB = [DBDocument1, DBDocument2];
    await Promise.all(
      DB.map(async (doc, i) => {
        if (i === 1) {
          await redis.setex(`ingredients_${doc._id}`, 1000, JSON.stringify(doc));
        }
        await redis.setex(`ingredients`, 1000, JSON.stringify(doc));
      })
    );

    await updateRedisKeys({
      controller: 'ingredients',
      document: { ...DBDocument2, name: 'test' },
    });

    const updatedIngredient = JSON.parse(
      (await redis.get(`ingredients_${DBDocument2._id}`)) as string
    );
    const updatedKeys = await redis.keys('*');

    expect(updatedIngredient.name).toEqual('test');
    expect(updatedKeys.length).toEqual(1);
  });
});
describe('delete redisKeys', () => {
  it('should delete redis keys', async () => {
    redis.flushdb();
    const DB = [DBDocument1, DBDocument2];
    await Promise.all(
      DB.map(async (doc, i) => {
        if (i === 1) {
          await redis.setex(`ingredients_${doc._id}`, 1000, JSON.stringify(doc));
        }
        await redis.setex(`ingredients`, 1000, JSON.stringify(doc));
      })
    );
    await deleteRedisKeys('ingredients');
    const result = await redis.keys('*ingredients*');

    expect(result.length).toBe(0);
  });
});
