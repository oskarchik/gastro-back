/* eslint-disable prefer-destructuring */
/* eslint-disable import/first */

const logger = {
  debug: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
  },
  level: jest.fn(),
  createLogger: jest.fn().mockReturnValue(logger),
  transports: {
    fileRotateAppTransport: jest.fn(),
    fileRotateErrorTransport: jest.fn(),
    Console: jest.fn(),
  },
}));

import winston, { format, transports, createLogger } from 'winston';
import { Logger } from './logger';

describe('logger', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should pass', () => {
    const mockLogger = jest.spyOn(winston, 'createLogger');
    const error = {
      timestamp: 123,
      level: 'error',
      message: 'haha',
    };
    Logger.error(error);
    expect(mockLogger).toBeCalled();
    expect(format.timestamp).toBeCalledWith({ format: 'YYYY-MM-DD HH:mm:ss' });
    expect(format.combine).toBeCalledTimes(1);
    expect(format.printf).toBeCalledWith(expect.any(Function));
    expect(transports.Console).toBeCalledTimes(1);
    expect(createLogger).toBeCalledTimes(1);
  });
});
