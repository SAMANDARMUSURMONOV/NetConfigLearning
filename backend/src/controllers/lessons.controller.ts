import { Request, Response } from 'express';
import { db, storage } from '../config/firebase';

const LESSONS_COLLECTION = 'lessons';

export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessonsSnapshot = await db.collection(LESSONS_COLLECTION).get();
    const lessons: any[] = [];
    lessonsSnapshot.forEach(doc => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort lessons by their designated ID or timestamp if available
    lessons.sort((a, b) => a.id - b.id);
    
    res.status(200).json(lessons);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch lessons', details: error.message });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const lessonData = req.body;
    
    // Auto-generate the lesson ID based on THE HIGHEST existing ID
    const snapshot = await db.collection(LESSONS_COLLECTION).get();
    let maxId = 0;
    
    snapshot.forEach(doc => {
      const currentId = parseInt(doc.id);
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    });

    const newId = maxId + 1;
    
    const newLesson = {
      ...lessonData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    // Save to Firestore using the numerical string as the document ID
    await db.collection(LESSONS_COLLECTION).doc(newId.toString()).set(newLesson);
    
    res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create lesson', details: error.message });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(LESSONS_COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch lesson', details: error.message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lessonData = req.body;
        
        await db.collection(LESSONS_COLLECTION).doc(id).update(lessonData);
        res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update lesson', details: error.message });
    }
};

export const deleteLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.collection(LESSONS_COLLECTION).doc(id).delete();
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete lesson', details: error.message });
    }
};

export const updateLessonQuiz = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quiz } = req.body;
        
        await db.collection(LESSONS_COLLECTION).doc(id).update({ quiz });
        res.status(200).json({ message: 'Lesson quiz updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update quiz', details: error.message });
    }
};

export const uploadLessonVideo = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const videoUrl = `http://localhost:5001/uploads/lessons/video/${req.file.filename}`;
        console.log(`[VIDEO-UPLOAD] Success (Local): ${videoUrl}`);
        
        res.status(200).json({ 
            message: 'Video uploaded successfully', 
            videoUrl: videoUrl 
        });
    } catch (error: any) {
        console.error('[VIDEO-UPLOAD] Error:', error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
};

export const uploadLessonFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folder = req.file.destination.split('/').pop();
        const fileUrl = `http://localhost:5001/uploads/lessons/${folder}/${req.file.filename}`;
        console.log(`[UPLOAD] Success (Local): ${fileUrl}`);
        
        res.status(200).json({ 
            message: 'File uploaded successfully', 
            fileUrl: fileUrl 
        });
    } catch (error: any) {
        console.error('[UPLOAD] Error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

