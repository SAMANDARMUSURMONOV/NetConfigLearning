import React, { useState, useEffect } from 'react';
import { defaultVideoLessons } from '../../data/coursesData';
import { 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AdminOverview = () => {
    const { t } = useTranslation();
    const { getIdToken } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLessons: 0,
        totalCertificates: 0,
        completionRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7);
    const [chartData, setChartData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [allCerts, setAllCerts] = useState([]);

    useEffect(() => {
        const realChartData = [];
        const today = new Date();
        today.setHours(0,0,0,0);
        
        for (let i = timeRange - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            
            const enrolledCount = allUsers.filter(u => {
                if (!u.metadata?.creationTime) return false;
                const uDate = new Date(u.metadata.creationTime);
                return uDate.toDateString() === d.toDateString();
            }).length;
            
            const dayName = timeRange === 30 ? d.getDate() : d.toLocaleDateString('en-US', { weekday: 'short' });
            
            realChartData.push({
                name: dayName,
                users: enrolledCount,
                completions: 0
            });
        }
        setChartData(realChartData);
    }, [timeRange, allUsers]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = await getIdToken();
            
            // Fetch real data simultaneously from the backend
            const [users, lessons, certs] = await Promise.all([
                apiService.getUsers(token).catch(() => []),
                apiService.getLessons().catch(() => []),
                apiService.getCertificates(token).catch(() => [])
            ]);

            // Calculate real completion rate
            // formula: (users who have at least one certificate / total users) * 100
            const uniqueUsersWithCerts = new Set(certs.map(c => c.userId)).size;
            const calculatedCompletion = users.length > 0 
                ? Math.round((uniqueUsersWithCerts / users.length) * 100) 
                : 0;

            setStats({
                totalUsers: users.length,
                totalLessons: lessons.length,
                totalCertificates: certs.length,
                completionRate: calculatedCompletion
            });
            
            setAllUsers(users);
            setAllLessons(lessons);
            setAllCerts(certs);
            
            // "Darhol Yangilash" uchun toast (faqat qo'lda bosilganda chiqadi)
            if (loading === false) {
                toast.info(t('admin_refresh_success') || "Ma'lumotlar yangilandi!");
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
            toast.error(t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [getIdToken]);

    const handleDownloadReport = () => {
        const headers = ["Metrika", "Qiymat"];
        const rows = [
            ["--- UMUMIY STATISTIKA ---", ""],
            [t('admin_total_students'), stats.totalUsers],
            [t('admin_total_lessons'), stats.totalLessons],
            [t('admin_certificates'), stats.totalCertificates],
            [t('admin_completion_rate'), `${stats.completionRate}%`],
            ["", ""],
            ["--- DARSLAR KESIMIDA ---", ""],
            ["Dars Nomi", "O'zlashtirish (%)"]
        ];

        allLessons.forEach(lesson => {
            const lessonCerts = allCerts.filter(c => c.lessonId === lesson.id || c.lessonId === String(lesson.id)).length;
            const lessonProgress = allUsers.length > 0 
                ? Math.round((lessonCerts / allUsers.length) * 100) 
                : 0;
            rows.push([lesson.title, `${lessonProgress}%`]);
        });
        
        const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `NetConfig_Hisobot_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Hisobot tayyor bo'ldi!");
    };

    const calculateTrend = (data, dateField) => {
        if (!data || data.length === 0) return '0%';
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const currentPeriodCount = data.filter(item => {
            const date = new Date(item.metadata?.creationTime || item.createdAt || item.date || item.timestamp);
            return date >= sevenDaysAgo;
        }).length;

        const previousPeriodCount = data.filter(item => {
            const date = new Date(item.metadata?.creationTime || item.createdAt || item.date || item.timestamp);
            return date >= fourteenDaysAgo && date < sevenDaysAgo;
        }).length;

        if (previousPeriodCount === 0) return currentPeriodCount > 0 ? `+${currentPeriodCount}` : '0%';
        const diff = ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
        const result = Math.round(diff);
        return (result >= 0 ? '+' : '') + result + '%';
    };

    const statsCards = [
        { title: t('admin_total_students'), value: stats.totalUsers, trend: calculateTrend(allUsers, 'metadata.creationTime'), icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', cardBg: 'bg-blue-50/30 dark:bg-blue-900/10' },
        { title: t('admin_total_lessons'), value: stats.totalLessons, trend: calculateTrend(allLessons, 'createdAt'), icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', cardBg: 'bg-emerald-50/30 dark:bg-emerald-900/10' },
        { title: t('admin_certificates'), value: stats.totalCertificates, trend: calculateTrend(allCerts, 'createdAt'), icon: Star, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', cardBg: 'bg-amber-50/30 dark:bg-amber-900/10' },
        { title: t('admin_completion_rate'), value: `${stats.completionRate}%`, trend: '+0%', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', cardBg: 'bg-purple-50/30 dark:bg-purple-900/10' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><TrendingUp size={32} /></span>
                        {t('admin_overview_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_overview_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleDownloadReport}
                        className="px-5 py-2.5 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span>{t('admin_download_report')}</span>
                    </button>
                    <button 
                        onClick={fetchDashboardData}
                        className="px-5 py-2.5 bg-brand-cyan rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-cyan/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Zap size={16} />
                        <span>{t('admin_instant_refresh')}</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, i) => (
                    <div key={i} className={`glass-effect group relative p-6 rounded-[2.5rem] border-2 border-slate-200 dark:border-dark-700 shadow-lg hover:shadow-2xl hover:border-brand-cyan/50 transition-all overflow-hidden ${card.cardBg}`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg.replace('/30', '/5')} blur-3xl group-hover:blur-2xl transition-all`}></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-16 h-16 rounded-[1.5rem] ${card.bg} ${card.color} flex items-center justify-center shadow-xl border border-white/50 dark:border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                                    <card.icon size={32} />
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black ${card.trend.startsWith('-') ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    <span>{card.trend}</span>
                                    <ArrowUpRight size={12} className={card.trend.startsWith('-') ? 'rotate-90' : ''} />
                                </div>
                            </div>
                            <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mb-1">{card.title}</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {loading ? <span className="animate-pulse">...</span> : card.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* User Growth Chart */}
                <div className="lg:col-span-2 glass-effect relative overflow-hidden rounded-[2.5rem] border-2 border-slate-200 dark:border-dark-700 p-8 shadow-xl bg-brand-cyan/[0.02] dark:bg-brand-cyan/[0.01]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('admin_enrollment_rate')}</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">{t('admin_activity_dynamics')}</p>
                        </div>
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(Number(e.target.value))}
                            className="bg-white/50 dark:bg-dark-900/50 backdrop-blur-md border border-slate-200 dark:border-dark-600 rounded-xl px-4 py-2 text-xs font-black text-slate-700 dark:text-slate-300 outline-none focus:border-brand-cyan transition-all cursor-pointer shadow-sm"
                        >
                            <option value={7}>{t('admin_last_7_days')}</option>
                            <option value={30}>{t('admin_last_30_days')}</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        {!loading && chartData.length > 0 && (
                            <ResponsiveContainer width="99%" height={350}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1de9b6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#1de9b6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                                    <XAxis dataKey="name" stroke="#718096" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#718096" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                                            backdropFilter: 'blur(8px)',
                                            border: document.documentElement.classList.contains('dark') ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', 
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#1de9b6', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                        labelStyle={{ color: document.documentElement.classList.contains('dark') ? '#fff' : '#000', fontWeight: '900', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#1de9b6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Completion Status */}
                <div className="glass-effect relative overflow-hidden rounded-[2.5rem] border-2 border-slate-200 dark:border-dark-700 p-8 shadow-xl bg-brand-cyan/[0.01] flex flex-col justify-between">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-cyan/5 blur-[80px] rounded-full -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('admin_lesson_completions')}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-8">{t('admin_lesson_stats_desc')}</p>
                        
                        <div className="space-y-6">
                            {allLessons.slice(0, 5).map((lesson, index) => {
                                const lessonCerts = allCerts.filter(c => c.lessonId === lesson.id || c.lessonId === String(lesson.id)).length;
                                const lessonProgress = allUsers.length > 0 
                                    ? Math.round((lessonCerts / allUsers.length) * 100) 
                                    : 0;
                                
                                return (
                                    <div key={lesson.id || index} className="group/item">
                                        <div className="flex justify-between text-xs mb-2 px-1">
                                            <span className="text-slate-700 dark:text-slate-300 font-black truncate pr-4 group-hover/item:text-brand-cyan transition-colors">{lesson.title}</span>
                                            <span className="text-brand-cyan font-black">{lessonProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100/50 dark:bg-dark-900/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-dark-700/50 shadow-inner">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(29,233,182,0.3)]" 
                                                style={{ width: `${lessonProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => window.location.href = '/admin/courses'}
                        className="relative z-10 w-full mt-8 py-4 bg-white/50 dark:bg-dark-900/50 backdrop-blur-md border border-slate-200 dark:border-dark-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group shadow-sm"
                    >
                        <span>{t('admin_view_all_details')}</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>

        </div>
    );
};

export default AdminOverview;
