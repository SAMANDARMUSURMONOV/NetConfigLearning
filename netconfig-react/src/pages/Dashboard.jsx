import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  PlayCircle, 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Star, 
  Activity, 
  BookOpen, 
  Target, 
  Zap, 
  Layout, 
  MoreHorizontal,
  RefreshCw,
  Lock,
  BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import progressService from '../services/progressService';
import apiService from '../services/api';

const CircularProgress = ({ value, max, label, icon: Icon, colorClass, delay = 0 }) => {
  const [offset, setOffset] = useState(1000);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const isPercent = label.toLowerCase().includes('progress') || label.toLowerCase().includes('score') || label.toLowerCase().includes('natija') || label.toLowerCase().includes('ball');
  const isRating = label.toLowerCase().includes('rating') || label.toLowerCase().includes('reyting');
  
  const getRatingText = (score) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B+";
    if (score >= 70) return "B";
    if (score >= 60) return "C+";
    return "C";
  };

  const displayValue = isRating ? getRatingText(value) : (isPercent ? (value === 0 && max === 100 ? "0%" : `${value}%`) : value);

  useEffect(() => {
    const timer = setTimeout(() => {
      // max 0 bo'lsa yoki value NaN bo'lsa, p = 0 bo'ladi
      const p = (max > 0 && !isNaN(value)) ? Math.min(value / max, 1) : 0;
      const newOffset = circumference - p * circumference;
      setOffset(newOffset);
    }, 100 + delay);
    return () => clearTimeout(timer);
  }, [value, max, circumference, delay]);

  return (
    <div className={`group bg-white dark:bg-dark-800/40 backdrop-blur-sm border border-slate-200 dark:border-dark-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,180,255,0.1)] hover:bg-slate-50 dark:hover:bg-dark-800/60 relative overflow-hidden active:scale-95 ${colorClass}`}>
      
      {/* Background Glow */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-10 dark:opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${colorClass.replace('border-', 'bg-')}`}></div>

      <div className="relative w-[150px] h-[150px] flex items-center justify-center mb-5 mt-2">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-white/5" />
          <circle 
            cx="60" cy="60" r={radius} fill="none" 
            stroke="currentColor" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out text-electric drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]"
          />
        </svg>
        
        <div className="flex flex-col items-center justify-center text-center px-2">
          <div className="text-[2.6rem] font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1 drop-shadow-sm dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            {displayValue === "— %" ? "0%" : displayValue}
          </div>
          {Icon && (
            <div className="text-slate-400 dark:text-slate-500 group-hover:text-electric transition-colors duration-500">
               <Icon size={18} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      <div className="text-[0.75rem] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-black mt-2 text-center opacity-70 group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, getIdToken } = useAuth();
  const { t } = useTranslation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncTrigger, setSyncTrigger] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = user ? await getIdToken().catch(() => null) : null;
        
        const [lessonsData, remoteProgress] = await Promise.all([
          apiService.getLessons(),
          (token && user?.uid) ? apiService.getUserProgress(user.uid, token).catch(() => ({})) : Promise.resolve({})
        ]);
        
        setLessons(lessonsData || []);

        if (user?.uid && remoteProgress && Object.keys(remoteProgress).length > 0) {
            Object.keys(remoteProgress).forEach(lessonId => {
                progressService.saveProgress(user.uid, lessonId, remoteProgress[lessonId]);
            });
            setSyncTrigger(prev => prev + 1); // Triggers re-render with synced data
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  // Dynamic Progress Logic
  const userProgress = progressService.getUserProgress(user?.uid);
  const stats = progressService.calculateStats(user?.uid, lessons.length);
  
  const { masteredCount, attemptedCount, averageScore, totalScoreSum, overallProgress } = stats;
  const totalLessons = lessons.length;
  const hasProgress = attemptedCount > 0;

  const achievements = [
    { id: 1, name: t('ach_1_name'), icon: '👣', req: t('ach_1_req'), unlocked: masteredCount >= 1 },
    { id: 2, name: t('ach_2_name'), icon: '🚀', req: t('ach_2_req'), unlocked: masteredCount >= 4 },
    { id: 3, name: t('ach_3_name'), icon: '⭐', req: t('ach_3_req'), unlocked: masteredCount >= 7 },
    { id: 4, name: t('ach_4_name'), icon: '🔥', req: t('ach_4_req'), unlocked: masteredCount >= 12 },
    { id: 5, name: t('ach_5_name'), icon: '🏆', req: t('ach_5_req'), unlocked: masteredCount > 0 && masteredCount === totalLessons },
    { id: 6, name: t('ach_6_name'), icon: '💯', req: t('ach_6_req'), unlocked: averageScore === 100 },
    { id: 7, name: t('ach_7_name'), icon: '⚡', req: t('ach_7_req'), unlocked: masteredCount >= 3 },
    { id: 8, name: t('ach_8_name'), icon: '📈', req: t('ach_8_req'), unlocked: averageScore >= 70 }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 border-x border-slate-200 dark:border-dark-800 pb-20 transition-colors">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-dark-700/50 bg-slate-50/50 dark:bg-dark-800/30 p-8 sm:px-12 backdrop-blur-sm mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <span className="text-4xl">📊</span> 
              <span>{t('my_learning_progress')}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {hasProgress 
                ? `${t('track_course_completion')}, ${user?.name}` 
                : (t('hero_subtitle_empty') || "Hali hech qanday kursni boshlamagansiz. Birinchi kursni boshlang!")}
            </p>
          </div>
          <Link to="/courses" className="bg-electric/10 text-electric hover:bg-electric hover:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shrink-0">
            {hasProgress ? (t('resume_learning')) : (t('start_learning') || "Birinchi kursni boshlash")}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CircularProgress 
            value={overallProgress} 
            max={100} 
            label={t('overall_progress') || t('total_score')} 
            icon={Zap}
            colorClass="border-electric/30 hover:border-electric" 
            delay={0} 
          />
          <CircularProgress 
            value={masteredCount} 
            max={totalLessons || 1} 
            label={t('lessons_mastered')} 
            icon={Award}
            colorClass="border-green-500/30 hover:border-green-500" 
            delay={100} 
          />
          <CircularProgress 
            value={attemptedCount} 
            max={totalLessons || 1} 
            label={t('lessons_attempted')} 
            icon={Target}
            colorClass="border-orange-500/30 hover:border-orange-500" 
            delay={200} 
          />
          <CircularProgress 
            value={totalLessons > 0 ? (totalScoreSum / (totalLessons * 100)) * 100 : 0} 
            max={100} 
            label={t('study_rating') || 'O\'quv reytingi'} 
            icon={Award}
            colorClass="border-purple-500/30 hover:border-purple-500" 
            delay={300} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Detailed Component - Left Side (Takes 2 cols) */}
          <div className="xl:col-span-2 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700/50 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📚</span> {t('lesson_by_lesson')}
            </h2>
            
            <div className="space-y-4">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 dark:bg-dark-900 animate-pulse rounded-xl border border-slate-200 dark:border-dark-700"></div>)
              ) : lessons.length === 0 ? (
                <div className="text-center py-10 text-slate-500 italic">{t('no_lessons_found') || 'Hech qanday dars topilmadi.'}</div>
              ) : lessons.map((lesson, idx) => {
                const lessonData = userProgress[lesson.id] || {};
                
                let status = 'locked';
                let score = 0;

                if (lessonData.completed) {
                  status = 'mastered';
                  score = lessonData.score !== undefined ? lessonData.score : 100;
                } else if (lessonData.lastUpdated) {
                  status = 'attempted';
                  score = lessonData.score || 0;
                } else if (idx === attemptedCount) {
                  status = 'not_started';
                }

                // Admins see all lessons as unlocked
                const isAdmin = user?.role === 'admin';
                if (isAdmin && status === 'locked') {
                  status = 'not_started';
                }

                let badgeClass = 'bg-slate-100 dark:bg-dark-700 text-slate-500 border-slate-200 dark:border-dark-600';
                let icon = <Lock size={16} />;
                let barClass = 'bg-slate-200 dark:bg-dark-600';
                let progressW = 0;

                if (status === 'mastered') {
                  badgeClass = 'bg-green-500/10 text-green-500 border-green-500/30';
                  icon = <CheckCircle size={16} />;
                  barClass = 'bg-gradient-to-r from-green-500 to-emerald-400';
                  progressW = score;
                } else if (status === 'attempted') {
                  badgeClass = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
                  icon = <PlayCircle size={16} />;
                  barClass = 'bg-gradient-to-r from-orange-500 to-yellow-400';
                  progressW = score;
                } else if (status === 'not_started') {
                  badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  icon = <Clock size={16} />;
                }

                return (
                  <Link 
                    key={lesson.id} 
                    to={status === 'locked' ? '#' : `/dashboard/lesson/${lesson.id}`}
                    className={`flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700 hover:border-blue-300 dark:hover:border-dark-600 p-4 rounded-xl transition-all hover:bg-white dark:hover:bg-dark-900 hover:-translate-y-0.5 ${
                      status === 'locked' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:shadow-[0_8px_25px_rgba(0,180,255,0.08)]'
                    }`}
                  >
                    
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl border text-lg font-bold shrink-0 ${badgeClass}`}>
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-slate-900 dark:text-white font-bold leading-tight mb-1">{lesson.title || t(`lesson${lesson.id}_title`)}</h3>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                        {icon} <span className="ml-1 opacity-80">{t(`status_${status}`)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden border border-slate-200 dark:border-dark-800">
                        <div className={`h-full ${barClass} transition-all duration-1000 relative overflow-hidden`} style={{ width: `${progressW}%`}}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:ml-4 sm:min-w-[80px] text-right">
                      {status === 'locked' ? (
                        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-dark-800 px-3 py-1.5 rounded-lg text-slate-400 dark:text-slate-500 text-sm font-bold border border-slate-200 dark:border-dark-700">
                          <Lock size={14} /> --
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold border ${badgeClass}`}>
                          {score}%
                        </div>
                      )}
                    </div>

                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side - Achievements */}
          <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700/50 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl h-fit sticky top-24 transition-colors">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🏆</span> {t('achievements_title')}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center aspect-square ${
                    ach.unlocked 
                      ? 'bg-gradient-to-br from-yellow-500/5 to-orange-500/5 dark:from-yellow-500/10 dark:to-orange-500/10 border-yellow-500/20 dark:border-yellow-500/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,215,0,0.1)] shadow-sm dark:shadow-inner' 
                      : 'bg-slate-50 dark:bg-dark-900/50 border-slate-200 dark:border-dark-700 border-dashed opacity-60 hover:opacity-100 mix-blend-luminosity'
                  }`}
                  title={ach.req}
                >
                  <div className={`text-4xl mb-3 drop-shadow-md ${!ach.unlocked && 'grayscale opacity-50'}`}>
                    {ach.icon}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{ach.name}</div>
                  <div className="text-[0.65rem] uppercase text-slate-500 dark:text-slate-400 font-semibold">{ach.req}</div>
                </div>
              ))}
            </div>

            {/* Quick Action */}
            <div className="mt-8 bg-electric/5 dark:bg-electric/10 border border-electric/10 dark:border-electric/20 rounded-xl p-6 text-center">
              <Target className="mx-auto text-electric mb-2" size={32} />
              <h3 className="text-slate-900 dark:text-white font-bold mb-1">{t('keep_it_up')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('keep_it_up_desc')}</p>
              <Link to="/courses" className="inline-block bg-electric hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors w-full shadow-lg shadow-electric/20">
                {t('resume_course')}
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
