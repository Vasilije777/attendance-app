import { Router } from 'express';
import { getWorkReport } from '../controllers/reportController';

const router = Router();

router.get('/report', getWorkReport);

export default router;