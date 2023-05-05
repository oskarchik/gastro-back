import { FilterQuery } from 'mongoose';
import { IngredientInput, RecipeInput } from 'src/types/types';

export const filterProperties = (propertiesToKeep: string[], object: any) => {
  const filteredObject: Partial<FilterQuery<IngredientInput | RecipeInput>> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const item in object) {
    if (propertiesToKeep.includes(item)) {
      filteredObject[item] = object[item];
    }
  }

  // eslint-disable-next-line no-prototype-builtins
  if (filteredObject.hasOwnProperty('hasAllergens')) {
    filteredObject.hasAllergens === 'true'
      ? (filteredObject.hasAllergens = true)
      : (filteredObject.hasAllergens = false);
  }

  return filteredObject;
};
