# NetConfigLearning Backend (Node.js/Express) - Render.com Deploy Qo'llanmasi

Ushbu qo'llanma loyihangiz backend qismini **Render.com** serveriga muvaffaqiyatli yuklash va sozlash bo'yicha yo'riqnomadir.

---

## 1. Koddagi Sozlamalar (Tayyor holatda ✅)
Sizning kodingiz allaqachon Render.com uchun to'liq tayyorlangan:
* **Portni tinglash**: `src/index.ts` faylida port dinamik ravishda olingan: `const activePort = process.env.PORT || PORT;` (Render o'zi beradigan portni avtomatik eshitadi).
* **Firebase Kaliti**: Kodingizda `FIREBASE_SERVICE_ACCOUNT` muhit o'zgaruvchisi (Environment Variable) orqali Firebase ma'lumotlarini o'qish qismi allaqachon yozilgan. Faylni GitHub'ga yuklash shart emas!

---

## 2. Loyihani GitHub'ga Yuklash
Render.com loyihangizni faqat GitHub orqali o'qiydi.
1. Loyihaning ildiz (root) papkasidagi `.gitignore` faylida `firebase-service-account.json` va `.env` fayllari yozilganiga ishonch hosil qiling (bular GitHub'ga chiqib ketmasligi kerak, xavfsizlik uchun!).
2. Kodlaringizni GitHub'dagi **shaxsiy (Private)** repozitoriyingizga yuklang (push qiling).

---

## 3. Render.com Panelida Sayt Yaratish
1. **[Render.com](https://render.com/)** saytiga kiring va ro'yxatdan o'tib, GitHub hisobingizni ulang.
2. Render panelida **New +** tugmasini bosing va **Web Service** ni tanlang.
3. GitHub'dagi repozitoriyangizni (`NetConfigLearning`) tanlang (Connect tugmasini bosing).
4. Quyidagi sozlamalarni kiriting:
   * **Name**: `netconfig-backend` (yoki o'zingiz xohlagan nom).
   - **Region**: `Frankfurt (EU)` (O'zbekistonga eng yaqini).
   - **Branch**: `main` (yoki kodlaringiz qaysi branchda bo'lsa o'sha).
   - **Root Directory**: `backend` ⚠️ **(JUDA MUHIM!)** — loyiha monorepo bo'lgani uchun Render faqat `backend` papkasiga kirib ishlashi kerak.
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build` (barcha kutubxonalarni o'rnatib, TypeScript'ni JS'ga o'giradi).
   - **Start Command**: `npm start` (dasturni `node dist/index.js` orqali ishga tushiradi).

---

## 4. Muhit O'zgaruvchilarini (Environment Variables) Sozlash
Sahifaning pastki qismidagi **Advanced** tugmasini bosing va **Add Environment Variable** orqali quyidagi kalitlarni kiriting:

| Kalit nomi (Key) | Qiymati (Value) | Izoh |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production rejimi |
| `GEMINI_API_KEY` | *Gemini API kalitingiz* | Sun'iy intellekt kaliti |
| `GROQ_API_KEY` | *Groq API kalitingiz* | Groq AI kaliti |
| `FIREBASE_SERVICE_ACCOUNT` | *`firebase-service-account.json` faylining barcha JSON kodi* | **Xavfsiz yechim:** Mahalliy kompyuteringizdagi `firebase-service-account.json` faylining ichidagi barcha JSON kodni (boshidagi `{` dan oxiridagi `}` gacha) to'liqligicha nusxalab, shu yerga qo'ying. Kodingiz uni avtomatik tarzda `JSON.parse` qilib ishlatadi! |

---

## 5. Deploy Qilish 🚀
1. Barcha sozlamalardan so'ng, **Create Web Service** tugmasini bosing.
2. Render loyihangizni yuklab oladi, `backend` papkasiga kiradi, `npm install` va `npm run build` qilib, dasturni ishga tushiradi.
3. Server to'liq yurgach, Render sizga quyidagicha havola beradi:
   `https://netconfig-backend.onrender.com`

Endi ushbu havolani frontend kodingizda backend API manzili (baseURL) sifatida ishlata olasiz!
