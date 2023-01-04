import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export interface AllergenInput {
  name: string;
  icon: string;
}

export interface AllergenDocument extends AllergenInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

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
