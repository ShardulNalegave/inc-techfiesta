
import { NextFunction, Request, Response } from 'express';

export interface IAuthData {};

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  return next();
}

export function RequireAuth(req: Request, res: Response, next: NextFunction) {
  return next();
}

export function RequireNoAuth(req: Request, res: Response, next: NextFunction) {
  return next();
}