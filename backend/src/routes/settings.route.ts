import { Router } from 'express';
import { getSettings, updateSettings, uploadLogo } from '../controllers/settings.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';

// Ensure directory exists
const uploadDir = 'uploads/branding';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const router = Router();

// Public or Admin can get settings (depending on visibility needs, usually public for site name)
router.get('/', getSettings);

// Admin only: Update settings and upload logo
router.post('/', verifyToken, verifyAdmin, updateSettings);
router.post('/logo', verifyToken, verifyAdmin, upload.single('logo'), uploadLogo);

export default router;
