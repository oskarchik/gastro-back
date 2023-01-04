import mongoose from 'mongoose';
import config from 'config';
import { Logger } from '../logger/logger';

const dbUri = config.get<string>('db_uri');

export const dbConnect = async (uri: string) => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri);
    Logger.info('connected to DB');
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
};
