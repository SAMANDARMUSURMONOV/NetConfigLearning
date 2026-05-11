import { auth } from './src/config/firebase';

const listUsers = async () => {
  try {
    const listUsersResult = await auth.listUsers(100);
    console.log('Users:');
    listUsersResult.users.forEach((userRecord) => {
      console.log(`Email: ${userRecord.email}, UID: ${userRecord.uid}, Admin: ${userRecord.customClaims?.admin}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();
