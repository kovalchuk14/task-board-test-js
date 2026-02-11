import { Request, Response, NextFunction } from 'express';
import { Ctrl } from '../types/controllers';

export const ctrlWrapper = (controller: Ctrl) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
