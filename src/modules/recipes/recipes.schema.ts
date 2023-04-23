import { z } from 'zod';

const categoryNames = ['starters', 'main', 'desserts', 'garnishes', 'drinks'] as const;

const subCategoryNames = [
  'meat',
  'fish',
  'seafood',
  'vegetables',
  'legumes',
  'dairy',
  'fruits',
  'doughs',
  'pasta',
  'rice',
  'salads',
  'soups',
  'eggs',
  'sauces',
  'others',
] as const;

const allergenNames = [
  'gluten',
  'peanuts',
  'tree nuts',
  'celery',
  'mustard',
  'eggs',
  'milk',
  'sesame',
  'fish',
  'crustaceans',
  'molluscs',
  'soya',
  'sulphites',
  'lupin',
] as const;

const payload = {
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    category: z.enum(categoryNames).optional(),
    subCategory: z.enum(subCategoryNames).optional(),
    ingredients: z.array(z.string()),
    ingredientNames: z.array(z.string()),
    hasAllergens: z.boolean({
      required_error: 'Please define if the recipe contains allergens',
    }),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.array(z.enum(allergenNames)).optional(),
  }),
};

const updatePayload = {
  body: z.object({
    name: z.string().optional(),
    category: z.enum(categoryNames).optional(),
    subCategory: z.enum(subCategoryNames).optional(),
    ingredients: z.array(z.string()).optional(),
    ingredientNames: z.array(z.string()).optional(),
    hasAllergens: z.boolean().optional(),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.array(z.enum(allergenNames)).optional(),
  }),
};

const params = {
  params: z.object({
    id: z.string({
      required_error: 'Id is required',
    }),
  }),
};

const query = {
  query: z.object({
    name: z.string().optional(),
    category: z.enum(categoryNames).optional(),
    subCategory: z.enum(subCategoryNames).optional(),
    ingredients: z.array(z.string()).optional(),
    ingredientNames: z.array(z.enum(allergenNames)).optional(),
    hasAllergens: z.string().optional(),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.enum(allergenNames).optional(),
  }),
};

export const getRecipeSchema = z.object({
  ...query,
});

export const getRecipeByIdSchema = z.object({
  ...params,
});

export const createRecipeSchema = z.object({
  ...payload,
});
export const deleteRecipeSchema = z.object({
  ...query,
});

export const deleteRecipeByIdSchema = z.object({
  ...params,
});

export const updateRecipeSchema = z.object({
  ...updatePayload,
  ...params,
});

export type GetRecipeSchema = z.TypeOf<typeof getRecipeSchema>;
export type CreateRecipeSchema = z.TypeOf<typeof createRecipeSchema>;
export type DeleteRecipeSchema = z.TypeOf<typeof deleteRecipeSchema>;
export type UpdateRecipeSchema = z.TypeOf<typeof updateRecipeSchema>;
