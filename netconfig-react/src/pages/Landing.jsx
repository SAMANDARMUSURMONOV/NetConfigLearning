import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { defaultVideoLessons } from '../data/coursesData';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { useEffect } from 'react';
import { 
    ShieldCheck, 
    Layers, 
    Cpu, 
    Globe, 
    Database, 
    Server, 
    Shield, 
    Terminal, 
    Award, 
    Zap,
    PlayCircle,
    Star,
    TrendingUp,
    Clock,
    Calendar
} from 'lucide-react';

const Landing = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();

    const [dynamicStats, setDynamicStats] = useState({
        lessons: defaultVideoLessons.length,
        rating: 0,
        reviews: 0,
        weeks: 6,
        hours: 5
    });

    // Har gal render qilinganda localStorage'dan reviewlarni olib ko'rsatish
    const [reviewsData, setReviewsData] = useState(() => reviewService.getReviews());

    useEffect(() => {
        const fetchRealStats = async () => {
            try {
                const lessons = await apiService.getLessons();
                const reviews = reviewService.getReviews();
                
                // Reytingni hisoblash
                const totalRating = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
                const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "5.0";

                // Har bir dars o'rtacha 45 minut deb hisoblasak
                // Haftasiga 5 soatdan shug'ullansa
                const totalHours = Math.ceil((lessons.length * 45) / 60);
                const weeksNeeded = Math.max(1, Math.ceil(totalHours / 5));

                setDynamicStats({
                    lessons: lessons.length,
                    rating: avgRating,
                    reviews: reviews.length,
                    weeks: weeksNeeded,
                    hours: 5 // Haftasiga tavsiya etilgan vaqt
                });
                setReviewsData(reviews);
            } catch (error) {
                console.error("Error fetching landing stats:", error);
            }
        };
        fetchRealStats();
    }, []);

    const getAvatar = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const renderStars = (rating) => {
        const count = Math.round(Number(rating) || 5);
        let str = '';
        for (let i = 0; i < 5; i++) {
            str += (i < count) ? '★' : '☆';
        }
        return str;
    };

    return (
        <div className="page-landing bg-white dark:bg-dark-900 transition-colors duration-300">
            {/* Modern Hero Section */}
            <section className="relative pt-1 pb-16 lg:pt-2 lg:pb-24 overflow-hidden bg-white dark:bg-dark-950 transition-colors">
                {/* Background Decorations */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(to right, #00b4ff 1px, transparent 1px), linear-gradient(to bottom, #00b4ff 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                }}></div>
                
                {/* Subtle Ambient Light */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-electric/10 dark:bg-electric/20 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-400/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        
                        {/* Content Column */}
                        <div className="flex-[1.2] text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-dark-900 shadow-sm border border-slate-200 dark:border-dark-800 text-slate-600 dark:text-slate-300 text-sm font-bold mb-6 animate-in slide-in-from-top-4 duration-700">
                                <span className="flex h-2 w-2 rounded-full bg-electric animate-pulse"></span>
                                {t('landing_badge')}
                            </div>
                            
                            <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black text-brand-cyan tracking-tight leading-[1.1] mb-6 transition-colors animate-in slide-in-from-left-8 duration-1000">
                                {t('landing_title')}
                            </h1>
                            
                            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed transition-colors animate-in slide-in-from-left-12 duration-1000 delay-200">
                                {t('landing_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center lg:justify-start animate-in slide-in-from-bottom-8 duration-1000 delay-500">
                                <Link 
                                    to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} 
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-electric hover:bg-blue-500 text-white text-lg font-bold rounded-2xl tracking-wider transition-all shadow-[0_20px_50px_-15px_rgba(0,180,255,0.4)] hover:shadow-[0_25px_60px_-15px_rgba(0,180,255,0.6)] hover:-translate-y-1 active:scale-95 whitespace-nowrap"
                                >
                                    <span>{isAuthenticated ? (user?.role === 'admin' ? t('nav_admin_panel') : t('nav_student_dashboard')) : t('landing_btn')}</span>
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                
                            </div>
                        </div>
                        
                        {/* Visual Column - Full View Design */}
                        <div className="flex-1 relative w-full max-w-[500px] mx-auto animate-in zoom-in-95 duration-1000 delay-300">
                            <div className="relative group">
                                {/* Soft glow effect around the frame */}
                                <div className="absolute -inset-6 bg-slate-200/30 dark:bg-electric/10 rounded-[3.5rem] blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
                                
                                <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-dark-800 bg-[#f9fbf2] shadow-2xl transition-all duration-700 group-hover:scale-[1.02] aspect-[2/3] flex items-center justify-center">
                                    <video 
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                        className="w-full h-full object-contain"
                                    >
                                        <source src="/videos/landing-animation.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 -mt-16 pb-16 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-effect rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] transition-all">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/50 dark:divide-white/5">
                            <div className="text-center md:px-6 pt-4 md:pt-0 group pulse-on-hover">
                                <div className="text-electric mb-3 flex justify-center group-hover:scale-110 transition-transform"><PlayCircle size={32} strokeWidth={1.5} /></div>
                                <div className="font-black text-3xl text-slate-900 dark:text-white mb-1">{dynamicStats.lessons}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase">{t('stat_lessons')}</div>
                            </div>
                            <div className="text-center md:px-6 pt-4 md:pt-0 group pulse-on-hover">
                                <div className="text-electric mb-3 flex justify-center group-hover:scale-110 transition-transform"><Star size={32} strokeWidth={1.5} /></div>
                                <div className="font-black text-3xl text-slate-900 dark:text-white mb-1">{dynamicStats.rating}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase">{t('stat_reviews')}</div>
                            </div>
                            <div className="text-center md:px-6 pt-4 md:pt-0 group pulse-on-hover">
                                <div className="text-electric mb-3 flex justify-center group-hover:scale-110 transition-transform"><TrendingUp size={32} strokeWidth={1.5} /></div>
                                <div className="font-black text-xl text-slate-900 dark:text-white mb-1 leading-tight">{t('stat_level')}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase">{t('stat_exp')}</div>
                            </div>
                            <div className="text-center md:px-6 pt-4 md:pt-0 group pulse-on-hover">
                                <div className="text-electric mb-3 flex justify-center group-hover:scale-110 transition-transform"><Clock size={32} strokeWidth={1.5} /></div>
                                <div className="font-black text-3xl text-slate-900 dark:text-white mb-1">{dynamicStats.weeks}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase">{t('stat_weeks_complete')}</div>
                            </div>
                            <div className="text-center md:px-6 pt-4 md:pt-0 group pulse-on-hover">
                                <div className="text-electric mb-3 flex justify-center group-hover:scale-110 transition-transform"><Calendar size={32} strokeWidth={1.5} /></div>
                                <div className="font-black text-xl text-slate-900 dark:text-white mb-1 leading-tight">{t('stat_flex')}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase">{t('stat_pace')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About this Specialization Section */}
            <section className="py-24 bg-white dark:bg-dark-950 border-b border-slate-100 dark:border-dark-800 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-electric/10 text-electric text-xs font-black uppercase tracking-widest mb-6">
                                <ShieldCheck size={16} />
                                {t('about_title')}
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                                {t('about_title2')}
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                {t('about_desc1')}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-dark-900 border border-slate-100 dark:border-dark-800 hover:border-electric/30 transition-all group shadow-sm">
                                    <div className="w-14 h-14 rounded-2xl bg-electric/10 text-electric flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Layers size={28} />
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-3 text-xl">{t('what_learn_title')}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t('learn_1')}</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-dark-900 border border-slate-100 dark:border-dark-800 hover:border-electric/30 transition-all group shadow-sm">
                                    <div className="w-14 h-14 rounded-2xl bg-electric/10 text-electric flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Cpu size={28} />
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-3 text-xl">{t('skills_title')}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t('learn_5')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 relative animate-in zoom-in-95 duration-1000">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600" className="w-full h-64 object-cover" alt="Networking" />
                                    </div>
                                    <div className="bg-electric p-8 rounded-[2.5rem] text-white shadow-xl">
                                        <div className="text-4xl font-black mb-2">100%</div>
                                        <div className="text-sm font-bold opacity-80 uppercase tracking-widest">{t('stat_flex')}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-slate-900 dark:bg-dark-800 p-8 rounded-[2.5rem] text-white shadow-xl border border-white/5">
                                        <Zap className="text-electric mb-4" size={32} />
                                        <div className="text-xl font-bold mb-2">CCNA/CCNP</div>
                                        <div className="text-xs font-medium text-slate-400">Industry Standard Knowledge</div>
                                    </div>
                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-dark-800">
                                        <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" className="w-full h-80 object-cover" alt="Server room" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What you will learn - Detailed */}
            <section className="py-24 bg-slate-50 dark:bg-dark-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                            {t('what_learn_title')}
                        </h2>
                        <div className="w-20 h-1.5 bg-electric mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Globe size={28} />, title: t('learn_1') },
                            { icon: <Database size={28} />, title: t('learn_2') },
                            { icon: <Server size={28} />, title: t('learn_3') },
                            { icon: <Shield size={28} />, title: t('learn_4') },
                            { icon: <Terminal size={28} />, title: t('learn_5') },
                            { icon: <Award size={28} />, title: t('inc_4') }
                        ].map((item, i) => (
                            <div key={i} className="group glass-effect p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl dark:hover:shadow-[0_30px_60px_-15px_rgba(0,180,255,0.15)] transition-all hover-lift glow-on-hover pulse-on-hover">
                                <div className="w-16 h-16 rounded-[1.25rem] mb-8 flex items-center justify-center transition-transform group-hover:scale-110 bg-electric/5 text-electric shadow-inner">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-electric transition-colors">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {t('about_desc2').substring(0, 100)}...
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Syllabus Overview Section */}
            <section className="py-24 bg-slate-50 dark:bg-dark-800 relative transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-dark-900 to-transparent h-32 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">{t('syllabus_overview')}</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">{t('syl_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { i: '1', emoji: '📡' },
                            { i: '2', emoji: '📐' },
                            { i: '3', emoji: '🔌' },
                            { i: '4', emoji: '🔀' },
                            { i: '5', emoji: '🛡️' },
                            { i: '6', emoji: '📶' },
                            { i: '7', emoji: '🔍' },
                            { i: '8', emoji: '🎓' }
                        ].map(mod => (
                            <div key={mod.i} className="group glass-effect rounded-2xl p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,180,255,0.1)] hover-lift glow-on-hover">
                                <div className="w-14 h-14 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:bg-electric/20 transition-all duration-300 shadow-inner">{mod.emoji}</div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight transition-colors">{t(`syl_mod${mod.i}_title`)}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{t(`syl_mod${mod.i}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learner Reviews Section */}
            <section className="py-24 bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-800 relative z-20 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">{t('learners_say_title')}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-400">
                                <span className="text-2xl font-black text-slate-900 dark:text-white mr-2 transition-colors">{dynamicStats.rating}</span>
                                <span className="tracking-widest text-xl">{renderStars(dynamicStats.rating)}</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2 transition-colors">({dynamicStats.reviews} {t('stat_reviews')})</span>
                            </div>
                        </div>

                        {isAuthenticated && user?.role !== 'admin' && !reviewService.hasUserReviewed(user?.name) && (
                            <button 
                                onClick={() => {
                                    const comment = prompt(t('leave_review_prompt') || "Kurs haqida fikringizni yozing:");
                                    if (comment) {
                                        const rating = prompt(t('leave_rating_prompt') || "Reytingingiz (1-5):", "5");
                                        if (rating && !isNaN(rating)) {
                                            reviewService.addReview({
                                                name: user.name,
                                                rating: Math.min(5, Math.max(1, parseInt(rating))),
                                                comment: comment,
                                                date: new Date().toISOString()
                                            });
                                            window.location.reload();
                                        }
                                    }
                                }}
                                className="px-6 py-3 bg-electric/10 hover:bg-electric text-electric hover:text-white border border-electric/30 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <span>{t('write_review_btn') || "Fikr qoldirish"}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                        )}
                    </div>
                    
                    <div className="reviews-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviewsData.slice(0, 3).map((r, idx) => {
                            const colors = ['bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-electric'];
                            const avatarColor = colors[idx % colors.length];
                            return (
                                <div key={idx} className="glass-effect rounded-2xl p-8 relative mt-6 hover:border-electric/30 transition-all group shadow-sm hover-lift glow-on-hover">
                                    <div className={`absolute -top-6 left-8 w-14 h-14 ${avatarColor} text-white font-bold text-xl rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-dark-900 group-hover:scale-110 transition-transform`}>
                                        {getAvatar(r.name || 'Anonymous')}
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <strong className="text-lg text-slate-900 dark:text-white transition-colors">{r.name || 'Anonymous'}</strong>
                                            <div className="text-yellow-400 tracking-widest text-lg">{renderStars(r.rating)}</div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 italic transition-colors">"{r.comment}"</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us & FAQ */}
            <section className="py-24 bg-white dark:bg-dark-800 border-t border-slate-100 dark:border-dark-700 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 transition-colors">{t('why_title')}</h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 text-electric transition-colors">🚀</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors">{t('why_1_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t('why_1_desc')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 text-electric transition-colors">🛠️</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors">{t('why_2_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t('why_2_desc')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 text-electric transition-colors">🌐</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors">{t('why_3_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t('why_3_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 transition-colors">{t('faq_title')}</h2>
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-dark-900/50 p-6 rounded-xl border-l-4 border-l-electric transition-colors">
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 transition-colors">{t('faq_1_q')}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{t('faq_1_a')}</p>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-dark-900/50 p-6 rounded-xl border-l-4 border-l-slate-300 dark:border-l-dark-600 hover:border-l-electric transition-all">
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 transition-colors">{t('faq_2_q')}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{t('faq_2_a')}</p>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-dark-900/50 p-6 rounded-xl border-l-4 border-l-slate-300 dark:border-l-dark-600 hover:border-l-electric transition-all">
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 transition-colors">{t('faq_3_q')}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{t('faq_3_a')}</p>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-dark-900/50 p-6 rounded-xl border-l-4 border-l-slate-300 dark:border-l-dark-600 hover:border-l-electric transition-all">
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 transition-colors">{t('faq_4_q')}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{t('faq_4_a')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Landing;
