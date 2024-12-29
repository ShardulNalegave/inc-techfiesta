
import 'dotenv/config';
import express from 'express';
import { Logger, LoggerMiddleware } from './utils/logger.js';
import { UsersController } from './controllers/users.js';
import { DatabaseMiddleware } from './db/index.js';
import { AuthMiddleware } from './middlewares/auth.js';

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '127.0.0.1';

const app = express();
app.use(LoggerMiddleware, DatabaseMiddleware, AuthMiddleware);
app.use('/users', express.json(), UsersController);

app.listen(PORT, HOST, () => {
  Logger.info({ host: HOST, port: PORT }, `Listening`);
});