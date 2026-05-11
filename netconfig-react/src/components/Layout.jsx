import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    const location = useLocation();
    
    // Yalang'och sahifalar, sidebar ko'rinsa bo'lmaydiganlar:
    const noSidebarPaths = ['/', '/login'];
    // Hozirgi path shu massiv ichida bormi yo'qmi, tekshiramiz
    const showSidebar = !noSidebarPaths.includes(location.pathname);
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-200 antialiased font-sans overflow-hidden transition-colors duration-300">
            {showSidebar && <Sidebar />}
            
            <div className={`flex-1 flex flex-col h-screen overflow-y-auto w-full ${showSidebar ? '' : ''}`}>
                <Header hideLogo={showSidebar} />
                <main className="flex-1 w-full">
                    <Outlet />
                </main>
                <Footer />
            </div>
            
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default Layout;
