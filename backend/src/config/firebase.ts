import * as admin from 'firebase-admin';
import * as path from 'path';

let serviceAccount: any;

try {
  if (process.env.FB_PROJECT_ID && process.env.FB_PRIVATE_KEY && process.env.FB_CLIENT_EMAIL) {
    // Alohida o'zgaruvchilardan yig'ish
    serviceAccount = {
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const fs = require('fs');
    const localPath = path.resolve(process.cwd(), 'firebase-service-account.json');
    if (fs.existsSync(localPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    } else {
      console.warn('Firebase credentials not found in env or firebase-service-account.json!');
    }
  }
} catch (error) {
  console.error('Firebase service account could not be loaded:', error);
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'bmiwebplatforma.firebasestorage.app'
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export { admin };
