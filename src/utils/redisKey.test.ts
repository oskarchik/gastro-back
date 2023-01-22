import { createRedisKey } from './redisKey';

const request = {
  params: {},
  query: {},
  baseUrl: 'allergens',
};
describe('redisKey', () => {
  it('should return allergens_1234', () => {
    const result = createRedisKey({ ...request, params: { id: '1234' } });
    expect(result).toEqual('allergens_1234');
  });
  it('should return allergens_name', () => {
    const result = createRedisKey({ ...request, query: { name: 'mushroom' } });
    expect(result).toEqual('allergens_name');
  });
  it('should return allergens', () => {
    const result = createRedisKey(request);
    expect(result).toEqual('allergens');
  });
});
