import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function findBucket() {
  try {
    // Access the underlying @google-cloud/storage instance
    const storageInstance = admin.storage().storage();
    const [buckets] = await storageInstance.getBuckets();
    
    console.log('--- STORAGE BUCKET SEARCH ---');
    if (buckets.length === 0) {
      console.log('No buckets found! Please enable Firebase Storage in the Console.');
    } else {
      console.log('Found ' + buckets.length + ' buckets:');
      buckets.forEach(b => console.log(' -> ' + b.name));
    }
    console.log('-----------------------------');
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  }
}

findBucket();
