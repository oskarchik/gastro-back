import { IngredientDocument, IngredientInput } from 'src/types/types';

export const createIngredientInput = ({
  name = 'ingredient 1',
  description = 'description 1',
  category = 'eggs',
  hasAllergens = true,
  allergens = ['639eea5a049fc933bddebab3'],
  allergenNames = ['celery'],
  format = 'other',
  quantity = 12,
  unit = 'units',
  yieldRevenue = {
    grossWeight: 1,
    netWeight: 1,
    yield: 100,
  },
  price = {
    grossPrice: 1.5,
    netPrice: 1.2,
  },
  provider = 'my provider',
}): IngredientInput => {
  return {
    name,
    description,
    category,
    hasAllergens,
    allergens,
    allergenNames,
    format,
    quantity,
    unit,
    yieldRevenue,
    price,
    provider,
  };
};

export const createIngredientPayload = ({
  _id = '639eea5a049fc933bddebab2',
  name = 'ingredient 1',
  description = 'description 1',
  category = 'eggs',
  hasAllergens = true,
  allergens = ['639eea5a049fc933bddebab3'],
  allergenNames = ['celery'],
  format = 'other',
  quantity = 12,
  unit = 'units',
  yieldRevenue = {
    grossWeight: 1,
    netWeight: 1,
    yield: 100,
  },
  price = {
    grossPrice: 1.5,
    netPrice: 1.2,
  },
  provider = 'my provider',
}): Pick<
  IngredientDocument,
  | '_id'
  | 'name'
  | 'description'
  | 'category'
  | 'hasAllergens'
  | 'allergens'
  | 'allergenNames'
  | 'format'
  | 'quantity'
  | 'unit'
  | 'yieldRevenue'
  | 'price'
  | 'provider'
> => {
  return {
    _id,
    name,
    description,
    category,
    hasAllergens,
    allergens,
    allergenNames,
    format,
    quantity,
    unit,
    yieldRevenue,
    price,
    provider,
  };
};
