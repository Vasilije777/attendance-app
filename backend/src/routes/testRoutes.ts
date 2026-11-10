import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

// Kada neko gađa POST http://localhost:3000/api/login
router.post('/login', login);

export default router;