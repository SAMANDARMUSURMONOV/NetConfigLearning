import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Camera, Settings, Eye, EyeOff, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const Profile = () => {
    const { user, getIdToken } = useAuth();
    const { t } = useTranslation();
    
    // UI State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showPw1, setShowPw1] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [showPw3, setShowPw3] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [name, setName] = useState(user?.name || '');
    const [hoursPerLesson, setHoursPerLesson] = useState(1.5);
    const [hoursPerWeek, setHoursPerWeek] = useState(5);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('file_too_large') || 'File is too large (max 5MB)');
            return;
        }

        try {
            setUploading(true);
            const token = await getIdToken();
            const result = await apiService.updateProfileAvatar(file, token);
            toast.success(t('avatar_updated') || 'Profile picture updated!');
            
            // Note: Since we are using Firebase, we might need to refresh the page or wait for onAuthStateChanged
            // But we can also manually trigger a refresh if needed.
            // For now, let's assume the user will see it after a reload or next state change.
            window.location.reload(); 
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error(t('upload_error') || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        toast.success(t('save_changes'));
    };

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        toast.success(t('save_success') || 'Settings saved!');
        setIsSettingsOpen(false);
    };

    // Calculate estimated weeks (assuming 15 lessons)
    const estimatedWeeks = Math.ceil((15 * hoursPerLesson) / hoursPerWeek);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-900 border-x border-slate-200 dark:border-dark-800 pb-20 transition-colors">
            
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-dark-700/50 bg-slate-50/50 dark:bg-dark-800/30 p-8 sm:px-12 backdrop-blur-sm mb-8">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <span className="text-4xl">👤</span> 
                            <span>{t('my_profile')}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">{t('manage_account')}</p>
                    </div>
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-slate-300 dark:border-dark-600 hover:border-electric text-slate-700 dark:text-slate-200 hover:text-electric px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Settings size={18} /> {t('study_settings')}
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4">
                
                {/* Profile Form */}
                <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-electric/5 blur-3xl rounded-full pointer-events-none"></div>

                    <form onSubmit={handleProfileSubmit} className="relative z-10 space-y-6">
                        
                        {/* Avatar */}
                        <div className="flex flex-col items-center justify-center mb-10">
                            <div className="relative group">
                                <div className={`w-28 h-28 rounded-full border-4 border-slate-100 dark:border-dark-700 shadow-xl overflow-hidden transition-all duration-300 ${uploading ? 'opacity-50 scale-95' : 'group-hover:border-electric'}`}>
                                    <img 
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0ea5e9&color=fff&size=120`}
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <label className={`absolute bottom-0 right-0 bg-electric text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition-all transform hover:scale-110 ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                                    <Camera size={18} />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 font-medium uppercase tracking-wider">{uploading ? (t('uploading') || 'Yuklanmoqda...') : (t('change_photo') || 'Rasmni o\'zgartirish')}</p>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('full_name')}</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth_email') || t('email')}</label>
                                <input 
                                    type="email" 
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full bg-slate-100 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-3 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-2">{t('email_warning')}</p>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-dark-700/50 my-8" />

                        {/* Change Password */}
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('change_password')}</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('current_pw')}</label>
                                <div className="relative">
                                    <input 
                                        type={showPw1 ? "text" : "password"} 
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric transition-colors pr-12"
                                    />
                                    <button type="button" onClick={() => setShowPw1(!showPw1)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                        {showPw1 ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('new_pw')}</label>
                                <div className="relative">
                                    <input 
                                        type={showPw2 ? "text" : "password"} 
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric transition-colors pr-12"
                                    />
                                    <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                        {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('confirm_new_pw')}</label>
                                <div className="relative">
                                    <input 
                                        type={showPw3 ? "text" : "password"} 
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric transition-colors pr-12"
                                    />
                                    <button type="button" onClick={() => setShowPw3(!showPw3)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                        {showPw3 ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-electric hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_4px_15px_rgba(0,180,255,0.3)] transition-all">
                                <Save size={18} /> {t('save_changes')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Study Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-dark-950/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl w-full max-w-md p-8 shadow-2xl relative transition-colors">
                        <button 
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-dark-700"
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('study_settings_title')}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-200 dark:border-dark-700">{t('study_settings_desc')}</p>
                        
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('hours_per_lesson')} <span className="text-red-500">*</span></label>
                                <input 
                                    type="number" 
                                    step="0.5" min="0.5" max="10"
                                    value={hoursPerLesson}
                                    onChange={(e) => setHoursPerLesson(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-electric focus:outline-none" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('hours_per_week')} <span className="text-red-500">*</span></label>
                                <input 
                                    type="number" 
                                    step="0.5" min="1" max="50"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-electric focus:outline-none" 
                                    required 
                                />
                            </div>

                            <div className="bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700 p-4 rounded-xl flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{t('estimated_completion')}</span>
                                <span className="text-electric font-bold text-lg">{estimatedWeeks} {t('weeks_plural')}</span>
                            </div>

                            <button type="submit" className="w-full bg-electric hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-electric/30">
                                {t('save_settings')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
