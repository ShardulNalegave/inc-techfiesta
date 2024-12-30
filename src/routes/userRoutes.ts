import express from 'express';
import { AuthMiddleware, RequireAuth, RequireNoAuth } from '../middlewares/auth.js';
import { registerUser, loginUser, getUser } from '../controllers/userController.js';

const router = express.Router();

// Apply AuthMiddleware to all routes to extract JWT data
router.use(AuthMiddleware);

router.post('/register', registerUser);
router.post('/login', RequireNoAuth, loginUser);
router.get('/getUser', RequireAuth, getUser);
router.delete('/deleteUser', RequireAuth, loginUser);

export default router;