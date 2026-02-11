import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import createHttpError from 'http-errors';

export const validateBody =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (err) {
      const error = createHttpError(400, 'Bad Request', {
        errors:
          err && typeof err === 'object' && 'details' in err
            ? (err as any).details
            : [],
      });

      next(error);
    }
  };
