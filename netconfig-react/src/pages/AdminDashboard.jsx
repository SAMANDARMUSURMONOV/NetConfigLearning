import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, Star, TrendingUp, PlusCircle, Settings, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { getIdToken } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [labTitle, setLabTitle] = useState('');
    const [labDesc, setLabDesc] = useState('');
    const [labLink, setLabLink] = useState('');

    // Darslarni yuklash
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const data = await apiService.getLessons();
                setLessons(data);
            } catch (err) {
                console.error("Failed to load lessons:", err);
                toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        
        try {
            const token = await getIdToken();
            const lessonData = {
                title,
                description,
                level,
                videoUrl,
                thumbnail: thumbnail || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
                duration: "10:00", // Default
                labWork: labTitle ? {
                    title: labTitle,
                    description: labDesc,
                    downloadLink: labLink
                } : null,
                quiz: { questions: [] } // Soddalik uchun hozircha bo'sh quiz
            };

            const result = await apiService.createLesson(lessonData, token);
            setLessons([...lessons, result.lesson]);
            toast.success("Yangi dars muvaffaqiyatli qo'shildi! ✅");
            
            // Re-fetch barcha darslarni
            const updated = await apiService.getLessons();
            setLessons(updated);
            
            // Formani tozalash
            setTitle('');
            setDescription('');
            setVideoUrl('');
            setThumbnail('');
            setLabTitle('');
            setLabDesc('');
            setLabLink('');
            
            setActiveTab('stats');
        } catch (error) {
            console.error("Save lesson error:", error);
            toast.error("Darsni saqlashda xatolik yuz berdi");
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {/* Header */}
            <div className="bg-dark-800 border-b border-dark-700 p-8 sm:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                        <span className="text-electric"><Settings size={36} /></span>
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 text-lg">Manage courses, users, and platform statistics</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-dark-800/50 p-2 rounded-xl inline-flex border border-dark-700">
                    <button 
                        onClick={() => setActiveTab('stats')}
                        className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                            activeTab === 'stats' ? 'bg-electric text-white shadow-lg shadow-electric/20' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                        }`}
                    >
                        Statistics
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                            activeTab === 'users' ? 'bg-electric text-white shadow-lg shadow-electric/20' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                        }`}
                    >
                        Manage Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('add')}
                        className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                            activeTab === 'add' ? 'bg-electric text-white shadow-lg shadow-electric/20' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                        }`}
                    >
                        Add Lesson
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-10 shadow-2xl">
                    
                    {/* STATS TAB */}
                    {activeTab === 'stats' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-8">Platform Overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-dark-900 border border-dark-600 rounded-xl p-6 flex items-center gap-4 hover:border-electric transition-colors">
                                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-electric flex items-center justify-center shrink-0">
                                        <Users size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Users</div>
                                        <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
                                    </div>
                                </div>
                                
                                <div className="bg-dark-900 border border-dark-600 rounded-xl p-6 flex items-center gap-4 hover:border-green-500 transition-colors">
                                    <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                        <BookOpen size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Lessons</div>
                                        <div className="text-3xl font-black text-white">{loading ? '...' : lessons.length}</div>
                                    </div>
                                </div>

                                <div className="bg-dark-900 border border-dark-600 rounded-xl p-6 flex items-center gap-4 hover:border-yellow-500 transition-colors">
                                    <div className="w-14 h-14 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                                        <Star size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Reviews</div>
                                        <div className="text-3xl font-black text-white">{stats.totalReviews}</div>
                                    </div>
                                </div>

                                <div className="bg-dark-900 border border-dark-600 rounded-xl p-6 flex items-center gap-4 hover:border-purple-500 transition-colors">
                                    <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Avg Progress</div>
                                        <div className="text-3xl font-black text-white">{stats.avgProgress}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6">Registered Users</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                                    <thead className="bg-dark-950 border-b border-dark-700 text-slate-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Name</th>
                                            <th className="px-6 py-4 font-bold">Email</th>
                                            <th className="px-6 py-4 font-bold">Role</th>
                                            <th className="px-6 py-4 font-bold">Joined</th>
                                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {mockUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-dark-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-electric/20 text-electric flex items-center justify-center font-bold text-xs">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-white">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-300">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-electric border border-blue-500/20'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">{u.joined}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 bg-dark-700 hover:bg-electric text-slate-300 hover:text-white rounded transition-colors" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 bg-dark-700 hover:bg-red-500 text-slate-300 hover:text-white rounded transition-colors" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ADD LESSON TAB */}
                    {activeTab === 'add' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-2">Add New Lesson</h2>
                            <p className="text-slate-400 mb-8 border-b border-dark-700 pb-4">Create a new lesson with video, quiz, and laboratory work.</p>
                            
                            <form onSubmit={handleAddLesson} className="space-y-6 max-w-4xl">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Lesson Title <span className="text-electric">*</span></label>
                                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors" placeholder="e.g. Advanced BGP Routing" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Description <span className="text-electric">*</span></label>
                                        <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-colors" placeholder="Brief lesson description..."></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Level</label>
                                            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric outline-none">
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Video URL <span className="text-electric">*</span></label>
                                            <input type="text" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric outline-none" placeholder="e.g. video/bgp.mp4" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Thumbnail URL</label>
                                        <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric outline-none" placeholder="Optional" />
                                    </div>
                                </div>

                                {/* Quiz Config */}
                                <div className="pt-6 mt-6 border-t border-dark-700">
                                    <h3 className="text-lg font-bold text-white mb-1">Quiz Configuration (Optional)</h3>
                                    <p className="text-sm text-slate-500 mb-6">Add questions to enable the quiz mechanism for this lesson.</p>
                                    
                                    <div className="bg-dark-900/50 p-6 rounded-xl border border-dark-600 space-y-4 mb-4 relative group">
                                        <button type="button" className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={18} />
                                        </button>
                                        <h4 className="font-bold text-electric text-sm uppercase tracking-wider mb-2">Question 1</h4>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">Question Text</label>
                                            <input type="text" className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-white text-sm focus:border-electric outline-none" placeholder="e.g. What does BGP stand for?" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">Options (Comma separated)</label>
                                            <input type="text" className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-white text-sm focus:border-electric outline-none" placeholder="Border Gateway Protocol, Basics..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">Correct Option Index (0-based)</label>
                                            <input type="number" min="0" className="w-full sm:w-1/3 bg-dark-800 border border-dark-600 rounded p-2 text-white text-sm focus:border-electric outline-none" placeholder="e.g. 0" />
                                        </div>
                                    </div>
                                    
                                    <button type="button" className="flex items-center gap-2 text-sm text-electric font-bold hover:text-blue-400 transition-colors bg-electric/10 hover:bg-electric/20 px-4 py-2 rounded-lg">
                                        <PlusCircle size={16} /> Add Another Question
                                    </button>
                                </div>

                                {/* Lab */}
                                <div className="pt-6 mt-6 border-t border-dark-700">
                                    <h3 className="text-lg font-bold text-white mb-4">Laboratory Work (Optional)</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Lab Title</label>
                                            <input type="text" value={labTitle} onChange={(e) => setLabTitle(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric outline-none" placeholder="e.g. Lab 16" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Download Link</label>
                                            <input type="text" value={labLink} onChange={(e) => setLabLink(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-electric outline-none" placeholder="Assignment URL" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Lab Description</label>
                                        <textarea rows="2" value={labDesc} onChange={(e) => setLabDesc(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-electric outline-none" placeholder="Instructions..."></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-dark-700 text-right">
                                    <button type="submit" className="bg-electric hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-[0_4px_15px_rgba(0,180,255,0.3)] hover:-translate-y-0.5 inline-flex items-center gap-2">
                                        <Save size={18} /> Save Lesson
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
