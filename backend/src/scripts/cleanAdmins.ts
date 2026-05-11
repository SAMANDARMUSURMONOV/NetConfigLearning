import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const demoteUsers = [
    'samandarmusurmonov4@gmail.com',
    'samandarmusurmonov@netconfig.com'
];

const main = async () => {
    try {
        for (const email of demoteUsers) {
            try {
                const user = await admin.auth().getUserByEmail(email);
                await admin.auth().setCustomUserClaims(user.uid, {});
                console.log(`[SUCCESS] Revoked admin from: ${email}`);
            } catch (e: any) {
                console.warn(`[SKIP] Could not process ${email}: ${e.message}`);
            }
        }

        // Final check for the primary admin
        const primaryAdmin = 'samandarmusurmonovv@gmail.com';
        const user = await admin.auth().getUserByEmail(primaryAdmin);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`[VERIFIED] ${primaryAdmin} is still Admin.`);

    } catch (error: any) {
        console.error('Fatal error:', error.message);
    } finally {
        process.exit();
    }
};

main();
