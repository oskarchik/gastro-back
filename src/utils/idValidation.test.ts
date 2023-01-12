import { isValidId } from './idValidation';

describe('id validation', () => {
  it('should return false when given id is not mongoose ObjectId', () => {
    const result = isValidId('dasdasdasds');
    expect(result).toBe(false);
  });
  it('should return false when given id is mongoose ObjectId type', () => {
    const result = isValidId('sdf48hdi1033');
    expect(result).toBe(true);
  });
});
