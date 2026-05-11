import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function testBuckets() {
  const possibleBuckets = [
    'bmiwebplatforma.appspot.com',
    'bmiwebplatforma.firebasestorage.app',
    'bmiwebplatforma',
    'gs://bmiwebplatforma.appspot.com'
  ];

  for (const b of possibleBuckets) {
    try {
      console.log(`Testing bucket: ${b}...`);
      const bucket = admin.storage().bucket(b.startsWith('gs://') ? b.slice(5) : b);
      const [exists] = await bucket.exists();
      if (exists) {
        console.log(`>>> SUCCESS: Bucket ${b} exists!`);
        return;
      } else {
        console.log(`- Bucket ${b} does not exist.`);
      }
    } catch (error) {
       console.log(`- Error testing ${b}: ${error.message}`);
    }
  }
  console.log('\nCONCLUSION: None of the standard buckets were found. Please verify Firebase Storage is enabled in the Console.');
}

testBuckets();
