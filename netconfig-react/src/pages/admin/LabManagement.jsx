import React, { useState, useEffect } from 'react';
import { 
  FlaskConical,
  UploadCloud,
  Loader2,
  Check,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  BookOpen,
  Layers,
  FileCode
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const LabManagement = () => {
    const { t } = useTranslation();
    const { user, getIdToken } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [labUploading, setLabUploading] = useState(false);
    const [labProgress, setLabProgress] = useState(0);

    const [formData, setFormData] = useState({
        lessonId: '',
        title: '',
        description: '',
        downloadUrl: ''
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
            console.error("Fetch error:", err);
            toast.error(t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson);
            setFormData({
                lessonId: lesson.id,
                title: lesson.labWork?.title || '',
                description: lesson.labWork?.description || '',
                downloadUrl: lesson.labWork?.downloadUrl || ''
            });
        } else {
            setEditingLesson(null);
            setFormData({
                lessonId: '',
                title: '',
                description: '',
                downloadUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleLabUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLabUploading(true);
        setLabProgress(0);

        try {
            const token = await getIdToken();
            const result = await apiService.uploadFile(
                '/lessons/upload-file', 
                file, 
                token, 
                'file',
                (progress) => setLabProgress(progress)
            );
            
            setLabProgress(100);
            setTimeout(() => {
                setFormData(prev => ({ ...prev, downloadUrl: result.fileUrl }));
                setLabUploading(false);
                setLabProgress(0);
                toast.success(t('admin_upload_success'));
            }, 500);

        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.message || t('admin_upload_error'));
            setLabUploading(false);
            setLabProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.lessonId) {
            toast.error("Iltimos, darsni tanlang");
            return;
        }

        try {
            const token = await getIdToken();
            const lessonToUpdate = lessons.find(l => l.id === formData.lessonId);
            
            const updatedLesson = {
                ...lessonToUpdate,
                labWork: {
                    title: formData.title,
                    description: formData.description,
                    downloadUrl: formData.downloadUrl
                }
            };

            await apiService.updateLesson(formData.lessonId, updatedLesson, token);
            toast.success("Laboratoriya muvaffaqiyatli saqlandi");
            setIsModalOpen(false);
            fetchLessons();
        } catch (err) {
            toast.error("Saqlashda xatolik yuz berdi");
        }
    };

    const handleDeleteLab = async (lesson) => {
        if (!window.confirm("Laboratoriya topshirig'ini o'chirmoqchimisiz?")) return;

        try {
            const token = await getIdToken();
            const updatedLesson = {
                ...lesson,
                labWork: null
            };
            await apiService.updateLesson(lesson.id, updatedLesson, token);
            toast.success("Laboratoriya o'chirildi");
            fetchLessons();
        } catch (err) {
            toast.error("O'chirishda xatolik");
        }
    };

    const lessonsWithLabs = lessons.filter(l => l.labWork && l.labWork.downloadUrl);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><FlaskConical size={32} /></span>
                        {t('admin_lab_mgmt_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_lab_mgmt_subtitle')}</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3.5 bg-brand-cyan rounded-2xl text-sm font-bold text-white shadow-xl shadow-brand-cyan/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span>Yangi Lab Biriktirish</span>
                </button>
            </div>

            {/* Labs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="bg-slate-100 dark:bg-dark-800 h-48 rounded-3xl animate-pulse border border-slate-200 dark:border-dark-700"></div>
                    ))
                ) : lessonsWithLabs.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-effect rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-dark-700/50 transition-all group">
                        <FileCode size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4 group-hover:scale-110 group-hover:text-brand-cyan transition-all" />
                        <p className="text-slate-500 dark:text-slate-400 font-bold">Hozircha laboratoriya topshiriqlari yo'q</p>
                        <button onClick={() => handleOpenModal()} className="mt-4 text-brand-cyan font-black uppercase text-xs tracking-widest hover:underline">
                            Birinchi labni qo'shish
                        </button>
                    </div>
                ) : (
                    lessonsWithLabs.map((lesson) => (
                        <div key={lesson.id} className="glass-effect overflow-hidden rounded-[2rem] border border-slate-200 dark:border-dark-700/50 p-5 shadow-sm hover:shadow-2xl hover:border-brand-cyan/40 transition-all group relative flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center text-brand-cyan shadow-inner">
                                    <FileCode size={20} />
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => handleOpenModal(lesson)} className="p-1.5 bg-slate-100 dark:bg-dark-900/60 rounded-lg text-slate-600 dark:text-white hover:bg-brand-cyan hover:text-white transition-all shadow-sm">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteLab(lesson)} className="p-1.5 bg-slate-100 dark:bg-dark-900/60 rounded-lg text-slate-600 dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{lesson.labWork.title}</h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-3">
                                <BookOpen size={10} />
                                <span className="truncate">Dars: {lesson.title}</span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                                {lesson.labWork.description || "Tavsif berilmagan"}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-dark-700/50">
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">.PKA FAYL</span>
                                <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase">
                                    Tayyor <Check size={12} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm transition-all" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 transition-colors">
                        <div className="p-6 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/20">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">{editingLesson ? "Labni Tahrirlash" : "Yangi Lab Qo'shish"}</h2>
                            <p className="text-slate-500 text-xs font-medium mt-1">Darsga laboratoriya topshirig'ini biriktiring</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Darsni Tanlang</label>
                                <select 
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl px-5 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-cyan outline-none appearance-none cursor-pointer transition-colors"
                                    value={formData.lessonId}
                                    onChange={(e) => {
                                        const lessonId = e.target.value;
                                        const lesson = lessons.find(l => l.id === lessonId);
                                        setFormData({
                                            lessonId,
                                            title: lesson?.labWork?.title || '',
                                            description: lesson?.labWork?.description || '',
                                            downloadUrl: lesson?.labWork?.downloadUrl || ''
                                        });
                                    }}
                                    disabled={editingLesson !== null}
                                >
                                    <option value="">Darsni tanlang...</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Lab Sarlavhasi</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl px-5 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-cyan outline-none shadow-inner transition-colors"
                                        placeholder="Masalan: VLAN sozlash amaliyoti"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Packet Tracer Fayli (.PKA)</label>
                                    <input type="file" id="lab-file" className="hidden" onChange={handleLabUpload} />
                                    <label 
                                        htmlFor="lab-file"
                                        className={`w-full h-12 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all ${
                                            formData.downloadUrl 
                                            ? 'border-green-500/50 bg-green-500/5 text-green-500' 
                                            : 'border-slate-200 dark:border-dark-700 hover:border-brand-cyan text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {labUploading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                <span className="font-bold text-xs">{Math.round(labProgress)}%</span>
                                            </>
                                        ) : formData.downloadUrl ? (
                                            <>
                                                <Check size={18} strokeWidth={3} />
                                                <span className="font-bold text-xs">Fayl Yuklandi</span>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud size={18} />
                                                <span className="font-bold text-xs">Faylni Tanlash</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Lab Tavsifi</label>
                                    <textarea 
                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl px-5 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-cyan outline-none resize-none shadow-inner transition-colors"
                                        rows="2"
                                        placeholder="Talabalar uchun ko'rsatmalar..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-dark-900 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-slate-200 dark:border-dark-700/50 hover:bg-slate-200 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-white transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit"
                                    disabled={labUploading}
                                    className="flex-1 py-3 bg-brand-cyan text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all shadow-brand-cyan/25"
                                >
                                    {editingLesson ? "Yangilash" : "Saqlash"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabManagement;
