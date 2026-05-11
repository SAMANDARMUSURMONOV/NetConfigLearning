import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  HelpCircle, 
  BarChart3, 
  Users, 
  Trash2, 
  Save, 
  X,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Brain,
  Wand2,
  RefreshCcw
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const QuizManagement = () => {
    const { t } = useTranslation();
    const { getIdToken } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Quiz Editor State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [questions, setQuestions] = useState([]);

    // AI States
    const [aiConfig, setAiConfig] = useState({
        topic: '',
        difficulty: 'medium',
        count: 5
    });
    const [aiLoading, setAiLoading] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState(false);

    const difficultyOptions = [
        { value: 'easy', label: 'Oson', color: 'emerald' },
        { value: 'medium', label: 'O\'rtacha', color: 'amber' },
        { value: 'hard', label: 'Murakkab', color: 'rose' }
    ];

    const currentDifficultyLabel = difficultyOptions.find(opt => opt.value === aiConfig.difficulty)?.label || 'O\'rtacha';

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const data = await apiService.getLessons();
            setLessons(data);
        } catch (err) {
            toast.error(t('admin_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditQuiz = (lesson) => {
        setSelectedLesson(lesson);
        // Agar darsda allaqachon savollar bo'lsa, ularni yuklaymiz, aks holda bo'sh ro'yxat
        setQuestions(lesson.quiz?.questions || [
            { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]);
        setAiConfig({ ...aiConfig, topic: lesson.title });
        setIsModalOpen(true);
    };

    const handleGenerateAI = async () => {
        if (!aiConfig.topic) {
            toast.warning("Iltimos, mavzuni kiriting");
            return;
        }

        try {
            setAiLoading(true);
            const token = await getIdToken();
            const aiQuestions = await apiService.generateAiQuestions(aiConfig, token);
            
            if (Array.isArray(aiQuestions)) {
                // Yangi savollarni qo'shish yoki almashtirish tanlovi bo'lishi mumkin, 
                // hozircha qo'shib qo'yamiz (Append)
                setQuestions([...questions, ...aiQuestions]);
                toast.success(`${aiQuestions.length} ta savol muvaffaqiyatli yaratildi!`);
            }
        } catch (err) {
            console.error(err);
            toast.error("AI bilan savol yaratishda xatolik yuz berdi");
        } finally {
            setAiLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestionText = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].question = text;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = text;
        setQuestions(newQuestions);
    };

    const setCorrectAnswer = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = oIndex;
        setQuestions(newQuestions);
    };

    const handleSaveQuiz = async () => {
        try {
            const token = await getIdToken();
            await apiService.updateLessonQuiz(selectedLesson.id, { questions }, token);
            toast.success(t('admin_quiz_save_success'));
            setIsModalOpen(false);
            fetchLessons();
        } catch (err) {
            toast.error(t('admin_create_error'));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-brand-cyan"><CheckSquare size={32} /></span>
                        {t('admin_quiz_mgmt_title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('admin_quiz_mgmt_subtitle')}</p>
                </div>
            </div>

            {/* Lesson / Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="bg-slate-100 dark:bg-dark-800 h-64 rounded-3xl animate-pulse border border-slate-200 dark:border-dark-700"></div>
                    ))
                ) : lessons.map((lesson) => (
                    <div key={lesson.id} className="glass-effect group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-dark-700/50 shadow-sm hover:shadow-2xl hover:border-brand-cyan/40 transition-all overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-3xl group-hover:bg-brand-cyan/10 transition-colors pointer-events-none"></div>
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shadow-inner">
                                <HelpCircle size={28} />
                            </div>
                            {lesson.quiz?.questions?.length > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                                    <CheckCircle2 size={12} />
                                    <span>{t('admin_quiz_active')}</span>
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 leading-tight line-clamp-2">
                            {lesson.title || t(`lesson${lesson.id}_title`)}
                        </h3>

                        <div className="space-y-4 mb-10 text-sm font-medium">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-900 rounded-xl transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <HelpCircle size={16} />
                                    <span>{t('admin_quiz_questions')}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-black">{lesson.quiz?.questions?.length || 0}</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={() => handleEditQuiz(lesson)}
                                className="w-full py-4 bg-brand-cyan hover:bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-brand-cyan/10 flex items-center justify-center gap-2"
                            >
                                <span>{lesson.quiz?.questions?.length > 0 ? t('admin_quiz_edit') : t('admin_quiz_setup')}</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Quiz Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/90 backdrop-blur-md transition-all" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 transition-colors">
                        
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/20 transition-colors">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="text-brand-cyan">{t('admin_quiz_editor_title')}:</span>
                                    {selectedLesson?.title || t(`lesson${selectedLesson?.id}_title`)}
                                </h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-slate-500 text-sm font-medium">{t('admin_quiz_mgmt_subtitle')}</p>
                                    <button 
                                        onClick={() => setIsAiOpen(!isAiOpen)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isAiOpen 
                                            ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/20' 
                                            : 'bg-slate-100 dark:bg-dark-900 text-slate-500 border border-slate-200 dark:border-dark-700 hover:text-brand-cyan'
                                        }`}
                                    >
                                        <span className="text-brand-cyan animate-pulse"><Sparkles size={12} /></span>
                                        <span>{isAiOpen ? 'AI Panelni Yopish' : 'AI Assistant'}</span>
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-3 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* AI Assistant Panel - Ultra Premium Polish */}
                        {isAiOpen && (
                            <div className="mx-8 mt-10 relative group animate-in slide-in-from-top duration-500">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/40 via-emerald-500/40 to-brand-cyan/40 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000 pointer-events-none animate-pulse"></div>
                                <div className="relative p-[1px] bg-gradient-to-b from-white/40 dark:from-white/20 via-white/10 dark:via-white/5 to-transparent rounded-[2.5rem] overflow-hidden">
                                    <div className="bg-white dark:bg-[#0b1222]/95 backdrop-blur-[60px] rounded-[2rem] p-6 lg:p-8 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative group/icon">
                                                    <div className="absolute inset-0 bg-brand-cyan blur-2xl opacity-10"></div>
                                                    <div className="relative w-12 h-12 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-brand-cyan shadow-lg transition-colors">
                                                        <Sparkles size={24} strokeWidth={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Quiz Assistant</h3>
                                                        <span className="text-[8px] font-black text-brand-cyan uppercase tracking-widest border border-brand-cyan/30 px-1.5 rounded">PRO 2.5</span>
                                                    </div>
                                                    <p className="text-[12px] text-slate-500 font-medium mt-0.5 opacity-60">Mavzuni tahlil qilish va savollar yaratish moduli</p>
                                                </div>
                                            </div>
                                            <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Groq Engine Active</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 ml-1">Mavzu yoki kontekst</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Cisco OSPF, Security..."
                                                    className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white focus:border-brand-cyan outline-none transition-all font-bold h-[54px] shadow-inner"
                                                    value={aiConfig.topic}
                                                    onChange={(e) => setAiConfig({...aiConfig, topic: e.target.value})}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                                                <div className="lg:col-span-4 space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 ml-1">Qiyinchilik</label>
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setIsDiffDropdownOpen(!isDiffDropdownOpen)}
                                                            className={`w-full h-[54px] bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 flex items-center justify-between text-sm text-slate-900 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-900 shadow-inner ${isDiffDropdownOpen ? 'border-brand-cyan' : ''}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1 h-1 rounded-full ${aiConfig.difficulty === 'easy' ? 'bg-emerald-500' : aiConfig.difficulty === 'medium' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                                                <span className="font-bold">{currentDifficultyLabel}</span>
                                                            </div>
                                                            <ChevronRight size={14} className={isDiffDropdownOpen ? 'rotate-90' : ''} />
                                                        </button>
                                                        {isDiffDropdownOpen && (
                                                            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl">
                                                                {difficultyOptions.map((opt) => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => {
                                                                            setAiConfig({...aiConfig, difficulty: opt.value});
                                                                            setIsDiffDropdownOpen(false);
                                                                        }}
                                                                        className={`w-full px-4 py-3 text-left text-[11px] font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between ${aiConfig.difficulty === opt.value ? 'text-brand-cyan bg-brand-cyan/5' : 'text-slate-500 dark:text-slate-400'}`}
                                                                    >
                                                                        {opt.label}
                                                                        {aiConfig.difficulty === opt.value && <CheckCircle2 size={12} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-3 space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 ml-1 block text-center">Soni</label>
                                                    <input 
                                                        type="number" 
                                                        min="1" max="25"
                                                        className="w-full h-[54px] bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xl text-slate-900 dark:text-white focus:border-brand-cyan outline-none font-black text-center shadow-inner"
                                                        value={aiConfig.count}
                                                        onChange={(e) => setAiConfig({...aiConfig, count: parseInt(e.target.value) || 1})}
                                                    />
                                                </div>
                                                <div className="lg:col-span-5">
                                                    <button 
                                                        onClick={handleGenerateAI}
                                                        disabled={aiLoading}
                                                        className="group relative h-[54px] w-full bg-brand-cyan text-white font-black rounded-xl shadow-lg shadow-brand-cyan/20 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                                            {aiLoading ? <RefreshCcw size={18} className="animate-spin" /> : <><Wand2 size={18} /><span className="uppercase tracking-widest text-[11px]">AI BILAN YARATISH</span></>}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Questions List (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar transition-colors">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="relative bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-dark-700 rounded-3xl p-8 space-y-6 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 bg-brand-cyan text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-brand-cyan/20">{qIndex + 1}</span>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Question</h4>
                                        </div>
                                        <button onClick={() => removeQuestion(qIndex)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                    </div>
                                    <textarea 
                                        placeholder={t('admin_quiz_add_question')}
                                        className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-cyan outline-none transition-all min-h-[100px] resize-y shadow-inner"
                                        value={q.question}
                                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                    ></textarea>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="relative group">
                                                <input 
                                                    type="text"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    className={`w-full bg-white dark:bg-dark-800 border ${q.correctAnswer === oIndex ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-dark-700'} rounded-2xl py-4 pl-6 pr-14 text-slate-900 dark:text-white outline-none focus:border-brand-cyan transition-all shadow-inner`}
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => setCorrectAnswer(qIndex, oIndex)}
                                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${q.correctAnswer === oIndex ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-500 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700'}`}
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addQuestion} className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-[2rem] text-slate-400 dark:text-slate-500 hover:text-brand-cyan hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all group flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-dark-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Plus size={24} /></div>
                                <span className="font-black uppercase tracking-widest text-xs">{t('admin_quiz_add_question')}</span>
                            </button>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-950/20 flex justify-end gap-4 transition-colors">
                            <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:text-slate-900 dark:hover:text-white transition-all">{t('admin_quiz_discard')}</button>
                            <button onClick={handleSaveQuiz} className="px-10 py-4 bg-brand-cyan text-white font-black rounded-2xl shadow-xl shadow-brand-cyan/25 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                                <Save size={20} />
                                <span>{t('admin_quiz_save')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default QuizManagement;
