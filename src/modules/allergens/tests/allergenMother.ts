import { AllergenDocument, AllergenInput } from 'src/types/types';

export const createAllergenInput = ({
  name = 'test',
  icon = 'test allergen icon',
}): AllergenInput => {
  return { name, icon };
};

export const createAllergenPayload = ({
  _id = '639eea5a049fc933bddebab2',
  name = 'test',
  icon = 'test allergen icon',
}): Pick<AllergenDocument, '_id' | 'name' | 'icon'> => {
  return { _id, name, icon };
};
