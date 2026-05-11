import * as admin from 'firebase-admin';
import * as path from 'path';

// Using the local json file for the service account
const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bmiwebplatforma.firebasestorage.app'
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export { admin };
