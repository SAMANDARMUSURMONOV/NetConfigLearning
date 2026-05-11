import { Router } from 'express';
import { uploadAvatar } from '../controllers/profile.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';

// Ensure upload directory exists
const avatarDir = 'uploads/avatars';
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `avatar-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed') as any, false);
    }
  }
});

const router = Router();

// Barcha foydalanuvchilar o'z profil rasmini yuklashi mumkin
router.post('/avatar', verifyToken, upload.single('avatar'), uploadAvatar);

export default router;
