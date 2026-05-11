import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { t } = useTranslation();
    const { settings } = useSettings();
    const year = new Date().getFullYear();

    return (
        <footer className="w-full bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-800 text-slate-500 dark:text-slate-400 py-8 text-sm transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-brand-cyan">{settings.platformName.split(' ')[0]}</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 transition-colors ml-1">{settings.platformName.split(' ').slice(1).join(' ')}</span>
                        <span className="ml-2">&copy; {year} Network Track. {t('all_rights_reserved')}</span>
                    </div>
                    <div className="flex gap-6">
                        {settings.socialLinks?.telegram && (
                            <a href={settings.socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">Telegram</a>
                        )}
                        {settings.socialLinks?.instagram && (
                            <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">Instagram</a>
                        )}
                        <a href="#" className="hover:text-brand-cyan transition-colors">{t('terms_of_service')}</a>
                        <a href="#" className="hover:text-brand-cyan transition-colors">{t('privacy_policy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
