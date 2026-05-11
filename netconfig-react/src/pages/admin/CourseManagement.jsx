import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Clock, 
  Trash2, 
  Edit, 
  Play, 
  MoreVertical,
  Layers,
  ArrowUpRight,
  UploadCloud,
  Loader2,
  Check,
  FileText
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CourseManagement = () => {
    const { t } = useTranslation();
    const { user, getIdToken } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [thumbUploading, setThumbUploading] = useState(false);
    const [thumbProgress, setThumbProgress] = useState(0);
    const [lectureUploading, setLectureUploading] = useState(false);
    const [lectureProgress, setLectureProgress] = useState(0);
    const [videoSourceType, setVideoSourceType] = useState('url'); // 'url' or 'file'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        videoUrl: '',
        thumbnail: '',
        lectureNote: '',
        duration: ''
    });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const data = await apiService.getLessons();
            setLessons(data);
        } catch (err) {
            console.error("Course fetch error:", err);
            toast.error(t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson);
            setFormData({
                title: lesson.title || '',
                description: lesson.description || '',
                level: lesson.level || 'Beginner',
                videoUrl: lesson.videoUrl || '',
                thumbnail: lesson.thumbnail || '',
                lectureNote: lesson.lectureNote || '',
                duration: lesson.duration || ''
            });
        } else {
            setEditingLesson(null);
            setFormData({
                title: '',
                description: '',
                level: 'Beginner',
                videoUrl: '',
                thumbnail: '',
                lectureNote: '',
                duration: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin_lesson_delete_confirm'))) return;
        
        try {
            const token = await getIdToken();
            await apiService.deleteLesson(id, token);
            toast.success(t('admin_delete_success'));
            fetchLessons();
        } catch (err) {
            toast.error(t('admin_delete_error'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getIdToken();
            if (editingLesson) {
                await apiService.updateLesson(editingLesson.id, formData, token);
                toast.success(t('admin_lesson_save_success'));
            } else {
                await apiService.createLesson(formData, token);
                toast.success(t('admin_lesson_create_success'));
            }
            setIsModalOpen(false);
            fetchLessons();
        } catch (err) {
            toast.error(t('admin_create_error'));
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast.error(t('admin_upload_video_only') || 'Faqat video fayllarni yuklash mumkin');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const token = await getIdToken();
            const result = await apiService.uploadFile(
                '/lessons/upload', 
                file, 
                token, 
                'video',
                (progress) => setUploadProgress(progress)
            );
            
            setUploadProgress(100);
            
            setTimeout(() => {
                setFormData(prev => ({ ...prev, videoUrl: result.videoUrl }));
                setUploading(false);
                setUploadProgress(0);
                toast.success(t('admin_upload_success'));
            }, 500);

        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.message || t('admin_upload_error'));
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Faqat rasm fayllarini yuklash mumkin');
            return;
        }

        setThumbUploading(true);
        setThumbProgress(0);

        try {
            const token = await getIdToken();
            const result = await apiService.uploadFile(
                '/lessons/upload-thumbnail', 
                file, 
                token, 
                'thumbnail',
                (progress) => setThumbProgress(progress)
            );
            
            setThumbProgress(100);
            setTimeout(() => {
                setFormData(prev => ({ ...prev, thumbnail: result.fileUrl }));
                setThumbUploading(false);
                setThumbProgress(0);
                toast.success('Muqova yuklandi');
            }, 500);

        } catch (error) {
            console.error("Thumb upload error:", error);
            toast.error('Muqova yuklashda xatolik');
            setThumbUploading(false);
            setThumbProgress(0);
        }
    };

    const handleLectureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLectureUploading(true);
        setLectureProgress(0);

        try {
            const token = await getIdToken();
            const result = await apiService.uploadFile(
                '/lessons/upload-lecture', 
                file, 
                token, 
                'lectureNote',
                (progress) => setLectureProgress(progress)
            );
            
            setLectureProgress(100);
            setTimeout(() => {
                setFormData(prev => ({ ...prev, lectureNote: result.fileUrl }));
                setLectureUploading(false);
                setLectureProgress(0);
                toast.success(t('admin_upload_success'));
            }, 500);

        } catch (error) {
            console.error("Lecture upload error:", error);
            toast.error(t('admin_upload_error'));
            setLectureUploading(false);
            setLectureProgress(0);
        }
    };


    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><BookOpen size={32} /></span>
                        {t('admin_course_mgmt_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_course_mgmt_subtitle')}</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3.5 bg-brand-cyan rounded-2xl text-sm font-bold text-white shadow-xl shadow-brand-cyan/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span>{t('admin_create_course')}</span>
                </button>
            </div>

            {/* Courses Grid / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="bg-slate-100 dark:bg-dark-800 h-64 rounded-3xl animate-pulse border border-slate-200 dark:border-dark-700"></div>
                    ))
                ) : (
                    lessons.map((lesson, index) => (
                        <div key={lesson.id} className="glass-effect overflow-hidden rounded-[2.5rem] border-2 border-slate-200 dark:border-dark-700 shadow-lg hover:shadow-2xl hover:border-brand-cyan/50 transition-all group flex flex-col h-full relative bg-brand-cyan/[0.03] dark:bg-brand-cyan/[0.02]">
                            
                            {/* Thumbnail */}
                            <div className="h-48 relative overflow-hidden shrink-0">
                                <Link to={`/dashboard/lesson/${lesson.id}`}>
                                    <img 
                                        src={lesson.thumbnail || "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600"} 
                                        alt={lesson.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-dark-900/90 to-transparent"></div>
                                </Link>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(lesson)}
                                        className="p-2 bg-white/60 dark:bg-dark-900/60 backdrop-blur-md rounded-xl text-slate-900 dark:text-white hover:bg-brand-cyan hover:text-white transition-all shadow-xl"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(lesson.id)}
                                        className="p-2 bg-white/60 dark:bg-dark-900/60 backdrop-blur-md rounded-xl text-slate-900 dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-brand-cyan rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                                        {lesson.level === 'Beginner' ? t('beginner') : lesson.level === 'Intermediate' ? t('intermediate') : lesson.level}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <Link to={`/dashboard/lesson/${lesson.id}`} className="hover:text-brand-cyan transition-colors">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 hover:text-brand-cyan">
                                        {lesson.title || t(`lesson${lesson.id}_title`)}
                                    </h3>
                                </Link>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium line-clamp-2 leading-relaxed">
                                    {lesson.description || 'No description available for this networking module.'}
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-dark-700/50 flex items-center justify-between">
                                    <Link to={`/dashboard/lesson/${lesson.id}`} className="flex items-center gap-4 group/btn">
                                        <div className="flex items-center gap-2 text-brand-cyan group-hover/btn:text-blue-500 transition-colors">
                                            <Play size={16} />
                                            <span className="text-xs font-black uppercase tracking-wider">{t('lesson') || 'Lesson'} {index + 1}</span>
                                        </div>
                                        {lesson.duration && (
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pl-4 border-l border-slate-100 dark:border-dark-700">
                                                <Clock size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">{lesson.duration}</span>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            to={`/dashboard/lesson/${lesson.id}`}
                                            className="w-8 h-8 rounded-full bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan hover:text-white flex items-center justify-center transition-all"
                                        >
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            

                        </div>
                    ))
                )}

                {/* Empty State / Add Blank */}
                {!loading && (
                    <button 
                        onClick={() => handleOpenModal()}
                        className="border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-dark-800 text-slate-400 dark:text-slate-500 flex items-center justify-center group-hover:text-brand-cyan group-hover:scale-110 transition-all shadow-sm dark:shadow-xl">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{t('admin_create_course')}</h4>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">{t('admin_course_mgmt_subtitle')}</p>
                        </div>
                    </button>
                )}

            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm transition-all" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 transition-colors">
                        <div className="p-8 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/20">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingLesson ? t('admin_edit_lesson') : t('admin_create_course')}</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">{t('admin_course_mgmt_subtitle')}</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-0 flex flex-col max-h-[calc(90vh-100px)] overflow-hidden">
                            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 pb-12">
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">{t('admin_lesson_title')}</label>
                                            <input 
                                                type="text" required 
                                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-cyan transition-all outline-none shadow-inner"
                                                placeholder={t('admin_lesson_title')}
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">{t('admin_lesson_level')}</label>
                                                <div className="relative">
                                                    <select 
                                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-cyan outline-none cursor-pointer appearance-none shadow-inner transition-colors"
                                                        value={formData.level}
                                                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                                                    >
                                                        <option value="Beginner">{t('beginner')}</option>
                                                        <option value="Intermediate">{t('intermediate')}</option>
                                                        <option value="Advanced">{t('advanced')}</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                                                        <MoreVertical size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Duration</label>
                                                <input 
                                                    type="text" placeholder="e.g. 15:00"
                                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-cyan outline-none shadow-inner"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">{t('admin_lesson_desc')}</label>
                                            <textarea 
                                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-cyan outline-none shadow-inner resize-none"
                                                rows="3"
                                                placeholder={t('admin_lesson_desc')}
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Thumbnail Section */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Dars Muqovasi (Rasm)</label>
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="w-full md:w-48 h-32 bg-slate-100 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700/50 rounded-2xl overflow-hidden relative group/thumb shrink-0 transition-colors">
                                                {formData.thumbnail ? (
                                                    <img 
                                                        src={formData.thumbnail} 
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                                                        <Plus size={32} />
                                                    </div>
                                                )}
                                                {thumbUploading && (
                                                    <div className="absolute inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden">
                                                            <div className="h-full bg-brand-cyan transition-all" style={{ width: `${thumbProgress}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div>
                                                    <input 
                                                        type="text"
                                                        placeholder="Rasm URL manzili... (masalan, .jpg yoki .png bilan tugaydigan)"
                                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-cyan outline-none shadow-inner"
                                                        value={formData.thumbnail}
                                                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                                    />
                                                    <p className="text-[9px] text-slate-400 mt-1.5 ml-1 font-medium italic">
                                                        * Iltimos, rasmning to'g'ridan-to'g'ri havolasidan foydalaning (masalan: rasm.uz/img.jpg)
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input type="file" id="thumb-upload" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                                    <label htmlFor="thumb-upload" className="px-5 py-2.5 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-700 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2">
                                                        <UploadCloud size={14} />
                                                        Rasm Yuklash
                                                    </label>
                                                    {formData.thumbnail && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setFormData({...formData, thumbnail: ''})}
                                                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                                        >
                                                            O'chirish
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Upload Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('admin_lesson_video')}</label>
                                            <div className="flex bg-slate-100 dark:bg-dark-950 p-1 rounded-xl border border-slate-200 dark:border-dark-700/50 transition-colors">
                                                <button 
                                                    type="button"
                                                    onClick={() => setVideoSourceType('url')}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${videoSourceType === 'url' ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/20' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                                >
                                                    {t('admin_video_type_url')}
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setVideoSourceType('file')}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${videoSourceType === 'file' ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/20' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                                >
                                                    {t('admin_video_type_file')}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700/50 rounded-3xl p-6 relative overflow-hidden group/video min-h-[140px] flex flex-col justify-center transition-colors">
                                            {videoSourceType === 'url' ? (
                                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 shrink-0">
                                                            <Play size={24} fill="currentColor" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <input 
                                                                type="text"
                                                                className="w-full bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 outline-none p-0 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                                placeholder="https://youtube.com/watch?v=..."
                                                                value={formData.videoUrl}
                                                                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                                            />
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t('admin_video_url_label')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <input 
                                                        type="file" id="video-upload" className="hidden" 
                                                        accept="video/*" onChange={handleFileUpload} disabled={uploading}
                                                    />
                                                    
                                                    {uploading ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between mb-1 px-1">
                                                                <span className="text-xs font-black text-brand-cyan uppercase tracking-widest">{t('admin_uploading_btn')}</span>
                                                                <span className="text-xs font-black text-slate-900 dark:text-white">{Math.round(uploadProgress)}%</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden border border-slate-200 dark:border-dark-700/50 shadow-inner">
                                                                <div 
                                                                    className="h-full bg-gradient-to-r from-brand-cyan to-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(29,233,182,0.4)]"
                                                                    style={{ width: `${uploadProgress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ) : formData.videoUrl && (formData.videoUrl.includes('storage') || formData.videoUrl.includes('uploads')) ? (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                                                                    <Check size={24} strokeWidth={3} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-900 dark:text-white font-bold">{t('admin_file_ready')}</p>
                                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider truncate max-w-[200px]">{formData.videoUrl.split('/').pop()}</p>
                                                                </div>
                                                            </div>
                                                            <label htmlFor="video-upload" className="px-4 py-2 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-700 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                                                                Re-upload
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <label htmlFor="video-upload" className="flex flex-col items-center justify-center gap-3 cursor-pointer py-2 group/btn">
                                                            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center border border-brand-cyan/20 group-hover/btn:scale-110 group-hover/btn:bg-brand-cyan group-hover/btn:text-white transition-all duration-300">
                                                                <UploadCloud size={24} />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors">{t('admin_video_file_label')}</span>
                                                        </label>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Lecture Note Section */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Maruza Matni (PDF/DOCX)</label>
                                        <div className="bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700/50 rounded-3xl p-6 transition-colors">
                                            {lectureUploading ? (
                                                <div className="space-y-4 py-2">
                                                    <div className="flex items-center justify-between mb-1 px-1">
                                                        <span className="text-xs font-black text-brand-cyan uppercase tracking-widest">{t('admin_uploading_btn')}</span>
                                                        <span className="text-xs font-black text-slate-900 dark:text-white">{Math.round(lectureProgress)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-cyan transition-all" style={{ width: `${lectureProgress}%` }}></div>
                                                    </div>
                                                </div>
                                            ) : formData.lectureNote ? (
                                                <div className="flex items-center justify-between animate-in fade-in duration-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-brand-cyan/10 rounded-2xl flex items-center justify-center text-brand-cyan shadow-inner">
                                                            <FileText size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-900 dark:text-white font-bold">Maruza matni yuklangan</p>
                                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider truncate max-w-[200px]">{formData.lectureNote.split('/').pop()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input type="file" id="lecture-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleLectureUpload} />
                                                        <label htmlFor="lecture-upload" className="text-[10px] font-black text-electric uppercase tracking-widest hover:underline cursor-pointer">
                                                            Almashtirish
                                                        </label>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setFormData({...formData, lectureNote: ''})}
                                                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                                        >
                                                            O'chirish
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="animate-in fade-in duration-300">
                                                    <input type="file" id="lecture-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleLectureUpload} />
                                                    <label htmlFor="lecture-upload" className="flex flex-col items-center justify-center gap-3 cursor-pointer py-2 group/btn">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-dark-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-dark-700/50 group-hover/btn:scale-110 group-hover/btn:bg-brand-cyan group-hover/btn:text-white transition-all duration-300">
                                                            <FileText size={24} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Faylni tanlash (PDF, DOCX)</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="p-8 border-t border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/30 flex gap-4 backdrop-blur-md transition-colors">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-dark-900 text-slate-500 font-black uppercase tracking-widest text-[11px] rounded-2xl border border-slate-200 dark:border-dark-700/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-all opacity-80"
                                >
                                    {t('admin_cancel')}
                                </button>
                                <button 
                                    type="submit"
                                    disabled={uploading}
                                    className={`flex-1 py-4 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl transition-all ${
                                        uploading 
                                        ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-50' 
                                        : 'bg-brand-cyan shadow-brand-cyan/25 hover:scale-[1.02] active:scale-95'
                                    }`}
                                >
                                    {editingLesson ? t('save_changes') : t('admin_create_course')}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default CourseManagement;
