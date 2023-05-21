import { RecipeInput, RecipeDocument } from 'src/types/types';

export const createRecipeInput = ({
  name = 'paella',
  category = 'main',
  subCategory = 'rice',
  ingredients = ['639eea5a049fc933bddebab2'],
  ingredientNames = ['rice', 'green beans', 'chicken'],
  hasAllergens = false,
  allergens = [],
  allergenNames = [],
}): RecipeInput => {
  return {
    name,
    category,
    subCategory,
    ingredients,
    ingredientNames,
    hasAllergens,
    allergens,
    allergenNames,
  };
};

export const createRecipePayload = ({
  _id = '639eea5a049fc933bddebab2',
  name = 'paella',
  subCategory = 'rice',
  ingredients = ['639eea5a049fc933bddebab2'],
  ingredientNames = ['rice', 'green beans', 'chicken'],
  hasAllergens = false,
  allergens = [],
  allergenNames = [],
}): Pick<
  RecipeDocument,
  | '_id'
  | 'name'
  | 'subCategory'
  | 'ingredients'
  | 'ingredientNames'
  | 'hasAllergens'
  | 'allergens'
  | 'allergenNames'
> => {
  return {
    _id,
    name,
    subCategory,
    ingredients,
    ingredientNames,
    hasAllergens,
    allergens,
    allergenNames,
  };
};
