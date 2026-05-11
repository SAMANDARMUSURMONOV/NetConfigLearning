import * as admin from 'firebase-admin';
import * as path from 'path';

let serviceAccount: any;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Vercel'da JSON string sifatida keladi
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Mahalliy kompyuterda fayldan o'qiydi
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
