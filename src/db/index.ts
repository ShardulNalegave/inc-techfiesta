import { drizzle } from 'drizzle-orm/neon-http';
import { NextFunction, Request, Response } from 'express';

export const DB = drizzle(process.env.NEON_CONNECTION_URL!);

export function DatabaseMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!DB) {
    res.status(500).json({ message: 'Database connection is not initialized.' });
    return;
  }

  req.db = DB;
  next();
}
