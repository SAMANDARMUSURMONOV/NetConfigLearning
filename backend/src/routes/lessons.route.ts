import { Router } from 'express';
import { getLessons, createLesson, getLessonById, updateLesson, deleteLesson, updateLessonQuiz, uploadLessonVideo, uploadLessonFile } from '../controllers/lessons.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';

// Multer configuration for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/lessons/others';
    if (file.fieldname === 'video') folder = 'uploads/lessons/video';
    if (file.fieldname === 'file') folder = 'uploads/lessons/file';
    if (file.fieldname === 'thumbnail') folder = 'uploads/lessons/thumbnail';
    if (file.fieldname === 'lectureNote') folder = 'uploads/lessons/lectures';
    
    // Ensure directory exists
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  }
});

const router = Router();

// Admin only: Upload
router.post('/upload', verifyToken, verifyAdmin, upload.single('video'), uploadLessonVideo);
router.post('/upload-file', verifyToken, verifyAdmin, upload.single('file'), uploadLessonFile);
router.post('/upload-thumbnail', verifyToken, verifyAdmin, upload.single('thumbnail'), uploadLessonFile);
router.post('/upload-lecture', verifyToken, verifyAdmin, upload.single('lectureNote'), uploadLessonFile);

// Public: Get all lessons
router.get('/', getLessons);

// Public: Get a single lesson by ID
router.get('/:id', getLessonById);

// Admin only: Create, Update, Delete, Patch Quiz
router.post('/', verifyToken, verifyAdmin, createLesson);
router.put('/:id', verifyToken, verifyAdmin, updateLesson);
router.delete('/:id', verifyToken, verifyAdmin, deleteLesson);
router.patch('/:id/quiz', verifyToken, verifyAdmin, updateLessonQuiz);

export default router;
