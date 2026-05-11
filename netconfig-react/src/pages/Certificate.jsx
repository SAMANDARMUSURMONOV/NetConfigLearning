import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Award, Printer, Download, ArrowLeft, Star, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import apiService from '../services/api';
import progressService from '../services/progressService';
import reviewService from '../services/reviewService';
import { toast } from 'react-toastify';

const Certificate = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState(reviewService.getReviews());
    const [hasReviewed, setHasReviewed] = useState(reviewService.hasUserReviewed(user?.name));

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const data = await apiService.getLessons();
                // Ensure data is an array
                setLessons(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
                setLessons([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const userProgress = progressService.getUserProgress(user?.uid);
    const totalLessons = lessons.length;
    
    // STRICT CALCULATION: Only count lessons that actually exist in the fetched list
    const masteredCount = lessons.filter(l => !!userProgress[l.id]?.completed).length;
    const percentComplete = totalLessons > 0 ? Math.round((masteredCount / totalLessons) * 100) : 0;
    
    // CERTIFICATE CONDITION: Must have lessons AND all of them must be mastered
    const isCourseCertified = totalLessons > 0 && masteredCount === totalLessons;

    const handlePrint = () => window.print();
    const handleDownload = () => toast.info(t('pdf_notice') || "PDF yuklash tez orada qo'shiladi! 'Chop etish' orqali PDF sifatida saqlashingiz mumkin.");

    const submitReview = (e) => {
        e.preventDefault();
        if (hasReviewed || rating === 0) return;
        const updatedReviews = reviewService.addReview({
            name: user?.name?.toUpperCase() || "TALABA",
            rating,
            comment,
            date: new Date().toISOString()
        });
        setReviews(updatedReviews);
        setHasReviewed(true);
        toast.success(t('review_success') || "Fikringiz uchun rahmat!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">{t('loading_api')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-dark-900 border-x border-slate-200 dark:border-dark-800 pb-20 print:bg-white print:m-0 print:border-none transition-colors">
            <div className="max-w-[900px] mx-auto p-4 sm:p-8 pt-10">
                
                <Link to="/courses" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-electric transition-colors mb-8 font-bold print:hidden bg-white dark:bg-dark-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-700 shadow-sm">
                    <ArrowLeft size={18} /> {t('back_to_courses')}
                </Link>

                {isCourseCertified ? (
                    /* CERTIFICATE VIEW - ONLY VISIBLE IF COMPLETED */
                    <div className="flex flex-col items-center">
                        <div className="bg-white border-[12px] border-double border-blue-600 rounded-lg p-10 sm:p-16 w-full text-center shadow-2xl relative overflow-hidden print:shadow-none mb-10 min-h-[700px] flex flex-col justify-center">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)' }}></div>
                            <div className="relative z-10">
                                <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl border-4 border-white">
                                    <Award size={60} className="text-white" />
                                </div>
                                <h1 className="text-4xl sm:text-6xl font-extrabold text-blue-900 mb-10 uppercase tracking-[0.2em] font-serif leading-tight">{t('cert_title')}</h1>
                                <div className="w-64 h-1.5 bg-blue-600 mx-auto mb-10"></div>
                                <p className="text-xl text-slate-600 italic mb-6 font-serif">{t('cert_subtitle')}</p>
                                <h2 className="text-5xl font-black text-blue-700 mb-10 border-b-2 border-slate-200 inline-block pb-2 px-12">{user?.name}</h2>
                                <p className="text-xl text-slate-700 mb-4 font-medium px-4">{t('cert_body_1')}</p>
                                <h3 className="text-3xl font-black text-slate-900 mb-10 max-w-3xl mx-auto leading-snug">{t('course_title_main')}</h3>
                                <p className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">{t('cert_body_2')}</p>
                                <div className="flex flex-col sm:flex-row justify-between items-end gap-12 px-12 mt-12">
                                    <div className="text-left border-l-4 border-blue-600 pl-4">
                                        <p className="text-sm font-black text-slate-800 mb-1 uppercase tracking-widest">{t('cert_date_label')}</p>
                                        <p className="text-slate-600 font-bold text-lg">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="text-center w-64 border-t-2 border-slate-800 pt-4">
                                        <div className="text-4xl text-blue-800 mb-1 font-serif italic">Instructor</div>
                                        <div className="text-xs font-black text-slate-800 uppercase tracking-[0.3em]">{t('course_certification')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center print:hidden mb-16">
                            <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95">
                                <Printer size={22} /> {t('print_cert')}
                            </button>
                            <button onClick={handleDownload} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-green-600/30 hover:scale-105 active:scale-95">
                                <Download size={22} /> {t('download_pdf')}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* PROGRESS VIEW - VISIBLE DURING LEARNING */
                    <div className="flex flex-col items-center">
                        <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-3xl p-6 sm:p-10 w-full max-w-3xl shadow-2xl overflow-hidden mb-12 transition-colors">
                            <h3 className="font-black text-slate-900 dark:text-white text-2xl md:text-3xl mb-10 border-b border-slate-100 dark:border-dark-700 pb-6 transition-colors">
                                {t('progress_to_cert')}
                            </h3>
                            
                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-light">
                                {totalLessons > 0 ? (
                                    lessons.map((lesson) => {
                                        const isPassed = !!userProgress[lesson.id]?.completed;
                                        return (
                                            <div key={lesson.id} className="flex items-center justify-between gap-6 group transition-all pb-4 border-b border-slate-50 dark:border-dark-700/30 last:border-0">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        {isPassed ? (
                                                            <CheckCircle size={26} className="text-green-500 shrink-0" />
                                                        ) : (
                                                            <Circle size={26} className="text-slate-300 dark:text-dark-600 shrink-0" />
                                                        )}
                                                    </div>
                                                    <div className={`font-bold text-lg md:text-xl transition-colors ${isPassed ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`}>
                                                        {t(`lesson${lesson.id}_title`) || lesson.title}
                                                    </div>
                                                </div>
                                                <div className={`text-sm font-black whitespace-nowrap px-4 py-1.5 rounded-full ${
                                                    isPassed 
                                                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                                        : 'bg-slate-100 dark:bg-dark-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-dark-700'
                                                }`}>
                                                    {isPassed ? (t('status_mastered_cert') || "O'zlashtirilgan") : (t('status_pending') || "Kutilmoqda")}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-dark-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-dark-700">
                                        <div className="text-5xl mb-4 opacity-50">📚</div>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">{t('no_lessons_added')}</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">{t('check_back_later')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {totalLessons > 0 && (
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center gap-3 bg-blue-500/5 px-6 py-3 rounded-full border border-blue-500/10">
                                    <span className="text-blue-500 font-black">{percentComplete}%</span>
                                    <div className="w-32 h-2 bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${percentComplete}%` }}></div>
                                    </div>
                                </div>
                                <Link 
                                    to={`/dashboard/lesson/${lessons.find(l => !userProgress[l.id]?.completed)?.id || lessons[0]?.id}`} 
                                    className="bg-electric hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-electric/30 hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
                                >
                                    <PlayCircle size={24} /> {t('resume_learning')}
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Section - Only for certified users */}
                {isCourseCertified && (
                    <div className="border-t border-slate-200 dark:border-dark-800 pt-16 print:hidden">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight flex items-center gap-3">
                            <Award className="text-yellow-500" size={36} />
                            {t('congrats_review_title')}
                        </h2>
                        {/* ... existing reviews logic ... */}
                        <div className="mt-10">
                             {/* Keep review form here */}
                             {!hasReviewed ? (
                                <form onSubmit={submitReview} className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-xl">
                                    <div className="flex gap-4 mb-6">
                                        {[1,2,3,4,5].map(s => (
                                            <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
                                                <Star size={32} className={(hoverRating || rating) >= s ? "fill-yellow-500 text-yellow-500" : "text-slate-300"} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t('comment_placeholder')} className="w-full p-4 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl mb-4 focus:outline-none focus:border-electric" rows="4"></textarea>
                                    <button type="submit" className="bg-electric text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-500 transition-all">{t('submit_review')}</button>
                                </form>
                             ) : (
                                <div className="bg-green-500/10 text-green-500 p-8 rounded-2xl border border-green-500/20 text-center font-bold text-xl">{t('review_success')}</div>
                             )}
                        </div>
                        <div className="mt-12 space-y-6">
                            {reviews.map((rev, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-dark-800/50 p-6 rounded-2xl border border-slate-200 dark:border-dark-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="font-bold text-slate-900 dark:text-white">{rev.name}</div>
                                        <div className="flex items-center gap-1"><span className="text-yellow-500 font-bold">{rev.rating}</span> <Star size={16} className="fill-yellow-500 text-yellow-500" /></div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300">{rev.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificate;
