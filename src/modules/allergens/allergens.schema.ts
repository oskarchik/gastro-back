import { z } from 'zod';

const payload = {
  body: z.object({
    name: z.string(),
    icon: z.string(),
  }),
};

const updatePayload = {
  body: z.object({
    name: z.string().optional(),
    icon: z.string().optional(),
  }),
};

const params = {
  params: z.object({
    id: z.string(),
  }),
};

const query = {
  query: z.object({
    name: z.string().optional(),
    icon: z.string().optional(),
  }),
};

export const getAllergenSchema = z.object({
  ...query,
});

export const getAllergensByIdSchema = z.object({
  ...params,
});

export const creteAllergenSchema = z.object({
  ...payload,
});

export const deleteAllergenSchema = z.object({
  ...query,
});

export const deleteAllergenByIdSchema = z.object({
  ...params,
});

export const updateAllergenSchema = z.object({
  ...params,
  ...updatePayload,
});

export type GetAllergenSchema = z.TypeOf<typeof getAllergenSchema>;
export type CreateAllergenSchema = z.TypeOf<typeof creteAllergenSchema>;
export type DeleteAllergenSchema = z.TypeOf<typeof deleteAllergenSchema>;
export type UpdateAllergenSchema = z.TypeOf<typeof updateAllergenSchema>;
