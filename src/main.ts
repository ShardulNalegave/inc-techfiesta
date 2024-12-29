
import dotenv from 'dotenv';
import express from 'express';
import { Logger } from './utils/logger.js';
import { UsersController } from './controllers/users.js';

// Load .env
dotenv.config();
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '127.0.0.1';

const app = express();
app.use('/users', express.json(), UsersController);

app.listen(PORT, HOST, () => {
  Logger.info({ host: HOST, port: PORT }, `Listening`);
});