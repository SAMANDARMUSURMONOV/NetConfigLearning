import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const storageService = {
  /**
   * Video faylni Firebase Storage'ga yuklash
   * @param {File} file - Yuklash uchun fayl
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<string>} - Download URL
   */
  uploadVideo: async (file, onProgress) => {
    if (!file.type.startsWith('video/')) {
      throw new Error('Faqat video fayllar yuklash mumkin');
    }

    if (file.size > 500 * 1024 * 1024) {
      throw new Error('Fayl hajmi 500MB dan ortiq bo\'lishi kerak');
    }

    return uploadToStorage(file, 'lessons/videos', onProgress);
  },

  /**
   * Labwork faylni Firebase Storage'ga yuklash
   * @param {File} file - Yuklash uchun fayl
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<string>} - Download URL
   */
  uploadFile: async (file, onProgress) => {
    if (file.size > 500 * 1024 * 1024) {
      throw new Error('Fayl hajmi 500MB dan ortiq bo\'lishi kerak');
    }

    return uploadToStorage(file, 'lessons/files', onProgress);
  },

  /**
   * Thumbnail/rasm faylni Firebase Storage'ga yuklash
   * @param {File} file - Yuklash uchun fayl
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<string>} - Download URL
   */
  uploadImage: async (file, onProgress) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Faqat rasm fayllar yuklash mumkin');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Rasm hajmi 10MB dan ortiq bo\'lishi kerak');
    }

    return uploadToStorage(file, 'thumbnails', onProgress);
  }
};

/**
 * Asosiy upload logikasi
 * @private
 */
async function uploadToStorage(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `${folder}/${fileName}`;

    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress callback
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        // Error callback
        console.error('[STORAGE] Upload error:', error);
        reject(new Error(`Upload xatosi: ${error.message}`));
      },
      async () => {
        // Success callback
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('[STORAGE] Upload success:', downloadURL);
          resolve(downloadURL);
        } catch (error) {
          reject(new Error(`Download URL olish xatosi: ${error.message}`));
        }
      }
    );
  });
}
