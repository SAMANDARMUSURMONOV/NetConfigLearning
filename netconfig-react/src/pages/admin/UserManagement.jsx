import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  User, 
  Users,
  Trash2, 
  Lock, 
  Unlock,
  Activity,
  BarChart2,
  X,
  Award
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [allProgress, setAllProgress] = useState({});
    const [totalLessons, setTotalLessons] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [submitting, setSubmitting] = useState(false);
    const { getIdToken, user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await getIdToken();
            
            // Handle each promise individually so one failure doesn't block everything
            const usersPromise = apiService.getUsers(token).catch(err => {
                console.error("Users API failed:", err);
                toast.error(`Users error: ${err.message}`);
                return [];
            });
            const progressPromise = apiService.getAllProgress(token).catch(err => {
                console.error("Progress API failed:", err);
                return {};
            });
            const lessonsPromise = apiService.getLessons().catch(err => {
                console.error("Lessons API failed:", err);
                return [];
            });

            const [usersData, progressData, lessonsData] = await Promise.all([
                usersPromise,
                progressPromise,
                lessonsPromise
            ]);
            
            setUsers(Array.isArray(usersData) ? usersData : []);
            setAllProgress(progressData || {});
            setTotalLessons(lessonsData ? lessonsData.length : 0);
        } catch (err) {
            console.error("Global fetch error:", err);
            toast.error(err.message || t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (uid, currentStatus) => {
        try {
            const token = await getIdToken();
            await apiService.toggleUserStatus(uid, !currentStatus, token);
            toast.success(!currentStatus ? t('admin_toggle_success_blocked') : t('admin_toggle_success_unblocked'));
            fetchUsers();
        } catch (err) {
            toast.error(t('admin_toggle_error'));
        }
    };

    const handleDeleteUser = async (uid) => {
        if (!window.confirm(t('admin_delete_confirm'))) return;
        
        try {
            const token = await getIdToken();
            await apiService.deleteUser(uid, token);
            toast.success(t('admin_delete_success'));
            fetchUsers();
        } catch (err) {
            toast.error(t('admin_delete_error'));
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = await getIdToken();
            await apiService.createUser({
                email: formData.email,
                password: formData.password,
                displayName: formData.name,
                role: formData.role
            }, token);
            toast.success(t('admin_create_success'));
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            fetchUsers();
        } catch (err) {
            toast.error(t('admin_create_error'));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const isAdmin = u.customClaims?.admin === true;
        const searchMatch = (u.displayName?.toLowerCase() || '').includes(search.toLowerCase()) || 
                            (u.email?.toLowerCase() || '').includes(search.toLowerCase());
        const filterMatch = filter === 'all' || (filter === 'admin' && isAdmin) || (filter === 'student' && !isAdmin);
        return searchMatch && filterMatch;
    });

    const getUserStats = (uid) => {
        const userProgress = allProgress[uid] || {};
        const lessonIds = Object.keys(userProgress);
        const mastered = lessonIds.filter(id => userProgress[id].completed).length;
        const scores = lessonIds.map(id => userProgress[id].score).filter(s => s !== undefined && s !== null);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
        const progressPercent = totalLessons > 0 ? Math.round((mastered / totalLessons) * 100) : 0;
        
        return { mastered, avgScore, progressPercent, totalLessons };
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailsModalOpen(true);
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><Users size={32} /></span>
                        {t('admin_user_mgmt_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_user_mgmt_subtitle')}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-brand-cyan rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-cyan/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    <span>{t('admin_add_user')}</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-cyan transition-colors">
                        <Search size={20} />
                    </span>
                    <input 
                        type="text" 
                        placeholder={t('admin_search_placeholder')}
                        className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-all shadow-sm dark:shadow-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-cyan transition-all cursor-pointer shadow-sm dark:shadow-none"
                    >
                        <option value="all">{t('admin_all_roles')}</option>
                        <option value="admin">{t('admin_admins')}</option>
                        <option value="student">{t('admin_students')}</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-effect overflow-hidden rounded-[2.5rem] border-2 border-slate-200 dark:border-dark-700 shadow-xl transition-all bg-white/90 dark:bg-dark-800/90">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-dark-950/50 border-b border-slate-100 dark:border-dark-700 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[2px]">
                                <th className="px-8 py-5">{t('admin_full_name')}</th>
                                <th className="px-8 py-5">{t('status_progress') || 'Progress'}</th>
                                <th className="px-8 py-5">{t('admin_role_status')}</th>
                                <th className="px-8 py-5">{t('admin_last_login')}</th>
                                <th className="px-8 py-5 text-right font-bold">{t('admin_actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-dark-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-slate-500 font-bold">{t('admin_loading')}</td>
                                </tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.uid} className="hover:bg-slate-50/80 dark:hover:bg-dark-700/30 transition-colors group cursor-pointer" onClick={(e) => { if(!e.target.closest('button')) handleViewDetails(u); }}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-black group-hover:scale-110 transition-transform">
                                                {u.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-lg">{u.displayName}</div>
                                                <div className="text-sm text-slate-500 font-medium">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {!u.customClaims?.admin ? (() => {
                                            const stats = getUserStats(u.uid);
                                            return (
                                                <div className="flex flex-col gap-1.5 w-32">
                                                    <div className="flex justify-between items-center text-xs font-bold">
                                                        <span className="text-slate-500">{stats.mastered}/{stats.totalLessons}</span>
                                                        <span className={stats.progressPercent === 100 ? 'text-emerald-500' : 'text-brand-cyan'}>{stats.progressPercent}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${stats.progressPercent === 100 ? 'bg-emerald-500' : 'bg-brand-cyan'}`}
                                                            style={{ width: `${stats.progressPercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })() : (
                                            <span className="text-slate-400 text-sm font-medium italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                u.customClaims?.admin ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                                            }`}>
                                                {u.customClaims?.admin ? t('admin_administrator') : t('admin_student_user')}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${!u.disabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            {u.metadata.lastSignInTime 
                                                ? new Date(u.metadata.lastSignInTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) 
                                                : t('admin_never')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-40 dark:opacity-60 group-hover:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleViewDetails(u); }}
                                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-cyan transition-colors" 
                                                title="Batafsil ko'rish"
                                            >
                                                <Activity size={18} />
                                            </button>
                                            {u.uid !== currentUser?.uid ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleToggleStatus(u.uid, u.disabled)}
                                                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" 
                                                        title={!u.disabled ? t('admin_block_user') : t('admin_unlock_user')}
                                                    >
                                                        {!u.disabled ? <Lock size={18} /> : <Unlock size={18} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.uid)}
                                                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors" 
                                                        title={t('admin_delete_account')}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 italic px-2">{t('admin_current_user') || 'Siz'}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-500">
                                            <Search size={40} className="opacity-20" />
                                            <p className="text-lg font-bold">{t('admin_no_users_found')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Create User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-dark-950/80 backdrop-blur-sm transition-all">
                <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 transition-colors">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{t('admin_create_user_modal')}</h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">{t('admin_full_name')}</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-cyan transition-all" placeholder={t('admin_full_name')} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">{t('auth_email')}</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-cyan transition-all" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">{t('auth_password')}</label>
                            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={6} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-cyan transition-all" placeholder="Min. 6 characters" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">{t('admin_account_role')}</label>
                            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-cyan transition-all cursor-pointer">
                                <option value="student">{t('admin_student_user')}</option>
                                <option value="admin">{t('admin_administrator')}</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100 dark:border-dark-700">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-dark-700 rounded-xl transition-all">{t('admin_cancel')}</button>
                            <button type="submit" disabled={submitting} className={`flex-1 py-3 bg-brand-cyan text-white font-bold rounded-xl shadow-lg transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 shadow-brand-cyan/25'}`}>
                                {submitting ? t('admin_creating') : t('admin_create_btn')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* User Details Modal */}
        {isDetailsModalOpen && selectedUser && (() => {
            const stats = getUserStats(selectedUser.uid);
            const isStudent = !selectedUser.customClaims?.admin;
            const progress = allProgress[selectedUser.uid] || {};
            
            return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-dark-950/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-900/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-black text-2xl">
                                    {selectedUser.displayName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedUser.displayName}</h2>
                                    <p className="text-sm text-slate-500 font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-dark-800 rounded-full shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {!isStudent ? (
                                <div className="text-center py-10 opacity-60">
                                    <Shield size={48} className="mx-auto mb-4" />
                                    <p className="text-lg font-bold">Bu Administrator hisobi.</p>
                                    <p className="text-sm">O'quv statistikasi mavjud emas.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-slate-50 dark:bg-dark-900 p-5 rounded-2xl border border-slate-100 dark:border-dark-700 flex flex-col items-center justify-center text-center gap-2">
                                            <div className="text-slate-400"><BarChart2 size={24} /></div>
                                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.progressPercent}%</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Umumiy Progress</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-dark-900 p-5 rounded-2xl border border-slate-100 dark:border-dark-700 flex flex-col items-center justify-center text-center gap-2">
                                            <div className="text-brand-cyan"><Activity size={24} /></div>
                                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.mastered}/{stats.totalLessons}</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">O'zlashtirilgan darslar</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-dark-900 p-5 rounded-2xl border border-slate-100 dark:border-dark-700 flex flex-col items-center justify-center text-center gap-2">
                                            <div className="text-purple-500"><Award size={24} /></div>
                                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.avgScore}%</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">O'rtacha ball</div>
                                        </div>
                                    </div>

                                    {/* Lessons Breakdown */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Darslar tahlili</h3>
                                        <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-2xl overflow-hidden">
                                            {Object.keys(progress).length === 0 ? (
                                                <div className="p-8 text-center text-slate-500">Talaba hali darslarni boshlamagan.</div>
                                            ) : (
                                                <div className="divide-y divide-slate-100 dark:divide-dark-800">
                                                    {Object.entries(progress).map(([lessonId, data]) => (
                                                        <div key={lessonId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-900 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${data.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                                                    {lessonId}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-sm">Dars {lessonId}</div>
                                                                    <div className="text-xs text-slate-500">{new Date(data.lastUpdated).toLocaleDateString()} da yangilangan</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <div className="text-right">
                                                                    <div className="text-sm font-black text-slate-900 dark:text-white">{data.score !== undefined ? `${data.score}%` : '-'}</div>
                                                                    <div className="text-[10px] uppercase font-bold text-slate-400">Test balli</div>
                                                                </div>
                                                                <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${data.completed ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                                                                    {data.completed ? 'O\'zlashtirildi' : 'Jarayonda'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        })()}
    </>
    );
};

export default UserManagement;
