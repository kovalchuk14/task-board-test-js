import { isValidObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const isVaildId = (req: Request, res: Response, next: NextFunction) => {
  const { boardId } = req.params;
  if (!isValidObjectId(boardId)) {
    return next(createHttpError(400, 'Bad Id format'));
  }
  next();
};
