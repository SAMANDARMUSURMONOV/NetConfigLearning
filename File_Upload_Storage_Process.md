# LMS Loyihasida Fayl va Videolarni Yuklash va Saqlash Tizimi

Ushbu hujjatda loyihada fayllar (rasm, audio, video, hujjat) qanday yuklanishi, qayerda saqlanishi va ma'lumotlar bazasida qanday aks etishi batafsil tushuntirilgan.

---

## 1. Saqlash Joyi (Storage)

Loyihada fayllar **Serverning mahalliy xotirasida (Local Storage)** saqlanadi. 

- **Asosiy papka:** `backend/uploads/`
- **Tashkil etilishi:** Fayllar turiga qarab quyidagi quyi papkalarga bo'linadi:
  - `uploads/lessons/video/` — Video darsliklar uchun.
  - `uploads/lessons/audio/` — Audio materiallar/podkastlar uchun.
  - `uploads/lessons/thumbnail/` — Dars yoki kurs muqova rasmlari uchun.
  - `uploads/lessons/document/` — PDF, DOCX, PPTX kabi hujjatlar uchun.
  - `uploads/lessons/others/` — Boshqa turdagi fayllar uchun.

---

## 2. Yuklash Jarayoni (Upload Process)

Fayllarni yuklash jarayoni **Multer** kutubxonasi orqali amalga oshiriladi.

### Backend qismi (`backend/routes/upload.js`):
1. **Multer Storage:** `multer.diskStorage` ishlatiladi.
2. **Nomi:** Fayllarga takrorlanmas nom beriladi: `Date.now() + random_number + kengaytma`.
3. **API Endpoint:** `POST /api/upload`
   - Bu endpointga `file` (faylning o'zi) va `type` (video, audio, rasm va h.k.) yuboriladi.
   - Muvaffaqiyatli yuklangach, server faylning to'liq URL manzilini qaytaradi (masalan: `http://localhost:5000/uploads/lessons/video/1713636000-123456.mp4`).

### Frontend qismi (`vite-project/src/Components/Multimodal/LessonForm.jsx`):
1. **FormData:** Fayl tanlanganda `FormData` ob'ekti yaratiladi.
2. **Axios:** `axios.post` orqali `/api/upload` ga yuboriladi.
3. **Progress:** Yuklanish foizi (`onUploadProgress`) foydalanuvchiga `LinearProgress` orqali ko'rsatiladi.
4. **URL Saqlash:** Serverdan qaytgan URL `formData` dagi tegishli maydonga (masalan, `videoUrl`) yoziladi.

---

## 3. Ma'lumotlar Bazasida Saqlash (Database)

Ma'lumotlar bazasida (MongoDB) faylning o'zi emas, balki uning **URL manzili (string)** saqlanadi.

- **Lesson Model:** `videoUrl`, `audioUrl`, `documentUrl`, `thumbnailUrl` maydonlarida serverdagi fayl manzili saqlanadi.
- **Submission Model:** Talabalar topshirgan vazifalarning fayl manzillari `fileUrl` maydonida saqlanadi.

---

## 4. Fayllarni Ko'rish va Static Serving

Fayllarni brauzerda ko'rish uchun `backend/server.js` da quyidagi sozlama mavjud:

```javascript
app.use('/uploads', express.static('uploads'));
```

Bu kod `uploads` papkasini tashqi dunyoga ochiq qiladi. Shuning uchun frontendda `<video src={lesson.videoUrl} />` yoki `<img src={course.thumbnail} />` kabi kodlar orqali fayllarni ko'rish mumkin.

---

## 5. Tashqi Havolalar (External Links)

Loyihada faqat yuklangan fayllar emas, balki tashqi havolalar ham qo'llab-quvvatlanadi:
- **YouTube/Vimeo:** Video URL maydoniga to'g'ridan-to'g'ri havola qo'yish mumkin.
- **Sketchfab/Spline:** Interaktiv 3D modellar uchun iframe/embed havolalaridan foydalaniladi.
- **Cloud Storage:** Google Drive yoki boshqa bulutli xizmatlardagi fayl havolalarini ham saqlash mumkin.

---

## 6. Xavfsizlik

- Yuklash funksiyasi faqat avtorizatsiyadan o'tgan foydalanuvchilar (`auth` middleware) uchun ochiq.
- O'qituvchilar va adminlar dars yuklay oladi, talabalar esa faqat o'z vazifalarini yuklay oladi.
