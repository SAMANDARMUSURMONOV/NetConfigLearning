const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, 'firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bmiwebplatforma.appspot.com'
});

async function testUpload() {
    try {
        const bucket = admin.storage().bucket();
        console.log("Bucket name:", bucket.name);
        
        const file = bucket.file('test-file.txt');
        const buffer = Buffer.from("Hello world!");
        
        console.log("Saving buffer...");
        await file.save(buffer, {
            contentType: 'text/plain',
            resumable: false
        });
        
        console.log("Upload successful!");
    } catch (err) {
        console.error("Upload error!", err);
    }
}

testUpload();
