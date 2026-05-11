import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Filter, Lock, Play, Clock, CheckCircle } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import progressService from '../services/progressService';
import { defaultVideoLessons } from '../data/coursesData';

const CoursesList = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'mastered', 'locked'

  // Dynamic Progress Stats
  const userProgress = progressService.getUserProgress(user?.uid);
  const stats = progressService.calculateStats(user?.uid, lessons.length || defaultVideoLessons.length);
  const { masteredCount, overallProgress } = stats;
  const hasProgress = overallProgress > 0;

  // Find next lesson to continue
  const getNextLessonId = () => {
    if (!lessons.length) return 1;
    const nextUnfinished = lessons.find(l => !userProgress[l.id]?.completed);
    return nextUnfinished ? nextUnfinished.id : (lessons[0]?.id || 1);
  };
  const nextLessonId = getNextLessonId();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLessons();
        setLessons(data);
      } catch (err) {
        console.error("Failed to load lessons from API:", err);
        // Xatolik bo'lsa, foydalanuvchiga bildirish yoki mock data-ga qaytish mumkin
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // Filter and search logic
  const filteredLessons = (lessons || []).filter(lesson => {
    const matchesSearch = (lesson.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (lesson.description || '').toLowerCase().includes(search.toLowerCase());
    
    const isMastered = !!userProgress[lesson.id]?.completed;
    const prevLessonId = parseInt(lesson.id) - 1;
    const prevCompleted = prevLessonId > 0 ? userProgress[prevLessonId]?.completed : true;
    const isLocked = !isAuthenticated || (!prevCompleted && parseInt(lesson.id) !== 1);

    let matchesFilter = true;
    if (filter === 'mastered') matchesFilter = isMastered;
    if (filter === 'locked') matchesFilter = isLocked;

    return matchesSearch && matchesFilter;
  });


  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 px-4 py-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Premium Welcome Banner */}
        <div className="bg-white dark:bg-dark-800/40 rounded-[24px] p-8 md:p-12 mb-8 border border-slate-200 dark:border-dark-700/50 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between transition-colors">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-electric/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10 w-full md:w-2/3 mb-8 md:mb-0 text-center md:text-left">
              <span className="inline-block bg-slate-100 dark:bg-dark-900/50 text-electric text-[0.65rem] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 border border-slate-200 dark:border-dark-700">
                {t('welcome_back') || 'Xush kelibsiz'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                {t('hero_greeting') || 'Xush kelibsiz,'} {isAuthenticated && user?.name ? user.name.toUpperCase() : (t('guest') || 'MEHMON')}!
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl">
                {hasProgress 
                  ? (t('hero_subtitle_text') || "Ajoyib natija ko'rsatayapsiz. Qolgan joyidan davom ettiramiz!")
                  : (t('hero_subtitle_empty') || "Hali hech qanday kursni boshlamagansiz. Birinchi darsni boshlang!")}
              </p>
              <Link 
                 to={isAuthenticated ? `/dashboard/lesson/${nextLessonId}` : '/login'} 
                 className="inline-flex items-center gap-3 bg-electric hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(0,180,255,0.3)] hover:shadow-[0_8px_30px_rgba(0,180,255,0.5)] active:scale-95"
              >
                 <Play size={20} fill="currentColor" /> 
                 <span>{hasProgress ? (t('resume_learning') || 'Kursni davom ettirish') : (t('start_learning') || 'Kursni boshlash')}</span>
              </Link>
            </div>
            
            <div className={`relative z-10 bg-slate-50 dark:bg-dark-700/20 backdrop-blur-md rounded-[24px] p-8 border flex items-center gap-10 shadow-lg dark:shadow-xl transition-all ${hasProgress ? 'border-slate-200 dark:border-dark-600/40' : 'border-slate-100 dark:border-dark-700/20 opacity-80'}`}>
              <div className="text-center group">
                <div className={`text-4xl font-black mb-2 transition-colors ${hasProgress ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {masteredCount}
                </div>
                <div className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase opacity-70">{t('status_mastered') || "O'zlashtirildi"}</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-dark-700/50"></div>
              <div className="text-center group">
                <div className={`text-4xl font-black mb-2 transition-colors ${hasProgress ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {overallProgress}%
                </div>
                <div className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase opacity-70">{t('status_progress') || "Progress"}</div>
              </div>
            </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={t('search_lessons') || 'Darslarni izlash...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700/80 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric transition-colors shadow-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700/80 rounded-xl px-4 py-3 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-electric cursor-pointer shadow-sm"
            >
              <option value="all" className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white">{t('filter_all') || 'Barcha darslar'}</option>
              <option value="mastered" className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white">{t('filter_mastered') || 'O\'zlashtirilgan ✓'}</option>
              <option value="locked" className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white">{t('filter_locked') || 'Qulflangan 🔒'}</option>
            </select>
            <Filter className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-slate-400 font-medium tracking-wide">
          {t('showing') || 'Ko\'rsatilmoqda:'} {filteredLessons.length} {filteredLessons.length === 1 ? (t('lesson_single') || 'dars') : (t('lesson_plural') || 'darslar')}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLessons.map((lesson, index) => {
            const prevLessonId = parseInt(lesson.id) - 1;
            const prevCompleted = prevLessonId > 0 ? userProgress[prevLessonId]?.completed : true;
            const isAdmin = user?.role === 'admin';
            const isLocked = !isAuthenticated || (!prevCompleted && parseInt(lesson.id) !== 1 && !isAdmin);
            const isMastered = isAuthenticated && !!userProgress[lesson.id]?.completed;

            return (
              <div 
                key={lesson.id} 
                className={`group flex flex-col bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,180,255,0.15)] hover:border-electric/50 shadow-sm ${isLocked ? 'opacity-80' : ''}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-100 dark:bg-dark-900 overflow-hidden">
                  <img 
                    src={lesson.thumbnail} 
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'; // Cybersecurity/Tech fallback
                    }}
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-slate-900/20 dark:bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {!isLocked ? (
                      <span className="w-14 h-14 bg-electric/90 text-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-electric/50">
                        <Play size={24} className="ml-1" />
                      </span>
                    ) : (
                      <span className="w-14 h-14 bg-white/80 dark:bg-dark-900/80 text-slate-900 dark:text-white rounded-full flex items-center justify-center border border-slate-200 dark:border-dark-600 backdrop-blur-sm shadow-md">
                        <Lock size={20} className="text-slate-600 dark:text-slate-300" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-dark-900/90 text-slate-900 dark:text-slate-200 text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 border border-slate-200 dark:border-dark-700 shadow-sm">
                    <Clock size={12} /> {lesson.duration}
                  </div>
                  
                  {isMastered && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                      <CheckCircle size={14} /> {t('mastered_tag') || 'O\'zlashtirildi'}
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute top-2 right-2 bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-600 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Lock size={12} /> {isAuthenticated ? (t('badge_locked') || 'Qulflangan') : (t('pro_tag') || 'Pro')}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] text-electric font-black tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                    <span className="bg-electric/10 px-2 py-0.5 rounded-md">{t(lesson.level.toLowerCase()) || lesson.level}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-slate-900 dark:text-white">{t('lesson') || 'Lesson'} {index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-electric transition-colors line-clamp-2">
                    {lesson.title || t(`lesson${lesson.id}_title`)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 flex-1">
                    {lesson.description || t(`lesson${lesson.id}_desc`)}
                  </p>
                  
                  {/* Action Button */}
                  <Link 
                    to={isLocked ? '/login' : `/dashboard/lesson/${lesson.id}`}
                    className={`w-full py-2.5 rounded-lg text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                      isLocked 
                        ? 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600 border border-slate-200 dark:border-dark-600' 
                        : 'bg-blue-500/5 dark:bg-blue-500/10 text-electric hover:bg-electric hover:text-white border border-blue-500/10 dark:border-blue-500/20'
                    }`}
                  >
                    <Play size={14} fill={!isLocked ? "currentColor" : "none"} className={isLocked ? "text-slate-400" : ""} />
                    {isLocked ? (t('unlock_course') || 'Kursni ochish') : (t('start_processing') || 'Darsni ko\'rish')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-dark-800/50 rounded-2xl border border-slate-200 dark:border-dark-700/50 backdrop-blur-sm shadow-xl transition-colors">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('no_lessons_found') || 'Hech qanday dars topilmadi'}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t('try_adjusting_search') || 'Qidiruv yoki filtrlarni o\'zgartirib ko\'ring.'}</p>
            <button 
              onClick={() => {setSearch(''); setFilter('all');}}
              className="mt-6 px-6 py-2 bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600 text-slate-900 dark:text-white rounded-lg transition-colors text-sm font-medium border border-slate-200 dark:border-dark-600"
            >
              {t('clear_filters') || 'Filtrlarni tozalash'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CoursesList;
