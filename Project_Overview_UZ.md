# NetConfigLearning — Tizim Arxitekturasi va Loyiha Strukturasi Qo'llanmasi

Ushbu hujjat **NetConfigLearning** (BMI Web Platforma negizida qurilgan) loyihasining arxitekturasi, ishlatilgan texnologiyalar steki, batafsil papkalar strukturasi va asosiy funksional tizimlari haqida batafsil ma'lumot beradi.

---

## 1. Loyiha Haqida Umumiy Ma'lumot

**NetConfigLearning** — Kompyuter tarmoqlari, tarmoq protokollari va tarmoq qurilmalarini sozlashni (Network Configuration) o'rgatuvchi zamonaviy, interaktiv **Full-stack Web Platforma (LMS - Learning Management System)**.

### Asosiy Imkoniyatlari:
*   **Premium Foydalanuvchi Dashboardi:** O'quvchining darslardagi progressi, o'zlashtirish grafiklari (charts) va amaliy topshiriqlari.
*   **Anti-Skip Video Pleyer:** YouTube va shaxsiy videolarning brendingini yashirish hamda o'quvchilarga videoni ko'rmasdan oxiriga o'tkazib yuborishni cheklash tizimi.
*   **AI Quiz Generator:** Sun'iy intellekt (Groq Cloud API & Llama 3.3) yordamida har bir tarmoq mavzusiga mos ravishda avtomatik o'zbek tilida testlar yaratish tizimi.
*   **Amaliy Laboratoriya Topshiriqlari:** CLI buyruqlari va tarmoq sozlamalarini topshirish imkoniyati.
*   **Avtomatik Sertifikatlash:** Kursni muvaffaqiyatli yakunlagan talabalarga PDF formatida yuklab olish imkoniyatiga ega premium sertifikat berish.
*   **Amaliy Qisqa Videolar (Practical Clips):** TikTok/Shorts formatidagi qisqa va tezkor amaliy darslar pleyeri.
*   **Batafsil Admin Panel:** Foydalanuvchilarni boshqarish, darslar, amaliy laboratoriyalar, testlar va tizim sozlamalarini boshqarish.

---

## 2. Loyiha Arxitekturasi (Architecture Stack)

Loyiha zamonaviy monorepo arxitekturasi asosida qurilgan bo'lib, quyidagi qismlardan iborat:

*   **Frontend (Mijoz Qismi):** [netconfig-react](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react) papkasida joylashgan. `React.js (v18)`, `Vite` yig'uvchisi, `TailwindCSS` dizayn tizimi, `i18next` ko'p tillilik va `Firebase Client SDK` platformasidan foydalanadi.
*   **Backend (Server Qismi):** [backend](file:///c:/Users/user/Desktop/NetConfigLearning/backend) papkasida joylashgan. `Node.js`, `Express`, `TypeScript` tilida yozilgan. Ma'lumotlarni tekshirish, foydalanuvchi rollarini boshqarish va sun'iy intellekt integratsiyasini boshqaradi.
*   **Ma'lumotlar Bazasi va Bulut xizmatlari:** Firebase platformasi (Firestore - hujjatli NoSQL baza, Storage - fayllar saqlagichi, Authentication - foydalanuvchilar boshqaruvi) hamda AI testlar yaratish uchun Groq Cloud API ishlatiladi.

---

## 3. Batafsil Papkalar Strukturasi (Directory Structure)

Loyiha fayllarining tashkil etilishi modulli tizimga ega:

### 3.1. Root (Tizimning Asosiy Papkasi)
*   [vercel.json](file:///c:/Users/user/Desktop/NetConfigLearning/vercel.json) — Monoreponi Vercel serverless tizimiga oson va muammosiz joylashtirish (deploy) uchun marshrutlar va muhit sozlamalari.
*   [package.json](file:///c:/Users/user/Desktop/NetConfigLearning/package.json) — Monorepo darajasidagi build scriptlari.
*   [File_Upload_Storage_Process.md](file:///c:/Users/user/Desktop/NetConfigLearning/File_Upload_Storage_Process.md) — Mahalliy fayllarni saqlash va yuklash tartibini yorituvchi yo'riqnoma.
*   [video-player-guide.md](file:///c:/Users/user/Desktop/NetConfigLearning/video-player-guide.md) — YouTube pleyerini premium darajaga keltirish va o'tkazib yuborishni cheklash bo'yicha hujjat.

---

### 3.2. Backend Strukturasi ([backend](file:///c:/Users/user/Desktop/NetConfigLearning/backend))
Server kodi to'liq TypeScript'da modulli arxitektura asosida yozilgan:

*   [backend/firebase-service-account.json](file:///c:/Users/user/Desktop/NetConfigLearning/backend/firebase-service-account.json) — Mahalliy Firebase maxfiy kaliti.
*   [backend/tsconfig.json](file:///c:/Users/user/Desktop/NetConfigLearning/backend/tsconfig.json) — TypeScript sozlamalari.
*   [backend/package.json](file:///c:/Users/user/Desktop/NetConfigLearning/backend/package.json) — Backend kutubxonalari va ishga tushirish scriptlari.
*   **backend/uploads/** — Mahalliy yuklangan fayllar ombori:
    *   `lessons/video/` — Dars videolari.
    *   `lessons/audio/` — Audio materiallar.
    *   `lessons/thumbnail/` — Video muqovalari (rasm).
    *   `lessons/document/` — PDF va amaliy laboratoriya topshiriqlari.
*   **backend/src/** — Asosiy kodlar papkasi:
    *   [backend/src/index.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/index.ts) — API Serverni ishga tushiruvchi asosiy fayl.
    *   **config/**:
        *   [backend/src/config/firebase.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/config/firebase.ts) — Firebase Admin SDK sozlash va robust ishga tushirish (env yoki JSON).
    *   **middlewares/**:
        *   [backend/src/middlewares/auth.middleware.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/middlewares/auth.middleware.ts) — JWT va Firebase Token verifikatsiyasi, Admin rolini tekshirish.
    *   **routes/** — API Endpoint yo'nalishlari:
        *   [backend/src/routes/ai.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/ai.route.ts) — AI Quiz Generator endpointi.
        *   [backend/src/routes/lessons.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/lessons.route.ts) — Darslar ro'yxati va darslarni tahrirlash API.
        *   [backend/src/routes/clips.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/clips.route.ts) — Amaliy clips (Shorts) endpointlari.
        *   [backend/src/routes/certificates.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/certificates.route.ts) — Sertifikatlarni tasdiqlash va generatsiya qilish.
        *   [backend/src/routes/progress.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/progress.route.ts) — O'quvchi progressini hisoblash API.
        *   [backend/src/routes/settings.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/settings.route.ts) — Tizim sozlamalari API.
        *   [backend/src/routes/users.route.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/routes/users.route.ts) — Foydalanuvchilar (Admin vs Student) API.
    *   **controllers/** — Biznes mantiq (Business Logic) kodlari:
        *   [backend/src/controllers/lessons.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/lessons.controller.ts)
        *   [backend/src/controllers/clips.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/clips.controller.ts)
        *   [backend/src/controllers/certificates.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/certificates.controller.ts)
        *   [backend/src/controllers/progress.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/progress.controller.ts)
        *   [backend/src/controllers/settings.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/settings.controller.ts)
        *   [backend/src/controllers/users.controller.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/controllers/users.controller.ts)
    *   **services/** — Tashqi xizmatlar bilan integratsiya:
        *   [backend/src/services/ai.service.ts](file:///c:/Users/user/Desktop/NetConfigLearning/backend/src/services/ai.service.ts) — Groq Llama 3.3 modelini chaqirish va o'zbekcha JSON formatda test yaratish.

---

### 3.3. Frontend Strukturasi ([netconfig-react](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react))
Vite + React asosida premium interfeyslar yozilgan:

*   [netconfig-react/index.html](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/index.html) — Asosiy HTML sahifa.
*   [netconfig-react/tailwind.config.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/tailwind.config.js) — Premium dizayn va ranglar palitrasi.
*   [netconfig-react/vite.config.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/vite.config.js) — Vite sozlamalari.
*   [netconfig-react/package.json](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/package.json) — Frontend kutubxonalari.
*   **netconfig-react/src/** — React kodlari papkasi:
    *   [netconfig-react/src/main.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/main.jsx) — React kirish nuqtasi.
    *   [netconfig-react/src/App.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/App.jsx) — Sahifalar marshrutlari (Routing), Guardlar.
    *   [netconfig-react/src/index.css](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/index.css) — Global CSS va premium Tailwind base uslublari.
    *   [netconfig-react/src/firebase.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/firebase.js) — Firebase Client SDK API ulanish sozlamalari.
    *   **context/** — Global holat boshqaruvi (Global State):
        *   [netconfig-react/src/context/AuthContext.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/context/AuthContext.jsx) — Foydalanuvchi tizimga kirishi va seansini saqlash.
        *   [netconfig-react/src/context/ThemeContext.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/context/ThemeContext.jsx) — Dark/Light (Tungi/Kunduzgi) rejim boshqaruvi.
        *   [netconfig-react/src/context/SettingsContext.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/context/SettingsContext.jsx) — Tizim tillari va global sozlamalari.
    *   **services/** — Backend API bilan aloqa xizmati:
        *   [netconfig-react/src/services/api.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/services/api.js) — Axios interceptor bilan barcha API chaqiruvlar.
        *   [netconfig-react/src/services/progressService.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/services/progressService.js) — Darslarni tugatganlik foizini saqlash.
        *   [netconfig-react/src/services/reviewService.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/services/reviewService.js) — Foydalanuvchilar fikrlari (Feedback) servisi.
        *   [netconfig-react/src/services/storageService.js](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/services/storageService.js) — Rasmlarni bulutga yuklash boshqaruvi.
    *   **components/** — Qayta ishlatiluvchi UI qismlar:
        *   [netconfig-react/src/components/Layout.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/Layout.jsx) — O'quvchi sahifasining umumiy asosi.
        *   [netconfig-react/src/components/Sidebar.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/Sidebar.jsx) — Chap navigatsiya paneli (Premium shaffof dizayn).
        *   [netconfig-react/src/components/Header.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/Header.jsx) — Profil, Til va Mavzu o'zgartirgich yuqori panel.
        *   [netconfig-react/src/components/Footer.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/Footer.jsx) — Sayt pastki qismi.
        *   [netconfig-react/src/components/AdminLayout.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/AdminLayout.jsx) — Admin boshqaruv paneli asosi.
        *   [netconfig-react/src/components/AdminSidebar.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/components/AdminSidebar.jsx) — Admin chap navigatsiya paneli.
    *   **pages/** — To'liq sahifalar:
        *   [netconfig-react/src/pages/Landing.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Landing.jsx) — Bosh sahifa (Chiroyli UI gradientlar, FAQ, Statlar bilan).
        *   [netconfig-react/src/pages/Login.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Login.jsx) — Kirish va ro'yxatdan o'tish oynasi (Glassmorphism uslubida).
        *   [netconfig-react/src/pages/Dashboard.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Dashboard.jsx) — Talabaning asosiy ish stoli (Progress va statistika grafiklari).
        *   [netconfig-react/src/pages/CoursesList.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/CoursesList.jsx) — Kurslar va darslar ro'yxati.
        *   [netconfig-react/src/pages/Lesson.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Lesson.jsx) — Dars va topshiriqlar sahifasi (Video Player, Lab topshiriq, AI Quiz).
        *   [netconfig-react/src/pages/PracticalClips.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/PracticalClips.jsx) — Qisqa amaliy videolar sahifasi (Shorts format).
        *   [netconfig-react/src/pages/Profile.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Profile.jsx) — Talaba ma'lumotlarini o'zgartirish.
        *   [netconfig-react/src/pages/Certificate.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/Certificate.jsx) — O'quvchi sertifikati va uni yuklab olish (PDF).
        *   **pages/admin/** — Admin nazorat sahifalari:
            *   [netconfig-react/src/pages/admin/AdminOverview.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/admin/AdminOverview.jsx) — Platforma umumiy statistikasi.
            *   [netconfig-react/src/pages/admin/UserManagement.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/admin/UserManagement.jsx) — O'quvchilarni tahrirlash va rollarini o'zgartirish.
            *   [netconfig-react/src/pages/admin/CourseManagement.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/admin/CourseManagement.jsx) — Kurslar yaratish va darslarni boshqarish.
            *   [netconfig-react/src/pages/admin/LabManagement.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/admin/LabManagement.jsx) — Amaliy laboratoriyalar boshqaruvi.
            *   [netconfig-react/src/pages/admin/QuizManagement.jsx](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/src/pages/admin/QuizManagement.jsx) — Testlarni yaratish va AI orqali generatsiya qilish.

---

## 4. Foydalanilgan Texnologiyalar va Kutubxonalar Tahlili

Platformaning yuqori darajada xavfsiz va samarali ishlashi uchun quyidagi kutubxonalardan foydalanilgan:

### 4.1. Backend Kutubxonalari ([backend/package.json](file:///c:/Users/user/Desktop/NetConfigLearning/backend/package.json))

| Kutubxona | Versiya | Loyihadagi Vazifasi |
| :--- | :--- | :--- |
| **express** | `^4.18.2` | Tezkor va sodda HTTP API server yaratish, marshrutlash (routing) tizimini o'rnatish. |
| **cors** | `^2.8.5` | Brauzerning xavfsizlik cheklovlarini (CORS) chetlab o'tish va frontendga API orqali bog'lanishga ruxsat berish. |
| **dotenv** | `^16.4.5` | Maxfiy ma'lumotlar (`.env` dagi kalitlar, port, ma'lumotlar bazasi parollari) ni xavfsiz saqlash va yuklash. |
| **firebase-admin**| `^12.0.0` | Server tomonida Firebase (Firestore, Auth, Storage) resurslarini to'liq nazorat qilish, admin tokenlarni tekshirish va custom claims (`admin: true`) o'rnatish. |
| **groq-sdk** | `^1.1.2` | Groq Cloud platformasining API'siga ulanib, Llama 3.3 tezkor neyron tarmog'idan foydalanib, dars mavzusiga oid testlarni avtomatik o'zbek tilida generatsiya qilish. |
| **multer** | `^2.1.1` | Form-data orqali foydalanuvchilar va o'qituvchilar yuklayotgan dars materiallari, videolar va rasmlarni qabul qilish. |
| **tsx** (Dev) | `^4.7.1` | TypeScript kodini JavaScript'ga o'girmasdan (compile qilmasdan) tezkor dev rejimda serverni ishga tushirish. |
| **typescript** | `^5.3.3` | Statik tiplash va xavfsiz kod yozish muhitini yaratish. |

---

### 4.2. Frontend Kutubxonalari ([netconfig-react/package.json](file:///c:/Users/user/Desktop/NetConfigLearning/netconfig-react/package.json))

| Kutubxona | Versiya | Loyihadagi Vazifasi |
| :--- | :--- | :--- |
| **react** / **react-dom** | `^18.2.0` | Foydalanuvchi interfeyslarini componentlar asosida reaktiv yaratish. |
| **firebase** | `^10.13.0` | Mijoz (client) qismida login/registratsiya, Firestore'dan real-vaqtda darslarni olish va rasmlarni Firebase Storage'ga yuklash. |
| **react-router-dom** | `^6.22.3` | Bir sahifali ilova (SPA) ichida marshrutlar va sahifalararo o'tishlarni yo'lga qo'yish hamda himoyalangan yo'llar (guards) yaratish. |
| **lucide-react** | `^0.364.0` | Platforma bo'ylab ishlatilgan premium, minimalist va chiroyli SVG ikonkalarni taqdim etish. |
| **react-player** | `^3.4.0` | YouTube, Vimeo yoki shaxsiy yuklangan videolarni boshqariladigan premium pleyer ko'rinishida qo'yish. |
| **screenfull** | `^6.0.2` | Video pleyerni butun ekran (Fullscreen) rejimiga o'tkazishni boshqarish. |
| **recharts** | `^3.8.1` | Talabaning dars o'zlashtirish, test topshirish ko'rsatkichlarini premium chiziqli va ustunli grafiklar orqali chizish. |
| **i18next** / **react-i18next** | `^26.0.3` | Saytni bir vaqtning o'zida O'zbekcha, Ruscha va Inglizcha formatlarga oson o'tkazish. |
| **react-toastify**| `^11.0.5` | Tizimda sodir bo'lgan muhim xabarlarni (masalan, testni topshirdi, xatolik yuz berdi) chiroyli bildirishnomalar (toasts) orqali ko'rsatish. |
| **tailwindcss** (Dev) | `^3.4.1` | Premium, shaffof (glassmorphism), dark mode uslublarini tez va oson yozish uchun utilitar CSS kutubxonasi. |

---

## 5. Tizimdagi Eng Muhim Texnik Yechimlar

Platformaning standart ta'lim tizimlaridan afzalligini ko'rsatuvchi eng muhim yechimlar quyidagilardan iborat:

### 5.1. Anti-Skip Video Player (Videolarni O'tkazib Yuborishni Cheklash)
O'quvchilar darsni ko'rmasdan shunchaki oxiriga o'tkazib, sertifikat olishga urinishlarining oldini olish uchun maxsus algoritm yozilgan:
1.  **Checkpoint Tizimi:** Pleyer har 500 millisekundda o'quvchi ko'rgan eng oxirgi soniyani (`lastTimeRef.current`) eslab qoladi.
2.  **O'tkazishni bloklash:** Agar o'quvchi videoni ushbu ko'rsatkichdan 2 soniyadan ko'proq oldinga o'tkazmoqchi bo'lsa, tizim avtomatik ravishda uni oxirgi ko'rilgan nuqtaga qaytaradi:
    ```javascript
    if (!videoCompleted && !isTeacher) {
        if (newTime > lastTimeRef.current + 2) {
            playerRef.current.seekTo(lastTimeRef.current);
            showToastWarning("Siz videoni oldinga o'tkaza olmaysiz!");
        } else if (newTime > lastTimeRef.current) {
            lastTimeRef.current = newTime;
        }
    }
    ```
3.  **YouTube Brendingini Yashirish:** YouTube logotipi va video nomini yashirish uchun `react-player` elementiga 110% o'lcham berilib, qirralari `overflow: hidden` yordamida kesilgan hamda video ustidan shaffof qatlam (`z-index`) qo'yilib, barcha kliklar ushlab olingan. Batafsil ma'lumot [video-player-guide.md](file:///c:/Users/user/Desktop/NetConfigLearning/video-player-guide.md) faylida keltirilgan.

### 5.2. AI Quiz Generator (Llama 3.3 modelida testlar yaratish)
O'qituvchining vaqtini tejash uchun sun'iy intellekt xizmati yaratilgan. Admin dars mavzusini kiritganda, backend Groq API'ga murojaat qiladi:
*   **Model:** `llama-3.3-70b-versatile`.
*   **Prompting:** Sun'iy intellektdan faqatgina toza JSON formatida javob qaytarish talab qilinadi.
*   **Tizim xavfsizligi:** AI qaytargan JSON array to'g'ridan-to'g'ri tekshiriladi, tozalovchi regexlardan o'tadi va bazaga yuklanadi.

---

## 6. Loyihani Mahalliy Ishga Tushirish (Local Setup)

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Repositoryni yuklab olish va papkaga kirish:
```bash
git clone <repository_url>
cd NetConfigLearning
```

### 2. Dependency'larni o'rnatish:
Monorepo bo'lganligi uchun root, backend va frontend dependencies alohida o'rnatiladi:
```bash
# Root va backend dependenciesni o'rnatish
npm install

# Frontend dependenciesni o'rnatish
cd netconfig-react
npm install
cd ..
```

### 3. Environment o'zgaruvchilarini sozlash:
*   [backend/.env](file:///c:/Users/user/Desktop/NetConfigLearning/backend/.env) faylini yaratib, quyidagi kalitlarni kiriting:
    ```env
    GROQ_API_KEY=gsk_your_groq_api_key_here
    FB_PROJECT_ID=bmiwebplatforma
    FB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ..."
    FB_CLIENT_EMAIL=firebase-adminsdk-xxx@bmiwebplatforma.iam.gserviceaccount.com
    ```

### 4. Loyihani ishga tushirish:
```bash
# Frontendni ishga tushirish (netconfig-react papkasida)
npm run dev

# Backendni ishga tushirish (backend papkasida)
npm run dev
```

---

## 7. Xulosa

**NetConfigLearning** zamonaviy React + Node.js (TypeScript) + Firebase texnologiyalaridan unumli foydalangan holda, ta'lim tizimlaridagi eng dolzarb muammolar (masalan, videolarni o'tkazib yuborish, test savollarini tayyorlashdagi qiyinchiliklar) ni optimal hal qilgan yuqori tezlikda ishlovchi Fullstack platformadir.
