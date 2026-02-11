import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  if (createHttpError.isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err instanceof Error ? err.message : err,
  });
};
