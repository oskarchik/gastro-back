import mongoose from 'mongoose';
import { AllergenDocument } from '../allergens/allergens.model';

const { Schema, model } = mongoose;

export interface IngredientInput {
  name: string;
  category: string;
  hasAllergens: boolean;
  allergens: [AllergenDocument['_id']];
  allergenNames: string[];
}

export interface IngredientDocument extends IngredientInput, mongoose.Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
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
      ],
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
  },
  { timestamps: true }
);

ingredientSchema.index({ name: 1 });

export const IngredientModel = model<IngredientDocument>('Ingredient', ingredientSchema);
