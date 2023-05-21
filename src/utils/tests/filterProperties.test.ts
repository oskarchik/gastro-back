import { filterProperties } from '../filterProperties';

const requestQueryMock = { name: 'test', hasAllergens: false };
const properties = ['name', 'category', 'hasAllergens', 'allergens', 'allergenNames'];

describe('filterProperties', () => {
  it('should return an object with given properties', () => {
    const result = filterProperties(properties, requestQueryMock);

    expect(result.name).toBeDefined();
    expect(result.name).toEqual(requestQueryMock.name);
    expect(typeof result.name).toBe('string');
    expect(result.hasAllergens).toBeDefined();
    expect(result.hasAllergens).toEqual(requestQueryMock.hasAllergens);
    expect(typeof result.hasAllergens).toBe('boolean');
  });
});
