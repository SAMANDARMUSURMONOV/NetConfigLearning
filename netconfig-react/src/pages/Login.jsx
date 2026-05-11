import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, X, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Forgot Password Modal States
  const [forgotEmail, setForgotEmail] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  
  const { login, register, isAuthenticated, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          // Navigatsiyani useEffect (line 21) o'zi role bo'yicha hal qiladi
          console.log("Login success, waiting for role resolution...");
        } else {
          // Firebase xatolik kodlarini tushunarli qilish
          const msg = result.message === 'auth/invalid-credential' 
            ? 'Email yoki parol noto\'g\'ri' 
            : result.message;
          setError(msg);
        }
      } else {
        if (!name || !email || !password) {
          setError('Iltimos, barcha maydonlarni to\'ldiring');
          return;
        }
        const result = await register(email, password, name);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError("Kutilmagan xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalSubmitting(true);

    try {
      const result = await resetPassword(forgotEmail);
      if (result.success) {
        setModalSuccess('Parolni tiklash havolasi emailingizga yuborildi!');
        setForgotEmail('');
        // Modalni birozdan keyin yopish
        setTimeout(() => setIsForgotOpen(false), 3000);
      } else {
        const errorMsg = result.message === 'auth/user-not-found' 
          ? 'Ushbu email bilan foydalanuvchi topilmadi' 
          : 'Xatolik yuz berdi. Qaytadan urinib ko\'ring';
        setModalError(errorMsg);
      }
    } catch (err) {
      setModalError('Kutilmagan xatolik yuz berdi');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden bg-white dark:bg-transparent transition-colors">
      
      {/* Back button (Top Left) - SaaS Style */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group z-30"
      >
        <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-transparent dark:hover:border-dark-700 bg-slate-50 dark:bg-dark-800/20 shadow-sm dark:shadow-none">
          <span className="text-sm font-medium tracking-wide">{t('nav_back')}</span>
        </div>
      </Link>

      {/* Background decorations xuddi auth.html dagi kabi */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/10 dark:bg-electric/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Auth Box */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-slate-200 dark:border-dark-700 shadow-xl dark:shadow-2xl p-8 sm:p-10 rounded-2xl w-full transition-colors">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4 md:hidden">
                <div className="text-3xl font-extrabold tracking-tight">
                  <span className="text-electric">Net</span>
                  <span className="text-slate-900 dark:text-slate-100">Config</span>
                </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isLogin ? t('auth_login_title') : t('auth_reg_title')}
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth_fullname')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500">
                    <UserIcon size={20} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-10 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors shadow-sm dark:shadow-none"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth_email')}</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-10 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors shadow-sm dark:shadow-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 m-0">{t('auth_password')}</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotOpen(true)}
                    className="text-sm font-medium text-electric hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {t('auth_forgot')}
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-10 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors shadow-sm dark:shadow-none pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 dark:text-slate-500 hover:text-electric transition-all"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-electric hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-[0_4px_15px_rgba(0,180,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,180,255,0.5)] flex items-center justify-center mt-8 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t('admin_loading') || 'Yuklanmoqda...'}</span>
                </div>
              ) : (
                isLogin ? t('auth_login_btn') : t('auth_reg_btn')
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-2">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {isLogin ? t('auth_no_account') : t('auth_has_account')}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-electric hover:text-blue-500 dark:hover:text-blue-400 font-semibold transition-colors ml-2"
              >
                {isLogin ? t('auth_register_link') : t('auth_login_link')}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-dark-900/80 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl w-full max-w-md p-8 shadow-2xl relative transition-colors">
            <button 
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-dark-700 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('auth_forgot')}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-200 dark:border-dark-700/50">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {modalError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-4 text-sm">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-md mb-4 text-sm">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input 
                type="email" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric transition-colors shadow-sm dark:shadow-none" 
                placeholder="Email" 
                required 
              />
              <button 
                type="submit" 
                disabled={modalSubmitting}
                className={`w-full bg-electric hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center ${modalSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {modalSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
