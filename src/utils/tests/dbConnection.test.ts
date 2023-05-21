import mongoose from 'mongoose';
import config from 'config';
import process from 'process';
import { dbConnect } from '../dbConnection';
import { Logger } from '../../logger/logger';
import { redis } from '../redis';

const dbUri = config.get<string>('db_uri');
const mockConnection = jest.spyOn(mongoose, 'connect');

jest.spyOn(Logger, 'info');
jest.spyOn(Logger, 'error');
jest.spyOn(process, 'exit');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(async () => {
  await redis.quit();
  mongoose.disconnect();
});
describe('db connection', () => {
  it('should connect successfully', async () => {
    const connectSpy = jest.spyOn(mongoose, 'connect');
    await dbConnect(dbUri);
    expect(connectSpy).toHaveBeenNthCalledWith(1, dbUri);
    expect(Logger.info).toHaveBeenNthCalledWith(1, 'connected to DB');
  });
  it('should handle wrong uri', async () => {
    const uri = 'invalid uri';
    const error = new Error('Invalid URI');

    mockConnection.mockRejectedValueOnce(error);

    await dbConnect(uri);
    expect(mockConnection).toHaveBeenCalledWith(uri);
    expect(Logger.error).toHaveBeenNthCalledWith(1, error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
