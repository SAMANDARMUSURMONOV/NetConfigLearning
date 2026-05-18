import { Request, Response } from 'express';
import { auth } from '../config/firebase';

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userUid = (req as any).user.uid;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the public URL for the avatar
    // Since we are using local storage, we point to the /uploads static route
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    // Update Firebase user profile
    await auth.updateUser(userUid, {
      photoURL: avatarUrl
    });

    res.status(200).json({ 
      message: 'Avatar updated successfully', 
      photoURL: avatarUrl 
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar', details: error.message });
  }
};
