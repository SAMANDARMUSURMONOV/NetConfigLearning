# NetConfigLearning Backend (Node.js/Express)

Bu loyiha **NetConfigLearning** tizimining backend qismi hisoblanadi.

## Alwaysdata Platformasiga Joylash (Deploy) Bo'yicha Qo'llanma

Loyihani Alwaysdata'da ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Mahalliy kodni tayyorlash
- `src/index.ts` faylida Alwaysdata ajratadigan portni tinglash sozlangan: `const activePort = process.env.PORT || PORT;`
- Firebase kalitlarini `.env` dan o'qish imkoni bo'lmasa, u avtomatik tarzda ildiz (root) papkadagi `firebase-service-account.json` faylini qidiradi.
- Dasturni serverga yuklashdan oldin (yoki serverning o'zida) terminalda `npm run build` buyrug'ini ishga tushiring. Bu TypeScript kodini JavaScript'ga (`dist/` papkasiga) o'girib beradi.

### 2. Alwaysdata panelida sozlash ⚙️
1. Alwaysdata hisobingizga kiring.
2. **Web -> Sites** bo'limidan **Add a site** tugmasini bosing.
3. Quyidagilarni to'ldiring:
   - **Type (Tur)**: Node.js
   - **Command (Buyruq)**: `npm start`
   - **Application Path (Dastur manzili)**: Loyiha papkangiz (masalan: `/home/username/backend`).

### 3. Serverga kodlarni yuklash 📤
- FTP (masalan FileZilla) yordamida Alwaysdata serveriga ulaning.
- `backend` papkasidagi barcha fayllarni (**`node_modules` papkasidan tashqari!**) serverga nusxalang.
- **Muhim:** `firebase-service-account.json` faylini ham albatta yuklang. Bu orqali Firebase ishlab turadi.

### 4. Muhit o'zgaruvchilari va o'rnatish 🔑
- Alwaysdata sayt sozlamalarida "Environment variables" bo'limiga quyidagilarni qo'shing:
  - `NODE_ENV=production`
  - `GEMINI_API_KEY=sizning-kalitingiz`
  - `GROQ_API_KEY=sizning-kalitingiz`
- Alwaysdata panelidan **SSH** bo'limiga kirib terminalni oching.
- Dastur papkasiga kiring (`cd backend` kabi).
- `npm install` yozib barcha kerakli kutubxonalarni o'rnating.

### 5. Dasturni yurgizish va tekshirish 🚀
- Alwaysdata panelidagi **Sites** bo'limiga qaytib, saytni **Restart** qiling.
- Brauzerda saytingiz manziliga (masalan: `https://.../api/health`) kirib ishlayotganini tekshiring. Agar `{"status":"ok","message":"API is running"}` chiqsa, hammasi muvaffaqiyatli yakunlandi!

### Xatoliklarni bartaraf etish
Agar dastur xato bersa (502 Bad Gateway va boshqalar), xatolik sababini bilish uchun Alwaysdata serverida ssh orqali `/home/username/admin/logs/` papkasidagi xatolik loglarini o'qib chiqing yoki panelning o'zidan loglarni ko'ring.
