import { Request, Response } from 'express';
import { db } from '../config/firebase';

const CERT_COLLECTION = 'certificates';

export const getCertificates = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(CERT_COLLECTION).orderBy('createdAt', 'desc').get();
    const certs: any[] = [];
    snapshot.forEach(doc => {
      certs.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(certs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch certificates', details: error.message });
  }
};

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const certData = req.body;
    
    const newCert = {
      ...certData,
      certId: `NC-${Date.now().toString().slice(-6)}`, // Unikal sertifikat ID
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection(CERT_COLLECTION).add(newCert);
    res.status(201).json({ id: docRef.id, ...newCert });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to issue certificate', details: error.message });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.collection(CERT_COLLECTION).doc(id).delete();
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete certificate', details: error.message });
    }
};
