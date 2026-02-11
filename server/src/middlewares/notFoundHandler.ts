import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = createHttpError(404, 'Route not found');
  res.status(404).json({
    status: 404,
    message: error.message,
  });
};
