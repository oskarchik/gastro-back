import mongoose from 'mongoose';
import config from 'config';
import process from 'process';
import { dbConnect } from './dbConnection';
import { Logger } from '../logger/logger';
import { redis } from './redis';

const dbUri = config.get<string>('db_uri');
const mockConnection = jest.spyOn(mongoose, 'connect');
jest.spyOn(Logger, 'info');
jest.spyOn(Logger, 'error');
jest.spyOn(process, 'exit');

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(async () => {
  await redis.quit();
  mongoose.disconnect();
});
describe('db connection', () => {
  it('should print connected to DB', async () => {
    await dbConnect(dbUri);
    expect(mockConnection).toHaveBeenNthCalledWith(1, dbUri);
    expect(Logger.info).toHaveBeenNthCalledWith(1, 'redis ready');
    expect(Logger.info).toHaveBeenNthCalledWith(2, 'connected to DB');
  });
});
