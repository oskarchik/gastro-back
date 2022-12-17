/* eslint-disable no-shadow */
export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface BaseErrorArgs {
  name?: string;
  httpCode: HttpCode;
  // description: string;
  message: string;
  isOperational: boolean;
}
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
