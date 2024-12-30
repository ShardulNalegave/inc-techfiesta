import express from 'express';
import { AuthMiddleware, RequireAuth, RequireNoAuth } from '../middlewares/auth.js';
import { registerUser, loginUser, getUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', RequireNoAuth,registerUser);
router.post('/login', RequireNoAuth, loginUser);
router.get('/getUser', RequireAuth, getUser);
router.delete('/deleteUser', RequireAuth, deleteUser);

export default router;