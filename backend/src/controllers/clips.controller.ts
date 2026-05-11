import { Request, Response } from 'express';
import { db } from '../config/firebase';

const CLIPS_COLLECTION = 'practical_clips';

export const getClips = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(CLIPS_COLLECTION).orderBy('createdAt', 'desc').get();
    const clips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(clips);
  } catch (error: any) {
    console.error("[CLIPS ERROR] getClips:", error);
    res.status(500).json({ error: 'Failed to fetch clips', details: error.message });
  }
};

export const createClip = async (req: Request, res: Response) => {
  console.log("[DEBUG] createClip request received:", { 
    body: req.body, 
    file: req.file ? req.file.filename : 'none',
    contentType: req.headers['content-type']
  });
  try {
    const { title, description, videoUrl: bodyVideoUrl } = req.body;
    let videoUrl = '';

    if (req.file) {
      videoUrl = `/uploads/clips/${req.file.filename}`;
    } else if (bodyVideoUrl) {
      videoUrl = bodyVideoUrl;
    } else {
      return res.status(400).json({ error: 'No video file or URL provided' });
    }

    const newClip = {
      title,
      description,
      videoUrl,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection(CLIPS_COLLECTION).add(newClip);
    
    res.status(201).json({ id: docRef.id, ...newClip });
  } catch (error: any) {
    console.error("[CLIPS ERROR] createClip:", error);
    res.status(500).json({ error: 'Failed to create clip', details: error.message });
  }
};

export const deleteClip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(CLIPS_COLLECTION).doc(id).delete();
    // Optionally: delete the actual video file from disk as well
    res.status(200).json({ message: 'Clip deleted successfully' });
  } catch (error: any) {
    console.error("[CLIPS ERROR] deleteClip:", error);
    res.status(500).json({ error: 'Failed to delete clip', details: error.message });
  }
};
