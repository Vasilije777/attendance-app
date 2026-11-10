import { Router } from 'express';
import { scanCard } from '../controllers/attendanceController';

const router = Router();

router.post('/scan', scanCard);

export default router;