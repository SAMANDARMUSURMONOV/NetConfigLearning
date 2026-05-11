import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  Clock, 
  ChevronRight,
  Eye,
  Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const Library = () => {
    const { t } = useTranslation();
    const { loading: authLoading } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const data = await apiService.getLessons();
                // Only show lessons that have lecture notes
                setLessons(data.filter(lesson => lesson.lectureNote));
            } catch (err) {
                console.error("Library fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchLessons();
        }
    }, [authLoading]);

    const filteredLessons = lessons.filter(lesson => {
        return lesson.title.toLowerCase().includes(search.toLowerCase());
    });

    const handleDownload = (url, title) => {
        const extension = url.split('.').pop();
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}_lecture_note.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-dark-950 p-8 md:p-12 shadow-xl border border-emerald-100 dark:border-dark-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-black uppercase tracking-wider mb-4">
                            <BookOpen size={14} />
                            {t('library_resource_center')}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('library_title')} <span className="text-brand-cyan">{t('library_subtitle')}</span>
                        </h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium text-lg max-w-xl">
                            {t('library_description')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[280px]">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-cyan transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder={t('library_search_placeholder')}
                                className="w-full bg-white dark:bg-white/5 border border-emerald-100 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white focus:bg-white focus:border-brand-cyan transition-all outline-none shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Title */}
            <div className="flex items-center gap-4">
                <div className="px-6 py-3.5 bg-brand-cyan text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-cyan/25 flex items-center gap-3">
                    <FileText size={18} />
                    {t('library_lecture_notes')}
                </div>
                <div className="h-px flex-1 bg-slate-200 dark:bg-dark-800"></div>
            </div>

            {/* Resources Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-dark-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredLessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLessons.map((lesson) => (
                        <div 
                            key={lesson.id} 
                            className="glass-effect group relative rounded-3xl border border-slate-200 dark:border-dark-700/50 p-5 transition-all hover:shadow-xl overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 blur-2xl group-hover:bg-brand-cyan/10 transition-colors"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-dark-900 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        DOCX / PDF
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-cyan transition-colors">
                                    {lesson.title}
                                </h3>
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-5 line-clamp-2 leading-tight flex-1">
                                    {lesson.description || t('library_default_desc')}
                                </p>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-dark-800">
                                    <button 
                                        onClick={() => handleDownload(lesson.lectureNote, lesson.title)}
                                        className="flex-1 bg-brand-cyan hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-brand-cyan/10"
                                    >
                                        <Download size={14} />
                                        {t('library_download')}
                                    </button>
                                    <a 
                                        href={lesson.lectureNote} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-xl hover:text-brand-cyan hover:border-brand-cyan transition-all"
                                        title={t('library_view')}
                                    >
                                        <Eye size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center glass-effect rounded-[3rem] border border-dashed border-slate-300 dark:border-dark-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-dark-900 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
                        <Search size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('library_no_results')}</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm">
                        {t('library_no_results_desc')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Library;
