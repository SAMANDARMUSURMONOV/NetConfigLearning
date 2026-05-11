import { db } from './src/config/firebase';

const checkData = async () => {
  try {
    const snapshot = await db.collection('lessons').get();
    console.log(`Found ${snapshot.size} lessons.`);
    snapshot.forEach(doc => {
      console.log(doc.id, doc.data().title);
    });

    const userSnapshot = await db.collection('users').get();
    console.log(`Found ${userSnapshot.size} users in DB.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();
