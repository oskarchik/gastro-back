import { IngredientDocument, IngredientInput } from 'src/types/types';

export const createIngredientInput = ({
  name = 'ingredient 1',
  category = 'eggs',
  hasAllergens = true,
  allergens = ['639eea5a049fc933bddebab3'],
  allergenNames = ['celery'],
}): IngredientInput => {
  return { name, category, hasAllergens, allergens, allergenNames };
};

export const createIngredientPayload = ({
  _id = '639eea5a049fc933bddebab2',
  name = 'ingredient 1',
  category = 'eggs',
  hasAllergens = true,
  allergens = ['639eea5a049fc933bddebab3'],
  allergenNames = ['celery'],
}): Pick<
  IngredientDocument,
  '_id' | 'name' | 'category' | 'hasAllergens' | 'allergens' | 'allergenNames'
> => {
  return { _id, name, category, hasAllergens, allergens, allergenNames };
};
