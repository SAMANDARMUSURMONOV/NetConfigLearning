import { Request, Response } from 'express';
import { db } from '../config/firebase';

const SETTINGS_COLLECTION = 'settings';
const GLOBAL_SETTINGS_ID = 'global';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const doc = await db.collection(SETTINGS_COLLECTION).doc(GLOBAL_SETTINGS_ID).get();
    
    if (!doc.exists) {
      console.log("[SETTINGS] No settings found, returning defaults.");
      // Default settings if none exist
      const defaultSettings = {
        platformName: 'NetConfig Learn',
        platformDescription: 'Corporate Networking E-Learning Platform',
        strictAdminAccess: true,
        publicRegistration: false,
        logoUrl: '',
        socialLinks: {
          telegram: '',
          instagram: ''
        },
        maintenanceMode: false
      };
      return res.status(200).json(defaultSettings);
    }
    
    res.status(200).json(doc.data());
  } catch (error: any) {
    console.error("[SETTINGS ERROR] getSettings:", error);
    res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settingsData = req.body;
    
    await db.collection(SETTINGS_COLLECTION).doc(GLOBAL_SETTINGS_ID).set(settingsData, { merge: true });
    
    res.status(200).json({ message: 'Settings updated successfully', settings: settingsData });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update settings', details: error.message });
  }
};

export const uploadLogo = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const baseUrl = `${protocol}://${req.get('host')}`;
        const logoUrl = `${baseUrl}/uploads/branding/${req.file.filename}`;
        
        // Optionally update the logo URL in settings automatically
        await db.collection(SETTINGS_COLLECTION).doc(GLOBAL_SETTINGS_ID).set({ logoUrl }, { merge: true });
        
        res.status(200).json({ 
            message: 'Logo uploaded successfully', 
            logoUrl 
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Logo upload failed', details: error.message });
    }
};
