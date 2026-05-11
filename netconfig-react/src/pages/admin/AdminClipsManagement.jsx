import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Upload, Loader2, Video } from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminClipsManagement = () => {
  const { t } = useTranslation();
  const { getIdToken } = useAuth();
  
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileInputRef = useRef(null);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const data = await apiService.getClips();
      setClips(data);
    } catch (error) {
      console.error("Failed to fetch clips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation for video type and size (<50MB)
      if (file.type.startsWith('video/')) {
        if (file.size <= 50 * 1024 * 1024) {
          setSelectedFile(file);
          setVideoUrl(''); // Clear URL if file selected
        } else {
          alert(t('admin_clips_size_error') || "Video hajmi 50MB dan oshmasligi kerak.");
          e.target.value = null;
        }
      } else {
        alert(t('admin_clips_format_error') || "Faqat video formatdagi fayllarni yuklang.");
        e.target.value = null;
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || (!selectedFile && !videoUrl)) {
      alert(t('admin_clips_fill_all') || "Iltimos, kamida sarlavha va video (fayl yoki havola) kiriting.");
      return;
    }

    try {
      setIsUploading(true);
      const token = await getIdToken();
      await apiService.createClip(selectedFile, title, description, token, videoUrl);
      
      // Reset form
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowForm(false);
      
      // Refresh list
      fetchClips();
    } catch (error) {
      alert((t('admin_clips_upload_error') || "Saqlashda xatolik yuz berdi: ") + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin_clips_delete_confirm') || "Rostdan ham bu lavhani o'chirmoqchimisiz?")) {
      try {
        const token = await getIdToken();
        await apiService.deleteClip(id, token);
        fetchClips();
      } catch (error) {
        alert((t('admin_clips_delete_error') || "O'chirishda xatolik yuz berdi: ") + error.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t('admin_clips_title') || 'Amaliy lavhalarni boshqarish'}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('admin_clips_subtitle') || 'Platformaga yangi qisqa videolar qo\'shish va ularni tahrirlash'}</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if(!showForm) {
              setTitle('');
              setDescription('');
              setVideoUrl('');
              setSelectedFile(null);
            }
          }}
          className="bg-brand-cyan hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_8px_15px_-5px_rgba(29,233,182,0.4)] flex items-center gap-2 active:scale-95"
        >
          {showForm ? (t('admin_clips_close') || 'Yopish') : <><Plus size={20} /> {t('admin_clips_new') || 'Yangi Lavha'}</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 mb-8 border border-slate-200 dark:border-dark-700 shadow-xl animate-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Upload className="text-brand-cyan" /> {t('admin_clips_upload_title') || 'Yangi Video Yuklash'}
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin_clips_title_label') || 'Sarlavha'}</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('admin_clips_title_placeholder') || 'Masalan: RJ45 konnektorini ulash'}
                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin_clips_desc_label') || 'Izoh (Description)'}</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('admin_clips_desc_placeholder') || 'Video haqida qisqacha ma\'lumot...'}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t('admin_clips_url_label') || 'Video Havolasi (Bunny/YouTube)'}</label>
                    <span className="text-[10px] bg-brand-cyan/10 text-brand-cyan px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Tavsiya etiladi</span>
                  </div>
                  <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      if (e.target.value) setSelectedFile(null); // Clear file if URL entered
                    }}
                    placeholder="https://player.mediadelivery.net/play/..."
                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin_clips_file_label') || 'Yoki Video Fayl Yuklash'}</label>
                <div 
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${selectedFile ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-300 dark:border-dark-600 hover:border-brand-cyan/50 hover:bg-slate-50 dark:hover:bg-dark-700/50 cursor-pointer'} ${videoUrl ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  onClick={() => !videoUrl && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="video/mp4,video/webm" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    disabled={!!videoUrl}
                  />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-brand-cyan/20 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-3">
                        <Video size={32} />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="text-red-500 text-sm mt-3 font-bold hover:underline"
                      >
                        {t('admin_clips_choose_other') || 'Bekor qilish'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center pointer-events-none">
                      <Upload className="mx-auto text-slate-400 mb-3" size={48} />
                      <p className="text-slate-600 dark:text-slate-400 font-bold">{t('admin_clips_click_to_select') || 'Faylni tanlash uchun bosing'}</p>
                      <p className="text-sm text-slate-500 mt-2">{t('admin_clips_file_format') || 'Maks 50MB'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-dark-700/50">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                disabled={isUploading}
              >
                {t('admin_clips_cancel') || 'Bekor qilish'}
              </button>
              <button 
                type="submit"
                disabled={isUploading || (!selectedFile && !videoUrl)}
                className="bg-brand-cyan hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? <><Loader2 size={20} className="animate-spin" /> {t('admin_clips_saving') || 'Saqlanmoqda...'}</> : (t('admin_clips_save_btn') || 'Saqlash')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Clips */}
      <div className="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-900/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="text-slate-400" /> {t('admin_clips_all') || 'Barcha Lavhalar'}
          </h3>
          <span className="bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
            {clips.length} {t('admin_clips_count') || 'ta'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-cyan" size={40} /></div>
        ) : clips.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            {t('admin_clips_empty') || 'Hali hech qanday lavha yuklanmagan.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-dark-700">
            {clips.map(clip => (
              <div key={clip.id} className="p-6 flex flex-col md:flex-row gap-6 items-start hover:bg-slate-50 dark:hover:bg-dark-900/30 transition-colors group">
                <div className="w-full md:w-48 aspect-[9/16] bg-black rounded-xl overflow-hidden shrink-0 shadow-md">
                  <video className="w-full h-full object-contain">
                    <source src={`http://localhost:5001${clip.videoUrl}`} type="video/mp4" />
                  </video>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{clip.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">{clip.description}</p>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {t('admin_clips_uploaded_at') || 'Yuklangan:'} {new Date(clip.createdAt).toLocaleString()}
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(clip.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    <Trash2 size={16} /> {t('admin_clips_delete') || 'O\'chirish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminClipsManagement;
