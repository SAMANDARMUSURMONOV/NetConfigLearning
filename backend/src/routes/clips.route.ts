import { Router } from 'express';
import { getClips, createClip, deleteClip } from '../controllers/clips.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads/clips';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'clip-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for short videos
});

const router = Router();

router.get('/', getClips);
router.post('/', verifyToken, verifyAdmin, (req, res, next) => {
    // Agar so'rov JSON bo'lsa, multer-ni chetlab o'tamiz
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        return next();
    }
    // Aks holda multer-ni ishlatamiz
    upload.single('video')(req, res, next);
}, createClip);
router.delete('/:id', verifyToken, verifyAdmin, deleteClip);

export default router;
