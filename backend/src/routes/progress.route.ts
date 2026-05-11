import { Router } from 'express';
import { saveUserProgress, getUserProgress, getAllProgress } from '../controllers/progress.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint to save progress (authenticated users)
router.post('/', verifyToken, saveUserProgress);

// Endpoint to get progress for a specific user (authenticated user for themselves, or admin)
router.get('/:uid', verifyToken, getUserProgress);

// Endpoint to get all progress (admin only)
router.get('/', verifyToken, verifyAdmin, getAllProgress);

export default router;
