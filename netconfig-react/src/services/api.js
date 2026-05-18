export const BASE_URL = import.meta.env.PROD ? 'https://netconfiglearning.onrender.com' : 'http://localhost:5001';
const API_URL = `${BASE_URL}/api`;

export const apiService = {
  // Darslarni olish
  getLessons: async () => {
    try {
      const response = await fetch(`${API_URL}/lessons`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return await response.json();
    } catch (error) {
      console.error('API Error (getLessons):', error);
      throw error;
    }
  },

  // Dars tafsilotlarini olish
  getLessonById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/lessons/${id}`);
      if (!response.ok) throw new Error('Lesson not found');
      return await response.json();
    } catch (error) {
      console.error('API Error (getLessonById):', error);
      throw error;
    }
  },

  // Yangi dars qo'shish (Admin uchun)
  createLesson: async (lessonData, token) => {
    try {
      const response = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lessonData)
      });
      if (!response.ok) throw new Error('Failed to create lesson');
      return await response.json();
    } catch (error) {
      console.error('API Error (createLesson):', error);
      throw error;
    }
  },

  // Yangi foydalanuvchi qo'shish (Admin)
  createUser: async (userData, token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      console.error('API Error (createUser):', error);
      throw error;
    }
  },

  // Foydalanuvchilar ro'yxatini olish (Admin uchun)
  getUsers: async (token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('API Error (getUsers):', error);
      throw error;
    }
  },

  // Foydalanuvchi holatini o'zgartirish
  toggleUserStatus: async (uid, disabled, token) => {
    try {
      const response = await fetch(`${API_URL}/users/${uid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ disabled })
      });
      if (!response.ok) throw new Error('Failed to update user status');
      return await response.json();
    } catch (error) {
      console.error('API Error (toggleUserStatus):', error);
      throw error;
    }
  },

  // Foydalanuvchini o'chirish (Admin)
  deleteUser: async (uid, token) => {
    try {
      const response = await fetch(`${API_URL}/users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return await response.json();
    } catch (error) {
      console.error('API Error (deleteUser):', error);
      throw error;
    }
  },

  // Darsni tahrirlash (Admin)
  updateLesson: async (id, lessonData, token) => {
    try {
      const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lessonData)
      });
      if (!response.ok) throw new Error('Failed to update lesson');
      return await response.json();
    } catch (error) {
      console.error('API Error (updateLesson):', error);
      throw error;
    }
  },

  // Darsni o'chirish (Admin)
  deleteLesson: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete lesson');
      return await response.json();
    } catch (error) {
      console.error('API Error (deleteLesson):', error);
      throw error;
    }
  },

  // Dars quiz-ini yangilash
  updateLessonQuiz: async (id, quizData, token) => {
    try {
      const response = await fetch(`${API_URL}/lessons/${id}/quiz`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quiz: quizData })
      });
      if (!response.ok) throw new Error('Failed to update quiz');
      return await response.json();
    } catch (error) {
      console.error('API Error (updateLessonQuiz):', error);
      throw error;
    }
  },

  // Sertifikatlarni olish (Admin)
  getCertificates: async (token) => {
    try {
      const response = await fetch(`${API_URL}/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch certificates');
      return await response.json();
    } catch (error) {
      console.error('API Error (getCertificates):', error);
      throw error;
    }
  },

  // Yangi sertifikat berish (Admin)
  issueCertificate: async (certData, token) => {
    try {
      const response = await fetch(`${API_URL}/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(certData)
      });
      if (!response.ok) throw new Error('Failed to issue certificate');
      return await response.json();
    } catch (error) {
      console.error('API Error (issueCertificate):', error);
      throw error;
    }
  },

  // Sertifikatni o'chirish
  deleteCertificate: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/certificates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete certificate');
      return await response.json();
    } catch (error) {
      console.error('API Error (deleteCertificate):', error);
      throw error;
    }
  },

  // Faylni progress bilan yuklash (Umumiy metod)
  uploadFile: (endpoint, file, token, fieldName = 'file', onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append(fieldName, file);

      xhr.open('POST', `${API_URL}${endpoint}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || 'Upload failed'));
          } catch (e) {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },

  // AI orqali test savollarini yaratish
  generateAiQuestions: async (config, token) => {
    try {
      const response = await fetch(`${API_URL}/ai/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error (generateAiQuestions):', error);
      throw error;
    }
  },

  // Profil rasmini yangilash
  updateProfileAvatar: async (file, token) => {
    return apiService.uploadFile('/profile/avatar', file, token, 'avatar');
  },

  // Global sozlamalarni olish
  getSettings: async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json();
    } catch (error) {
      console.error('API Error (getSettings):', error);
      throw error;
    }
  },

  // Global sozlamalarni yangilash
  updateSettings: async (settingsData, token) => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return await response.json();
    } catch (error) {
      console.error('API Error (updateSettings):', error);
      throw error;
    }
  },

  // Logotipni yuklash
  uploadLogo: async (file, token) => {
    return apiService.uploadFile('/settings/logo', file, token, 'logo');
  },

  // === PRACTICAL CLIPS API ===
  // Barcha lavhalarni olish
  getClips: async () => {
    try {
      const response = await fetch(`${API_URL}/clips`);
      if (!response.ok) throw new Error('Failed to fetch clips');
      return await response.json();
    } catch (error) {
      console.error('API Error (getClips):', error);
      return [];
    }
  },

  // Yangi lavha yuklash (Admin)
  createClip: async (file, title, description, token, videoUrl = '') => {
    try {
      let response;
      
      if (file) {
        // Fayl bo'lsa FormData ishlatamiz
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);
        if (videoUrl) formData.append('videoUrl', videoUrl);

        response = await fetch(`${API_URL}/clips`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // Fayl bo'lmasa oddiy JSON yuboramiz
        response = await fetch(`${API_URL}/clips`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, description, videoUrl })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload clip');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error (createClip):', error);
      throw error;
    }
  },

  // Lavhani o'chirish (Admin)
  deleteClip: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/clips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete clip');
      return await response.json();
    } catch (error) {
      console.error('API Error (deleteClip):', error);
      throw error;
    }
  },

  // === PROGRESS API ===
  saveProgress: async (lessonId, data, token) => {
    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId, data })
      });
      if (!response.ok) throw new Error('Failed to save progress');
      return await response.json();
    } catch (error) {
      console.error('API Error (saveProgress):', error);
      throw error;
    }
  },

  getAllProgress: async (token) => {
    try {
      const response = await fetch(`${API_URL}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch all progress');
      return await response.json();
    } catch (error) {
      console.error('API Error (getAllProgress):', error);
      throw error;
    }
  },

  getUserProgress: async (uid, token) => {
    try {
      const response = await fetch(`${API_URL}/progress/${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return await response.json();
    } catch (error) {
      console.error('API Error (getUserProgress):', error);
      throw error;
    }
  }
};

export default apiService;
