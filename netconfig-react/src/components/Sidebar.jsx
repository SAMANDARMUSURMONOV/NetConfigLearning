import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, TrendingUp, Award } from 'lucide-react'; // Fallback icons if emojis are not desired, but let's use emojis as in screenshot

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <aside className="w-64 bg-slate-50/50 dark:bg-dark-950 border-r border-slate-200 dark:border-dark-800 flex-shrink-0 hidden md:flex flex-col min-h-screen sticky top-0 transition-colors" style={{ height: '100vh' }}>
      
      {/* Sidebar Logo */}
      <div className="h-20 flex items-center px-6 mb-4">
        <div className="flex items-center gap-3 decoration-transparent">
          <div className="w-10 h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center border border-brand-cyan/20">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 8C52 8 54 9 55 11L57 18C60 19 63 21 66 23L73 20C75 19 78 20 79 22L85 32C86 34 85 37 83 38L77 43C78 45 78 48 78 50C78 52 78 55 77 57L83 62C85 63 86 66 85 68L79 78C78 80 75 81 73 80L66 77C63 79 60 81 57 82L55 89C54 91 52 92 50 92C48 92 46 91 45 89L43 82C40 81 37 79 34 77L27 80C25 81 22 80 21 78L15 68C14 66 15 63 17 62L23 57C22 55 22 52 22 50C22 48 22 45 23 43L17 38C15 37 14 34 15 32L21 22C22 20 25 19 27 20L34 23C37 21 40 19 43 18L45 11C46 9 48 8 50 8Z" stroke="#1de9b6" strokeWidth="8" strokeLinejoin="round"/>
              <circle cx="50" cy="50" r="28" stroke="#1de9b6" strokeWidth="6" />
            </svg>
          </div>
          <div className="text-xl tracking-tight flex items-center">
            <span className="font-black text-brand-cyan">Net</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">Config</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 flex flex-col gap-3 transition-colors">
        {[
          { to: "/courses", icon: "🏠", label: t('course') || 'Kurs' },
          { to: "/library", icon: "📚", label: t('nav_library') || 'Kutubxona' },
          { to: "/practical-clips", icon: "🎬", label: t('practical_clips') || 'Amaliy lavhalar' },
          { to: "/dashboard", icon: "📈", label: t('my_progress') || 'Mening natijam', end: true },
          { to: "/dashboard/certificate", icon: "🎓", label: t('certificate') || 'Sertifikat' }
        ].map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            end={item.end}
          >
            {({ isActive }) => (
              <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[14px] group relative overflow-hidden border
                ${isActive 
                  ? 'bg-gradient-to-r from-brand-cyan to-emerald-500 text-white border-transparent shadow-lg shadow-brand-cyan/25 scale-[1.02]' 
                  : 'bg-white/40 dark:bg-dark-900/40 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-dark-800 hover:text-brand-cyan dark:hover:text-brand-cyan hover:bg-white dark:hover:bg-dark-800 hover:border-brand-cyan/30 hover:shadow-md'}`}>
                
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110 rotate-0' : 'group-hover:scale-110 group-hover:-rotate-6'}`}>{item.icon}</span>
                <span className="tracking-tight">{item.label}</span>
                
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full animate-shimmer pointer-events-none"></div>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
