import mongoose from 'mongoose';
import { RecipeDocument } from 'src/types/types';

const { Schema, model } = mongoose;

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

export const RecipeModel = model<RecipeDocument>('Recipe', recipeSchema);
