import * as admin from 'firebase-admin';
import * as path from 'path';

let serviceAccount: any;

function cleanPrivateKey(rawKey: string): string {
  let body = rawKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '');
  
  body = body
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, '');
    
  return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`;
}

function parseRobustServiceAccount(jsonStr: string): any {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.private_key) {
      parsed.private_key = cleanPrivateKey(parsed.private_key);
    }
    return parsed;
  } catch (e: any) {
    console.warn('Standard JSON.parse failed, attempting robust regex parsing for Firebase...', e.message);
    const projectId = jsonStr.match(/"project_id"\s*:\s*"([^"]+)"/)?.[1];
    const clientEmail = jsonStr.match(/"client_email"\s*:\s*"([^"]+)"/)?.[1];
    let privateKey = jsonStr.match(/"private_key"\s*:\s*"([\s\S]+?)"/)?.[1];
    
    if (projectId && clientEmail && privateKey) {
      privateKey = cleanPrivateKey(privateKey);
      return {
        projectId,
        clientEmail,
        privateKey
      };
    }
    throw e;
  }
}

try {
  if (process.env.FB_PROJECT_ID && process.env.FB_PRIVATE_KEY && process.env.FB_CLIENT_EMAIL) {
    // Alohida o'zgaruvchilardan yig'ish
    serviceAccount = {
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: cleanPrivateKey(process.env.FB_PRIVATE_KEY),
    };
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = parseRobustServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (process.env.FIREBASE_SECRET_JSON) {
    serviceAccount = parseRobustServiceAccount(process.env.FIREBASE_SECRET_JSON);
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
