
import { drizzle } from 'drizzle-orm/neon-http';
import { NextFunction, Request, Response } from 'express';

export const DB = drizzle(process.env.NEON_CONNECTION_URL!);

export function DatabaseMiddleware(req: Request, res: Response, next: NextFunction) {
  req.db = DB;
  return next();
}