import * as admin from 'firebase-admin';
import * as path from 'path';

let serviceAccount: any;

try {
  if (process.env.FB_PROJECT_ID && process.env.FB_PRIVATE_KEY && process.env.FB_CLIENT_EMAIL) {
    // Alohida o'zgaruvchilardan yig'ish
    serviceAccount = {
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'), // \n belgilarni haqiqiy qatorga aylantirish
    };
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));
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
