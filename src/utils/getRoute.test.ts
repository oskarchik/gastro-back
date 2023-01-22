import { getRoute } from './getRoute';

describe('getRoute', () => {
  it('should return a string if baseUrl is provided', () => {
    const baseUrl = '/api/v1/allergens';
    const result = getRoute(baseUrl);

    expect(result).toEqual('allergens');
  });
  it('should return an empty string if baseUrl is undefined', () => {
    const result = getRoute(undefined);

    expect(typeof result).toBe('string');
    expect(result).toHaveLength(0);
  });
});
