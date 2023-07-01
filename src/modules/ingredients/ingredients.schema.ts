import { z } from 'zod';

const categoryNames = [
  'meat',
  'fish',
  'seafood',
  'vegetable',
  'legume',
  'dairy',
  'fruit',
  'cereal',
  'fat',
  'eggs',
  'herbs and spices',
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
    description: z.string().optional(),
    category: z.enum(categoryNames).optional(),
    hasAllergens: z.boolean({
      required_error: 'Please define if the ingredient contains allergens',
    }),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.array(z.enum(allergenNames)).optional(),
    format: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    yieldRevenue: z
      .object({
        grossWeight: z.number().optional(),
        netWeight: z.number().optional(),
        yield: z.number().optional(),
      })
      .optional(),
    price: z
      .object({
        grossPrice: z.number().optional(),
        netPrice: z.number().optional(),
      })
      .optional(),
    provider: z.string().optional(),
  }),
};

const updatePayload = {
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.enum(categoryNames).optional(),
    hasAllergens: z.boolean().optional(),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.array(z.enum(allergenNames)).optional(),
    format: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    yieldRevenue: z
      .object({
        grossWeight: z.number().optional(),
        netWeight: z.number().optional(),
        yield: z.number().optional(),
      })
      .optional(),
    price: z
      .object({
        grossPrice: z.number().optional(),
        netPrice: z.number().optional(),
      })
      .optional(),
    provider: z.string().optional(),
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
    name: z.union([z.string(), z.array(z.string())]).optional(),
    category: z.enum(categoryNames).optional(),
    hasAllergens: z.string().optional(),
    allergens: z.array(z.string()).optional(),
    allergenNames: z.enum(allergenNames).optional(),
  }),
};

export const getIngredientSchema = z.object({
  ...query,
});

export const getIngredientByIdSchema = z.object({
  ...params,
});

export const createIngredientSchema = z.object({
  ...payload,
});
export const deleteIngredientSchema = z.object({
  ...query,
});

export const deleteIngredientByIdSchema = z.object({
  ...params,
});

export const updateIngredientSchema = z.object({
  ...updatePayload,
  ...params,
});

export type GetIngredientSchema = z.TypeOf<typeof getIngredientSchema>;
export type CreateIngredientSchema = z.TypeOf<typeof createIngredientSchema>;
export type DeleteIngredientSchema = z.TypeOf<typeof deleteIngredientSchema>;
export type UpdateIngredientSchema = z.TypeOf<typeof updateIngredientSchema>;
