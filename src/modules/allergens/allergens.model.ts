import mongoose from 'mongoose';
import { AllergenDocument } from 'src/types/types';

const { Schema, model } = mongoose;

const allergenSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

allergenSchema.index({ name: 1 });

export const AllergenModel = model<AllergenDocument>('Allergen', allergenSchema);
