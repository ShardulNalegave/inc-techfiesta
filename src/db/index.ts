import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

// Ensure that the NEON_CONNECTION_URL environment variable is set
const neonConnectionUrl = process.env.NEON_CONNECTION_URL;

if (!neonConnectionUrl) {
  throw new Error('NEON_CONNECTION_URL is not defined in the environment variables.');
}

// Initialize the database connection
export const DB = drizzle(neonConnectionUrl);

export function DatabaseMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!DB) {
    res.status(500).json({ message: 'Database connection is not initialized.' });
    return;
  }
  
  console.log('Database connection is initialized.', DB);

  req.db = DB;
  next();
}
