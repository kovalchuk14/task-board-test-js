import { isValidObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const isVaildId = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    return next(createHttpError(400, 'Bad Request'));
  }
  next();
};
