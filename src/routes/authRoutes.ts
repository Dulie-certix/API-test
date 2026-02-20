import { Router } from 'express';
import { login, logout, verifyToken as verify } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verify);

export default router;
