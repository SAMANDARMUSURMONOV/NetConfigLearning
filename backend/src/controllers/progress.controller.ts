import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const saveUserProgress = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as any).user;
    const { lessonId, data } = req.body;

    if (!lessonId || !data) {
      return res.status(400).json({ error: 'lessonId and data are required' });
    }

    const progressRef = db.collection('progress').doc(uid);
    const doc = await progressRef.get();

    let progressData = doc.exists ? doc.data() || {} : {};
    
    // Update the specific lesson data
    progressData[lessonId] = {
      ...(progressData[lessonId] || {}),
      ...data,
      lastUpdated: new Date().toISOString()
    };

    await progressRef.set(progressData, { merge: true });

    res.status(200).json({ message: 'Progress saved successfully' });
  } catch (error: any) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress', details: error.message });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { uid: requesterUid, admin } = (req as any).user;

    // Faqat admin yoki foydalanuvchi o'zi o'z progressini ko'rishi mumkin
    if (!admin && uid !== requesterUid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const progressRef = db.collection('progress').doc(uid);
    const doc = await progressRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error: any) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress', details: error.message });
  }
};

export const getAllProgress = async (req: Request, res: Response) => {
  try {
    const progressSnapshot = await db.collection('progress').get();
    const allProgress: any = {};
    
    progressSnapshot.forEach((doc) => {
      allProgress[doc.id] = doc.data();
    });

    res.status(200).json(allProgress);
  } catch (error: any) {
    console.error('Error getting all progress:', error);
    res.status(500).json({ error: 'Failed to fetch all progress', details: error.message });
  }
};
