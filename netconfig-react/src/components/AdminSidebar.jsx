import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Award, 
  Settings, 
  X, 
  Menu,
  ShieldCheck,
  FlaskConical,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import { useSettings } from '../context/SettingsContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  const menuItems = [
    { title: t('nav_overview'), icon: BarChart2, path: '/admin/overview' },
    { title: t('nav_users'), icon: Users, path: '/admin/users' },
    { title: t('nav_courses'), icon: BookOpen, path: '/admin/courses' },
    { title: t('nav_labs'), icon: FlaskConical, path: '/admin/labs' },
    { title: t('nav_quizzes'), icon: CheckSquare, path: '/admin/quizzes' },
    { title: t('nav_certificates'), icon: Award, path: '/admin/certificates' },
    { title: t('practical_clips') || 'Lavhalar', icon: Video, path: '/admin/clips' },
    { title: t('nav_settings'), icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 transition-all duration-300 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-8 border-b border-slate-100 dark:border-dark-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {settings.platformName.split(' ')[0]}<span className="text-brand-cyan">{settings.platformName.split(' ').slice(1).join(' ')}</span>
                <div className="text-[10px] tracking-[3px] text-slate-500 font-bold -mt-1">{t('nav_admin_portal')}</div>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar transition-colors">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
              >
                {({ isActive }) => (
                  <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-brand-cyan to-emerald-500 text-white shadow-[0_8px_20px_-6px_rgba(29,233,182,0.5)]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-700/50 hover:shadow-sm'}`}>
                    
                    <span className={`absolute left-0 w-1 h-6 bg-white rounded-r-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></span>
                    
                    <item.icon size={22} className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-brand-cyan'}`} />
                    <span className="tracking-tight">{item.title}</span>
                    
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full animate-shimmer pointer-events-none"></div>
                    )}
                  </div>
                )}
              </NavLink>
            ))}

            {/* Sidebar Bottom Spacing */}
            <div className="h-8"></div>
          </nav>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
