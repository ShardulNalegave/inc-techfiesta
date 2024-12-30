import { NextFunction, Request, Response } from 'express';
import { IAuthData } from '../types/IAuthData';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to extract authentication data from JWT
export function AuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as IAuthData;
      req.authData = decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      req.authData = null;
    }
  } else {
    req.authData = null;
  }

  next();
}

// Middleware to ensure the user is authenticated
export function RequireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.authData) {
    res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    return;
  }

  next();
}

// Middleware to ensure the user is not authenticated
export function RequireNoAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.authData) {
    res.status(400).json({ message: 'You are already logged in.' });
    return;
  }

  next();
}
