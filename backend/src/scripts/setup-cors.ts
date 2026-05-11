import { Storage } from '@google-cloud/storage';
import * as path from 'path';

// Load service account
const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');

const storage = new Storage({
  keyFilename: serviceAccountPath
});

async function setupCors() {
  try {
    const [buckets] = await storage.getBuckets();
    console.log('Available buckets:', buckets.map(b => b.name));
    
    // Auto-detect Firebase bucket
    const bucket = buckets.find(b => b.name.includes('bmiwebplatforma')) || buckets[0];
    if (!bucket) throw new Error('No bucket found');
    
    console.log(`Setting CORS for bucket: ${bucket.name}...`);

    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
        responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
        maxAgeSeconds: 3600
      }
    ]);

    console.log(`✅ CORS configuration successfully updated for ${bucket.name}!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to set CORS:', error);
    process.exit(1);
  }
}

setupCors();
