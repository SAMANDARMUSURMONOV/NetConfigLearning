import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard, Settings, UserCircle, Bell, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import { useSettings } from '../context/SettingsContext';

const Header = ({ hideLogo = false }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'En' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿', short: 'Uz' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', short: 'Ru' },
  ];

  const currentLangCode = i18n.language || 'uz';
  const activeLang = languages.find(l => l.code === currentLangCode) || languages[1];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('bmi_lang', code);
    setLangOpen(false);
  };

  return (
    <header className="w-full bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center h-16 ${hideLogo ? 'justify-end' : 'justify-between'}`}>
          
          {/* Logo */}
          {!hideLogo && (
            <Link to="/" className="flex items-center gap-3 decoration-transparent">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-xl tracking-wide flex items-center">
                <span className="font-extrabold text-brand-cyan">{settings.platformName.split(' ')[0]}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 transition-colors ml-1">{settings.platformName.split(' ').slice(1).join(' ')}</span>
              </div>
            </Link>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 hover:text-brand-cyan dark:hover:text-white hover:bg-white dark:hover:bg-dark-700 transition-all border border-slate-200 dark:border-dark-700 shadow-sm hover:shadow-md group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400 group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="text-blue-600 group-hover:-rotate-12 transition-transform" />}
            </button>
            
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 hover:border-brand-cyan dark:hover:border-brand-cyan text-slate-900 dark:text-slate-200 px-4 py-2 rounded-xl transition-all text-sm font-bold focus:outline-none shadow-sm group"
              >
                <span className="opacity-70 group-hover:opacity-100">{activeLang.short}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white/95 dark:bg-dark-800/95 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('choose_language') || 'Tilni tanlang'}</div>
                    {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-[calc(100%-16px)] mx-2 text-left px-3 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between group ${currentLangCode === lang.code ? 'bg-brand-cyan/10 text-brand-cyan font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base">{lang.flag}</span>
                        {lang.label}
                      </span>
                      {currentLangCode === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(29,233,182,1)]"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Controls */}
            {loading ? (
              <div className="h-8 w-24 bg-dark-800 animate-pulse rounded-md"></div>
            ) : isAuthenticated && user && !isHomePage ? (
              <div className="flex items-center gap-3 sm:gap-4">
                
                {/* Notifications (Mock) */}
                <button className="hidden sm:flex text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800">
                  <Bell size={20} />
                </button>

                {/* Vertical Divider */}
                <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-dark-700 mx-1"></div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-4 p-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group focus:outline-none"
                  >
                    {/* Avatar with Premium Gradient */}
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-transform group-hover:scale-105 ${
                      user?.role?.toLowerCase() === 'admin' 
                        ? 'bg-gradient-to-tr from-purple-600 to-amber-500 text-white' 
                        : 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white'
                    }`}>
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>

                    {/* Name & Role (Desktop) */}
                    <div className="hidden sm:flex flex-col items-start gap-1">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none transition-colors">
                        {user?.name}
                      </span>
                      <span className={`text-[10px] tracking-wider font-black px-2 py-0.5 rounded border shadow-sm ${
                        user?.role?.toLowerCase() === 'admin' 
                          ? 'bg-purple-500/20 text-amber-400 border-purple-500/30' 
                          : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                      }`}>
                        {user?.role?.toLowerCase() === 'admin' ? (t('admin') || 'ADMIN') : (t('student') || 'STUDENT')}
                      </span>
                    </div>

                    <ChevronDown size={14} className={`text-slate-500 mr-2 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Premium SaaS Style */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-dark-800/95 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl py-3 z-50 transform origin-top-right animate-in fade-in zoom-in duration-200">
                      
                      {/* User Header Info (Mobile) */}
                      <div className="sm:hidden px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2">
                        <div className="font-bold text-slate-900 dark:text-white mb-0.5">{user?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                      </div>

                      <div className="px-2 space-y-1">
                        {/* Menu Links */}
                        {user?.role === 'admin' && (
                          <Link 
                            to={location.pathname.startsWith('/admin') ? '/dashboard' : '/admin'} 
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all"
                          >
                            {location.pathname.startsWith('/admin') ? (
                              <>
                                <LayoutDashboard size={18} className="text-blue-500 dark:text-blue-400" />
                                <span className="font-medium">{t('nav_student_dashboard')}</span>
                              </>
                            ) : (
                              <>
                                <LayoutDashboard size={18} className="text-amber-600 dark:text-amber-500" />
                                <span className="font-medium">{t('nav_admin_panel')}</span>
                              </>
                            )}
                          </Link>
                        )}

                        <Link 
                          to="/dashboard/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all"
                        >
                          <UserCircle size={18} className="text-blue-500 dark:text-blue-400" />
                          <span className="font-medium">{t('enter_profile')}</span>
                        </Link>

                        <Link 
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all"
                        >
                          <Settings size={18} className="text-slate-500 dark:text-slate-400" />
                          <span className="font-medium">{t('settings')}</span>
                        </Link>

                        <div className="h-px bg-slate-100 dark:bg-white/5 my-2 mx-2"></div>

                        <button 
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all group"
                        >
                          <LogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-brand-cyan hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_8px_15px_-5px_rgba(29,233,182,0.4)] active:scale-95"
              >
                {t('sign_in')}
              </button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
