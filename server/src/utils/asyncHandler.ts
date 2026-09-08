import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler<P = any> = (
  req: Request<P>,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler = <P = any>(fn: AsyncRouteHandler<P>) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};