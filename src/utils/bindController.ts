import { Request, Response, NextFunction } from 'express';

type ControllerContext = {};

export function bindController<T extends ControllerContext>(
  controllerMethod: (
    this: T,
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
) {
  return async function (
    this: T,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await controllerMethod.call(this, req, res, next);
      return result;
    } catch (error) {
      next(error);
    }
  };
}
