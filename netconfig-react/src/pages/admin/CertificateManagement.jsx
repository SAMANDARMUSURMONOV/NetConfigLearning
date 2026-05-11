import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Eye, 
  FileText, 
  Search, 
  User, 
  Plus, 
  X, 
  Save,
  Trash2
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CertificateManagement = () => {
    const { t } = useTranslation();
    const { getIdToken } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        student: '',
        course: '',
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const token = await getIdToken();
            const data = await apiService.getCertificates(token);
            setCertificates(data);
        } catch (err) {
            toast.error(t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async (e) => {
        e.preventDefault();
        try {
            const token = await getIdToken();
            await apiService.issueCertificate(formData, token);
            toast.success(t('admin_create_success'));
            setIsModalOpen(false);
            setFormData({ student: '', course: '' });
            fetchCertificates();
        } catch (err) {
            toast.error(t('admin_create_error'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin_cert_delete_confirm'))) return;
        try {
            const token = await getIdToken();
            await apiService.deleteCertificate(id, token);
            toast.success(t('admin_delete_success'));
            fetchCertificates();
        } catch (err) {
            toast.error(t('admin_delete_error'));
        }
    };

    const filteredCerts = certificates.filter(c => 
        c.student.toLowerCase().includes(search.toLowerCase()) || 
        c.certId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><Award size={32} /></span>
                        {t('admin_cert_mgmt_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_cert_mgmt_subtitle')}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3.5 bg-brand-cyan rounded-2xl text-sm font-bold text-white shadow-xl shadow-brand-cyan/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <Plus size={20} />
                    <span>{t('admin_cert_issue_manual')}</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="relative group max-w-2xl">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-cyan transition-colors">
                    <Search size={20} />
                </span>
                <input 
                    type="text" 
                    placeholder={t('admin_search_placeholder')}
                    className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-all shadow-sm dark:shadow-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* List / Table */}
            <div className="glass-effect overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-dark-700/50 shadow-xl transition-all">
                <div className="p-8 border-b border-slate-100 dark:border-dark-700 flex items-center justify-between bg-slate-50/50 dark:bg-dark-950/20">
                    <span className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('admin_cert_mgmt_title')}</span>
                    <span className="text-sm font-bold text-slate-500">{t('showing')} {filteredCerts.length}</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-dark-950/40 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[3px]">
                                <th className="px-10 py-5">{t('admin_cert_student_name')} / ID</th>
                                <th className="px-10 py-5">{t('admin_cert_course_name')}</th>
                                <th className="px-10 py-5">{t('date_of_completion')}</th>
                                <th className="px-10 py-5 text-right font-bold">{t('admin_actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-dark-700">
                            {loading ? (
                                <tr><td colSpan="4" className="px-10 py-10 text-center text-slate-500 font-bold">{t('admin_loading')}</td></tr>
                            ) : filteredCerts.map((cert) => (
                                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-dark-700/30 transition-colors group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-inner">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-xl">{cert.student}</div>
                                                <div className="text-xs text-slate-400 dark:text-slate-500 font-black tracking-widest mt-1 opacity-60 uppercase">{cert.certId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
                                            <span className="text-slate-600 dark:text-slate-300 font-bold">{cert.course}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{new Date(cert.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button 
                                                onClick={() => handleDelete(cert.id)}
                                                className="p-3 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm dark:shadow-xl"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/90 backdrop-blur-md transition-all" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 transition-colors">
                        <div className="p-8 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/20 transition-colors">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('admin_cert_issue_manual')}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><X /></button>
                        </div>
                        
                        <form onSubmit={handleIssueCertificate} className="p-8 space-y-6">
                             <div>
                                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t('admin_cert_student_name')}</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:border-electric transition-all outline-none shadow-inner transition-colors"
                                    placeholder={t('admin_cert_student_name')}
                                    value={formData.student}
                                    onChange={(e) => setFormData({...formData, student: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t('admin_cert_course_name')}</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:border-electric transition-all outline-none shadow-inner transition-colors"
                                    placeholder={t('admin_cert_course_name')}
                                    value={formData.course}
                                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                                />
                            </div>
                            
                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="w-full py-4 bg-brand-cyan text-white font-black rounded-2xl shadow-xl shadow-brand-cyan/25 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                                    <Save size={20} />
                                    <span>{t('admin_cert_generate')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CertificateManagement;
