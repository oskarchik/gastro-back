import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Metadata, PaginationOptions } from 'src/types/types';

export const paginationMiddleware = (options: PaginationOptions = {}) => {
  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 100;
  const defaultLimit = options.defaultLimit || DEFAULT_LIMIT;
  const maxLimit = options.maxLimit || MAX_LIMIT;

  return (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1;

    if (!page || page < 1) {
      return next(new Error(`Page must be a positive integer`));
    }

    const limit = parseInt(req.query.limit as string, 10) || defaultLimit;

    if (limit < 1 || limit > maxLimit) {
      return next(new Error(`Limit must be between 1 and ${maxLimit}`));
    }
    const offset = (page - 1) * limit;

    req.originalUrl = req.originalUrl.match(/page/i)
      ? req.originalUrl
      : `${req.originalUrl}?limit=${limit.toString()}&page=${page.toString()}`;
    req.pagination = { page, limit, offset };

    return next();
  };
};

export const getPaginatedData = async <T, U>(
  model: mongoose.Model<T>,
  query: mongoose.FilterQuery<U>,
  req: Request,
  originalUrl: string
) => {
  const { limit } = req.pagination;

  try {
    const totalDocuments = await model.countDocuments(query);

    const totalPages = Math.ceil(totalDocuments / limit) || 1;
    const currentPage = req.pagination?.page;

    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    const queryParams = new URLSearchParams(originalUrl as any);
    queryParams.set('limit', limit.toString());

    const nextPageUrl = nextPage && originalUrl.replace(/page=\d/i, `page=${nextPage}`);
    const prevPageUrl = prevPage && originalUrl.replace(/page=\d/i, `page=${prevPage}`);

    const info: Metadata = {
      totalPages,
      currentPage,
      totalDocuments,
      nextPageUrl,
      prevPageUrl,
    };

    return info;
  } catch (error) {
    return error;
  }
};
