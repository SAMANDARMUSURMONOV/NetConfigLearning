import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const debugUser = async (email) => {
    try {
        const userRec = await admin.auth().getUserByEmail(email);
        console.log('User UID:', userRec.uid);
        console.log('Custom Claims:', userRec.customClaims);
    } catch (e) {
        console.error(e.message);
    } finally {
        process.exit();
    }
};

debugUser('samandarmusurmonovv@gmail.com');
