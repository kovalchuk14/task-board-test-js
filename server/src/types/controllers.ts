import { Request, Response, NextFunction } from 'express';

export type Ctrl<P = any, B = any, Q = any> = (
  req: Request<P, any, B, Q>,
  res: Response,
  next: NextFunction,
) => Promise<void>;
