import { BaseError, HttpCode } from './BaseError';

export class ApiError extends BaseError {
  constructor(httpCode: number, message: string, isOperational: boolean) {
    super({ httpCode, message, isOperational });
    this.httpCode = httpCode;
    this.isOperational = isOperational;
  }

  static badRequest(msg: string) {
    return new ApiError(HttpCode.BAD_REQUEST, msg, true);
  }

  static unauthorized(msg: string) {
    return new ApiError(HttpCode.UNAUTHORIZED, msg, true);
  }

  static forbidden(msg: string) {
    return new ApiError(HttpCode.FORBIDDEN, msg, true);
  }

  static notFound(msg: string) {
    return new ApiError(HttpCode.NOT_FOUND, msg, true);
  }

  static internalError(msg: string) {
    return new ApiError(HttpCode.INTERNAL_SERVER_ERROR, msg, true);
  }
}
