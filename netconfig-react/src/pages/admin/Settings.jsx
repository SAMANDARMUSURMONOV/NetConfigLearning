import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Shield, 
  Monitor,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Instagram,
  Zap,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiService, { BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';

const Settings = () => {
    const { t } = useTranslation();
    const { getIdToken } = useAuth();
    const { refreshSettings } = useSettings();
    
    const [settings, setSettings] = useState({
        platformName: 'NetConfig Learn',
        platformDescription: 'Corporate Networking E-Learning Platform',
        strictAdminAccess: true,
        publicRegistration: false,
        logoUrl: '',
        socialLinks: {
            telegram: '',
            instagram: ''
        },
        maintenanceMode: false
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await apiService.getSettings();
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Fetch settings error:", error);
            toast.error(t('admin_fetch_error') || "Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = await getIdToken();
            await apiService.updateSettings(settings, token);
            await refreshSettings();
            toast.success(t('saved_success'));
        } catch (error) {
            toast.error(t('admin_upload_error') || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingLogo(true);
            const token = await getIdToken();
            const result = await apiService.uploadLogo(file, token);
            setSettings(prev => ({ ...prev, logoUrl: result.logoUrl }));
            await refreshSettings();
            toast.success(t('admin_upload_success'));
        } catch (error) {
            toast.error(t('admin_upload_error'));
        } finally {
            setUploadingLogo(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="text-brand-cyan animate-spin" />
                <p className="text-slate-500 font-bold animate-pulse">{t('admin_loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl pb-24">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><SettingsIcon size={32} /></span>
                        {t('admin_settings_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_settings_subtitle')}</p>
                </div>
            </div>

            {/* Platform Config Section */}
            <div className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-lg border border-blue-100 dark:border-blue-800/50">
                            <Monitor size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('admin_settings_general')}</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">NetConfig Learn</p>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-8 glass-effect border-2 border-slate-200 dark:border-dark-700 p-8 rounded-[2.5rem] shadow-xl transition-all bg-white/90 dark:bg-dark-800/90">
                        {/* Logo Upload */}
                        <div className="pb-8 border-b border-slate-100 dark:border-dark-700">
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">{t('admin_settings_logo')}</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-dark-900 border-2 border-dashed border-slate-200 dark:border-dark-700 flex items-center justify-center text-slate-400 overflow-hidden relative group">
                                    {settings.logoUrl ? (
                                        <img src={`${BASE_URL}${settings.logoUrl}`} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <ImageIcon size={32} />
                                    )}
                                    <label className="absolute inset-0 bg-brand-cyan/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                        {uploadingLogo ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
                                    </label>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                                        {uploadingLogo ? t('admin_uploading_btn') : t('admin_upload_btn')}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">PNG, SVG or JPG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{t('platform_name')}</label>
                            <input 
                                type="text" 
                                value={settings.platformName}
                                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:border-brand-cyan transition-all outline-none font-medium shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{t('platform_description')}</label>
                            <textarea 
                                rows="3"
                                value={settings.platformDescription}
                                onChange={(e) => setSettings({...settings, platformDescription: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:border-brand-cyan transition-all outline-none font-medium shadow-inner resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 shadow-lg border border-pink-100 dark:border-pink-800/50">
                            <Globe size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('admin_settings_social')}</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Community</p>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6 glass-effect border-2 border-slate-200 dark:border-dark-700 p-8 rounded-[2.5rem] shadow-xl transition-all bg-white/90 dark:bg-dark-800/90">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                                <Send size={20} />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Telegram Link"
                                value={settings.socialLinks.telegram}
                                onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, telegram: e.target.value}})}
                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:border-brand-cyan transition-all outline-none font-medium"
                            />
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                                <Instagram size={20} />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Instagram Link"
                                value={settings.socialLinks.instagram}
                                onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})}
                                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:border-brand-cyan transition-all outline-none font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shrink-0 shadow-lg border border-brand-cyan/20">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('admin_settings_security')}</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Admin Control</p>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-8 glass-effect border-2 border-slate-200 dark:border-dark-700 p-8 rounded-[2.5rem] shadow-xl transition-all bg-brand-cyan/[0.01] dark:bg-brand-cyan/[0.01]">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-950 rounded-2xl border border-slate-100 dark:border-dark-700/50 transition-colors">
                            <div>
                                <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">Strict Admin Access</div>
                                <p className="text-xs text-slate-500 font-medium">Verify each admin login via email OTP</p>
                            </div>
                            <div 
                                onClick={() => setSettings({...settings, strictAdminAccess: !settings.strictAdminAccess})}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${settings.strictAdminAccess ? 'bg-brand-cyan/20 border border-brand-cyan/40' : 'bg-slate-200 dark:bg-dark-800 border border-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.strictAdminAccess ? 'right-1 bg-brand-cyan shadow-lg shadow-brand-cyan/50' : 'left-1 bg-slate-400'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-950 rounded-2xl border border-slate-100 dark:border-dark-700/50 transition-colors">
                            <div>
                                <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">Public Registration</div>
                                <p className="text-xs text-slate-500 font-medium">Allow anyone to create an account</p>
                            </div>
                            <div 
                                onClick={() => setSettings({...settings, publicRegistration: !settings.publicRegistration})}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${settings.publicRegistration ? 'bg-brand-cyan/20 border border-brand-cyan/40' : 'bg-slate-200 dark:bg-dark-800 border border-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.publicRegistration ? 'right-1 bg-brand-cyan shadow-lg shadow-brand-cyan/50' : 'left-1 bg-slate-400'}`}></div>
                            </div>
                        </div>

                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between p-4 bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-red-500/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">{t('admin_settings_maintenance')}</div>
                                    <p className="text-xs text-slate-500 font-medium">{t('admin_settings_maintenance_desc')}</p>
                                </div>
                            </div>
                            <div 
                                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${settings.maintenanceMode ? 'bg-red-500/20 border border-red-500/40' : 'bg-slate-200 dark:bg-dark-800 border border-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.maintenanceMode ? 'right-1 bg-red-500 shadow-lg shadow-red-500/50' : 'left-1 bg-slate-400'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-dark-700 flex justify-end gap-4">
                <button 
                    onClick={fetchSettings}
                    className="px-8 py-3.5 bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-dark-700 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                    {t('admin_quiz_discard')}
                </button>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-10 py-3.5 bg-brand-cyan text-white font-black rounded-2xl shadow-xl shadow-brand-cyan/25 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>{t('admin_settings_save_all')}</span>
                </button>
            </div>

        </div>
    );
};

export default Settings;
