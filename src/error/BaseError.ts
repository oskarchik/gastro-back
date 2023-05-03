import { HttpCode, BaseErrorArgs } from 'src/types/types';

export class BaseError extends Error {
  public httpCode: HttpCode;

  public message: string;

  public isOperational = true;

  constructor(args: BaseErrorArgs) {
    super(args.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;
    this.message = args.message;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }
    Error.captureStackTrace(this);
  }
}
