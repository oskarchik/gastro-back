import { FilterQuery } from 'mongoose';
import { IngredientModel, IngredientDocument, IngredientInput } from './ingredients.model';

const fieldsToReturn = '_id name category hasAllergens allergenNames allergens';

export const getIngredients = async (query: FilterQuery<IngredientInput>) => {
  try {
    return await IngredientModel.find(query).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getIngredientById = async (id: IngredientDocument['_id']) => {
  try {
    return IngredientModel.findById(id).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const getIngredientsByAllergen = async (allergens: FilterQuery<IngredientInput>) => {
  try {
    return await IngredientModel.find({ allergenNames: { $in: allergens } }).select(fieldsToReturn);
  } catch (error) {
    return error;
  }
};

export const createIngredient = async (ingredient: IngredientInput) => {
  try {
    return await IngredientModel.create(ingredient);
  } catch (error) {
    return error;
  }
};

export const updateIngredient = async ({
  ingredientId,
  update,
}: {
  ingredientId: IngredientDocument['_id'];
  update: FilterQuery<IngredientDocument>;
}) => {
  try {
    return await IngredientModel.findByIdAndUpdate(ingredientId, update, { new: true }).select(
      fieldsToReturn
    );
  } catch (error) {
    return error;
  }
};

export const removeIngredientById = async (id: IngredientDocument['_id']) => {
  try {
    return await IngredientModel.findByIdAndDelete(id);
  } catch (error) {
    return error;
  }
};

export const removeAllIngredients = async (query: FilterQuery<IngredientInput>) => {
  try {
    const deletedIngredients = await IngredientModel.deleteMany(query);
    return deletedIngredients.deletedCount;
  } catch (error) {
    return error;
  }
};

export const removeIngredientsByAllergen = async (allergen: IngredientDocument['allergens']) => {
  try {
    return await IngredientModel.deleteMany({
      allergens: {
        $in: allergen,
      },
    });
  } catch (error) {
    return error;
  }
};
