import mongoose from 'mongoose';
import { IngredientDocument } from 'src/types/types';

const { Schema, model } = mongoose;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
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
    format: {
      type: String,
      enum: [
        'without format',
        'tray',
        'bag',
        'tin',
        'bottle',
        'brick',
        'box',
        'carafe',
        'mesh bag',
        'bunch',
        'pack',
        'piece',
        'roll',
        'sack',
        'other',
      ],
    },
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
      enum: ['kilogram', 'grams', 'liters', 'milliliters', 'units'],
    },
    yieldRevenue: {
      grossWeight: {
        type: Number,
      },
      netWeight: {
        type: Number,
      },
      yield: {
        type: Number,
      },
    },
    price: {
      grossPrice: {
        type: Number,
      },
      netPrice: {
        type: Number,
      },
    },
    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

ingredientSchema.index({ name: 1 });

export const IngredientModel = model<IngredientDocument>('Ingredient', ingredientSchema);
