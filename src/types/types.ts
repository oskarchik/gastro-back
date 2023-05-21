import { Request } from 'express';
import mongoose, { FilterQuery } from 'mongoose';

// eslint-disable-next-line no-shadow
export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export interface BaseErrorArgs {
  name?: string;
  httpCode: HttpCode;
  message: string;
  isOperational: boolean;
}

export interface Limiter {
  windowSize: number;
  allowedRequests: number;
}

export interface Metadata {
  totalPages: number;
  currentPage: number;
  totalDocuments: number;
  nextPageUrl: string | 0 | null;
  prevPageUrl: string | 0 | null;
}

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export interface AllergenInput {
  name: string;
  icon: string;
}

export interface AllergenDocument extends AllergenInput, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientInput {
  name: string;
  category: string;
  hasAllergens: boolean;
  allergens: AllergenDocument['_id'][];
  allergenNames: string[];
}

export interface IngredientDocument extends IngredientInput, mongoose.Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeInput {
  name: string;
  category: string;
  subCategory: string;
  ingredients: IngredientDocument['_id'][] | [];
  ingredientNames: string[];
  hasAllergens: boolean;
  allergens: AllergenDocument['_id'][] | [];
  allergenNames: string[];
}

export interface RecipeDocument extends RecipeInput, mongoose.Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeyFromQuery {
  queryObject: Partial<Request> | Partial<FilterQuery<IngredientInput | RecipeInput>>;
  controller?: string;
}

export type DBDocument = Partial<AllergenDocument | IngredientDocument | RecipeDocument>;

export type Controller = 'allergens' | 'ingredients' | 'recipes';

export interface UpdateRedis {
  controller: Controller;
  document: DBDocument;
}

export type DeleteRedis = string | string[];
