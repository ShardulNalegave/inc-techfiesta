
import { NextFunction, Request, Response } from 'express';
import pino from 'pino';

export const Logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  req.logger = Logger;
  return next();
}