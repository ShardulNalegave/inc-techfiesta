import express from 'express';
import { UsersController } from '../controllers/users.js';

const router = express.Router();

router.use('/', express.json(), UsersController);

export default router;