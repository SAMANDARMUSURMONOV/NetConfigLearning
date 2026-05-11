import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-white dark:bg-dark-900 text-slate-900 dark:text-white overflow-hidden transition-colors">
            {/* Professional Sidebar Navigation */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-72 w-full">
                
                {/* Topbar for Mobile */}
                <header className="lg:hidden h-16 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-700 flex items-center justify-between px-6 shrink-0 relative z-40 shadow-sm dark:shadow-xl transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Net<span className="text-brand-cyan">Config</span>
                        </div>
                    </div>
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-700 rounded-lg transition-all"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Desktop Header containing User Dropdown */}
                <div className="hidden lg:block shrink-0 z-40 relative">
                    <Header hideLogo={true} />
                </div>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-12 custom-scrollbar relative">
                    {/* Background Glow Decorations */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-[150px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-100"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 blur-[180px] rounded-full pointer-events-none -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/3 blur-[150px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-100"></div>

                    <div className="max-w-7xl mx-auto w-full relative z-10">
                        {/* Dynamic Admin Page Hero / Content */}
                        <Outlet />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminLayout;
