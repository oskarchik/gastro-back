import { FilterQuery } from 'mongoose';
import { Request } from 'express';
import { AllergenDocument, AllergenInput } from 'src/types/types';
import { AllergenModel } from './allergens.model';

const fieldsToReturn = '_id name icon';

export const getAllergens = async (
  query: FilterQuery<AllergenInput>,
  pagination: Request['pagination']
) => {
  const { limit, offset } = pagination;
  try {
    return await AllergenModel.find(query).skip(offset).limit(limit).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getAllergenById = async (allergenId: AllergenDocument['_id']) => {
  try {
    return await AllergenModel.findById(allergenId).select(fieldsToReturn).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getAllergensByName = async (
  allergenName: AllergenDocument['name'],
  pagination: Request['pagination']
) => {
  const { limit, offset } = pagination;
  try {
    return await AllergenModel.find({ name: allergenName })
      .skip(offset)
      .limit(limit)
      .select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const createAllergen = async (allergen: AllergenInput) => {
  try {
    return await AllergenModel.create(allergen);
  } catch (error) {
    return error;
  }
};

export const updateAllergen = async ({
  allergenId,
  update,
}: {
  allergenId: AllergenDocument['_id'];
  update: FilterQuery<AllergenDocument>;
}) => {
  try {
    return await AllergenModel.findByIdAndUpdate(allergenId, update, { new: true }).select(
      fieldsToReturn
    );
  } catch (error) {
    return error;
  }
};

export const removeAllergenById = async (allergenId: AllergenDocument['_id']) => {
  try {
    return await AllergenModel.findByIdAndDelete(allergenId);
  } catch (error) {
    return error;
  }
};

export const removeAllergenByName = async (allergenName: AllergenDocument['name']) => {
  try {
    return await AllergenModel.findOneAndDelete({ name: allergenName });
  } catch (error) {
    return error;
  }
};

export const removeAllAllergens = async () => {
  try {
    return await AllergenModel.deleteMany({});
  } catch (error) {
    return error;
  }
};
