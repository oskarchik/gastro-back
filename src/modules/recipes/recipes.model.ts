import mongoose from 'mongoose';
import { AllergenDocument } from '../allergens/allergens.model';
import { IngredientDocument } from '../ingredients/ingredients.model';

const { Schema, model } = mongoose;

export interface RecipeInput {
  name: string;
  category: string;
  subCategory: string;
  ingredients: [IngredientDocument['_id']] | [];
  ingredientNames: string[];
  hasAllergens: boolean;
  allergens: [AllergenDocument['_id']] | [];
  allergenNames: string[];
}

export interface RecipeDocument extends RecipeInput, mongoose.Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['starters', 'main', 'desserts', 'garnishes', 'drinks'],
  },
  subCategory: {
    type: String,
    enum: [
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
    ],
  },
  ingredients: [{ type: mongoose.Types.ObjectId, ref: 'Ingredient' }],
  ingredientNames: {
    type: [String],
  },
  hasAllergens: {
    type: Boolean,
    required: true,
  },
  allergens: [{ type: mongoose.Types.ObjectId, ref: 'Allergen' }],
  allergenNames: {
    type: [String],
    enum: [
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
    ],
  },
});

recipeSchema.index({ name: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ subCategory: 1 });

export const RecipeModel = model('Recipe', recipeSchema);
