import { auth } from './src/config/firebase';

const resetPassword = async () => {
  const email = 'samandarmusurmonovv@gmail.com';
  const newPassword = 'Samandar.M0208';
  
  try {
    const user = await auth.getUserByEmail(email);
    
    // Set admin claim to be 100% sure
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    await auth.updateUser(user.uid, {
      password: newPassword
    });
    console.log(`\n✅ Muvaffaqiyatli! ${email} akkauntining paroli "${newPassword}" ga o'zgartirildi va unga Admin huquqi berildi.\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Xatolik yuz berdi: Email topilmadi yoki boshqa xato. Batafsil:\n`, error);
    process.exit(1);
  }
};

resetPassword();
