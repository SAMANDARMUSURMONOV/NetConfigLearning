import { Router } from 'express';
import { generateQuizQuestions } from '../services/ai.service';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protect AI routes for Admin only
router.post('/generate-quiz', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { topic, difficulty, count } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const questions = await generateQuizQuestions(
            topic, 
            difficulty || 'medium', 
            count || 5
        );
        
        res.status(200).json(questions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
