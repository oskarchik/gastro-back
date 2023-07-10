import { HttpCode } from 'src/types/types';
import { BaseError } from './BaseError';

export class ApiError extends BaseError {
  public static DEFAULT_BAD_REQUEST_MESSAGE =
    'Invalid request: The request contains invalid data or parameters. Please review the request and try again with valid information.';

  public static DEFAULT_UNAUTHORIZED_MESSAGE =
    'Unauthorized access: You are not authorized to access this resource. Please provide valid credentials to proceed.';

  public static DEFAULT_FORBIDDEN_MESSAGE =
    'Forbidden: You are not allowed to perform the requested operation. Please ensure you have the necessary privileges.';

  public static DEFAULT_NOT_FOUND_MESSAGE =
    'Resource not found: The requested resource could not be found. Please verify the URL and try again.';

  public static DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE =
    'Internal Server Error: An unexpected error occurred on the server. Please try again later or contact the administrator for assistance.';

  constructor(httpCode: number, message: string, isOperational: boolean) {
    super({ httpCode, message, isOperational });
    this.httpCode = httpCode;
    this.isOperational = isOperational;
  }

  static badRequest(msg = '') {
    return new ApiError(
      HttpCode.BAD_REQUEST,
      msg ? `${this.DEFAULT_BAD_REQUEST_MESSAGE} ${msg}` : `${this.DEFAULT_BAD_REQUEST_MESSAGE}`,
      true
    );
  }

  static unauthorized(msg = '') {
    return new ApiError(
      HttpCode.UNAUTHORIZED,
      msg ? `${this.DEFAULT_UNAUTHORIZED_MESSAGE} ${msg}` : `${this.DEFAULT_UNAUTHORIZED_MESSAGE}`,
      true
    );
  }

  static forbidden(msg = '') {
    return new ApiError(
      HttpCode.FORBIDDEN,
      msg ? `${this.DEFAULT_FORBIDDEN_MESSAGE} ${msg}` : `${this.DEFAULT_FORBIDDEN_MESSAGE}`,
      true
    );
  }

  static notFound(msg = '') {
    return new ApiError(
      HttpCode.NOT_FOUND,
      msg ? `${this.DEFAULT_NOT_FOUND_MESSAGE} ${msg}` : `${this.DEFAULT_NOT_FOUND_MESSAGE}`,
      true
    );
  }

  static internalError(msg = '') {
    return new ApiError(
      HttpCode.INTERNAL_SERVER_ERROR,
      msg
        ? `${this.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE} ${msg}`
        : `${this.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE}`,
      true
    );
  }
}
