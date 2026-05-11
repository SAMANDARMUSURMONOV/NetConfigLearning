const { Storage } = require('@google-cloud/storage');
import path from 'path';

const keyPath = path.resolve(__dirname, '../../firebase-service-account.json');
const storage = new Storage({ keyFilename: keyPath });

async function listBuckets() {
  try {
    const [buckets] = await storage.getBuckets();
    console.log('Available buckets:');
    buckets.forEach(bucket => {
      console.log(` - ${bucket.name}`);
    });
    if (buckets.length === 0) {
      console.log('No buckets found for this service account.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listBuckets();
