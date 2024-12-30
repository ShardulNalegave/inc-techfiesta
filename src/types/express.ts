
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { Logger } from 'pino';
import { IAuthData } from '../types/IAuthData.js';
import { Driver } from 'neo4j-driver';

export {};

declare global {
  namespace Express {
    export interface Request {
      db?: NeonHttpDatabase,
      graph: Driver | null,
      logger?: Logger,
      authData: IAuthData | null,
    }
  }
}