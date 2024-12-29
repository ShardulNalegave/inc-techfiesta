
import { Router } from 'express';

export const UsersController = Router();

UsersController.get('/', (req, res) => {
  res.send('GET /users');
});