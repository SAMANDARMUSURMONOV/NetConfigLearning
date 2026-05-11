import * as admin from 'firebase-admin';
import path from 'path';

// Specify the service account key path
const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const setAdmin = async (email: string) => {
    try {
        const user = await admin.auth().getUserByEmail(email);
        
        // Set custom user claims
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        
        console.log(`Successfully elevated ${email} to Admin.`);
        console.log(`User UID: ${user.uid}`);
        console.log('NOTE: The user must log out and log back in for the changes to take effect.');
    } catch (error: any) {
        console.error('Error setting admin claim:', error.message);
    } finally {
        process.exit();
    }
};

// Target email
const targetEmail = process.argv[2] || 'samandarmusurmonov4@gmail.com';
setAdmin(targetEmail);
