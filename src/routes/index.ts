
import express from 'express';
import userRoutes from './userRoutes.js';
import roadRoutes from './roadRoutes.js';

const router = express.Router();

router.use('/users', express.json(), userRoutes);
router.use('/roads', express.json(), roadRoutes);

export default router;