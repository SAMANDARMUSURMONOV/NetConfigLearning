const PROGRESS_KEY = 'netconfig_user_progress';

const progressService = {
  // Barcha progressni olish
  getAllProgress: () => {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading progress:', e);
      return {};
    }
  },

  // Muayyan foydalanuvchi uchun progressni olish
  getUserProgress: (userId) => {
    if (!userId) return {};
    const all = progressService.getAllProgress();
    return all[userId] || {};
  },

  // Progressni saqlash (dars tugatish yoki test natijasi)
  saveProgress: (userId, lessonId, data) => {
    if (!userId) return;
    
    const all = progressService.getAllProgress();
    if (!all[userId]) all[userId] = {};
    
    // Mavjud dars ma'lumotlarini yangilash yoki qo'shish
    const currentLessonData = all[userId][lessonId] || {};
    
    all[userId][lessonId] = {
      ...currentLessonData,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  },

  // Foydalanuvchi statistikasini hisoblash
  calculateStats: (userId, totalLessonsCount) => {
    const userProgress = progressService.getUserProgress(userId);
    const lessonIds = Object.keys(userProgress);
    
    if (lessonIds.length === 0) {
      return {
        masteredCount: 0,
        attemptedCount: 0,
        averageScore: 0,
        overallProgress: 0
      };
    }

    const mastered = lessonIds.filter(id => userProgress[id].completed).length;
    const attempted = lessonIds.length;
    
    // Quiz ballari mavjud darslarning o'rtachasini hisoblash
    const scores = lessonIds
      .map(id => userProgress[id].score)
      .filter(score => score !== undefined && score !== null);
    
    const totalScoreSum = scores.reduce((a, b) => a + b, 0);
    const averageScore = scores.length > 0 ? Math.round(totalScoreSum / scores.length) : 0;
      
    const overallProgress = Math.round((mastered / totalLessonsCount) * 100);

    return {
      masteredCount: mastered,
      attemptedCount: attempted,
      averageScore,
      totalScoreSum,
      overallProgress
    };
  }
};

export default progressService;
