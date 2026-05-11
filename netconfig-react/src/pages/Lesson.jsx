import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Play, Pause, Lock, Download, Clock, Volume2, VolumeX, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import screenfull from 'screenfull';
import progressService from '../services/progressService';

const Lesson = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, getIdToken } = useAuth();
    
    const [lesson, setLesson] = useState(null);
    const [lessons, setLessons] = useState([]); // Sidebar uchun barcha darslar
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizScore, setQuizScore] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    
    // Video Player States
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState({ played: 0, playedSeconds: 0 });
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playerError, setPlayerError] = useState(null);
    const [ytApiLoaded, setYtApiLoaded] = useState(!!window.YT);
    
    const playerRef = React.useRef(null);
    const playerContainerRef = React.useRef(null);
    const lastTimeRef = React.useRef(0);
    const timerRef = React.useRef(null);
    const apiLoadingRef = React.useRef(false);
    
    // Play/Pause boshqaruvi (Moved up to fix ReferenceError)
    // Play/Pause boshqaruvi
    function togglePlay() {
        // Bunny videosi bo'lsa
        if (videoData?.type === 'bunny') {
            setIsPlaying(!isPlaying);
            return;
        }

        // YouTube videosi bo'lsa
        if (videoData?.type === 'youtube' && playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
            try {
                const state = playerRef.current.getPlayerState();
                if (state === 1) { // 1 = PLAYING
                    playerRef.current.pauseVideo();
                    setIsPlaying(false);
                } else {
                    playerRef.current.playVideo();
                    setIsPlaying(true);
                }
            } catch (e) {
                console.error("YouTube toggle error:", e);
            }
            return;
        }

        // Agar hech qaysi bo'lmasa (yuklanish holati)
        console.warn("Player not ready or unsupported type");
    }
    
    // Darsni va Sidebar ro'yxatini yuklash
    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                setLoading(true);
                setPlayerError(null);
                
                // Reset states for new lesson
                setIsCompleted(false);
                setQuizScore(null);
                setQuizStarted(false);
                setQuizFinished(false);
                setUserAnswers({});
                setCurrentQuestionIndex(0);
                
                // Reset Video Player States
                setIsPlaying(false);
                setProgress({ played: 0, playedSeconds: 0 });
                setDuration(0);
                lastTimeRef.current = 0;

                // 1. Tanlangan darsni olish
                const found = await apiService.getLessonById(id);
                setLesson(found);
                
                // 2. Sidebar uchun barcha darslarni olish (faqat bir marta)
                if (lessons.length === 0) {
                    const allLessons = await apiService.getLessons();
                    setLessons(allLessons);
                }

                // Load saved progress for this user/lesson
                if (user?.uid) {
                    const userProgress = progressService.getUserProgress(user.uid);
                    const lessonProgress = userProgress[id];
                    if (lessonProgress) {
                        if (lessonProgress.completed) setIsCompleted(true);
                        if (lessonProgress.score !== undefined) setQuizScore(lessonProgress.score);
                    }
                }
            } catch (err) {
                console.error("Lesson fetch error:", err);
                setPlayerError("Failed to load lesson. Please try again.");
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonData();

        // YouTube API scriptni yuklash (once only, avoid duplicates)
        if (!ytApiLoaded && !apiLoadingRef.current) {
            apiLoadingRef.current = true;
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;
            tag.defer = true;
            tag.onerror = () => {
                console.error("Failed to load YouTube API");
                setPlayerError("Failed to load video player. Please check your internet connection.");
                apiLoadingRef.current = false;
            };
            
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            
            // Handle API ready event
            window.onYouTubeIframeAPIReady = () => {
                setYtApiLoaded(true);
                apiLoadingRef.current = false;
            };
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [id, navigate, user?.uid]);

    

    // Video turini aniqlash va formatlash
    const getEmbedUrl = (url) => {
        if (!url) return null;
        
        // 1. YouTube qat'iy tekshiruvi
        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        if (isYouTube) {
            const ytMatch = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/);
            if (ytMatch) {
                return {
                    type: 'youtube',
                    id: ytMatch[1],
                    url: `https://www.youtube.com/watch?v=${ytMatch[1]}`
                };
            }
        }

        // 2. Bunny.net qat'iy tekshiruvi
        const isBunny = url.includes('mediadelivery.net') || url.includes('bunny.net');
        if (isBunny) {
            // Ham /embed/ ham /play/ formatlarini qo'llab-quvvatlash
            const bunnyMatch = url.match(/(?:embed|play)\/(\d+)\/([a-f0-9-]+)/);
            if (bunnyMatch) {
                return {
                    type: 'bunny',
                    libraryId: bunnyMatch[1],
                    videoId: bunnyMatch[2],
                    url: `https://iframe.mediadelivery.net/embed/${bunnyMatch[1]}/${bunnyMatch[2]}`
                };
            }
        }

        return { type: 'other', url: url };
    };

    const videoData = lesson?.videoUrl ? getEmbedUrl(lesson.videoUrl) : null;
    // YouTube Player Initialization
    useEffect(() => {
        if (!videoData || videoData.type !== 'youtube' || !ytApiLoaded) return;

        let retryCount = 0;
        const maxRetries = 15;
        let retryTimeoutId = null;

        const initPlayer = () => {
            try {
                if (!window.YT || !window.YT.Player) {
                    console.error("YouTube API not ready");
                    return;
                }

                if (playerRef.current) {
                    try { 
                        playerRef.current.destroy(); 
                    } catch (e) {
                        console.warn("Error destroying previous player:", e);
                    }
                }

                const videoId = videoData?.url?.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/)?.[1];
                
                if (!videoId) {
                    console.error("Could not extract video ID from URL:", videoData.url);
                    setPlayerError("Invalid video URL. Please contact support.");
                    return;
                }

                const playerContainer = document.getElementById('youtube-player');
                if (!playerContainer) {
                    // Retry if container not found (DOM not ready yet)
                    if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = Math.min(100 * Math.pow(1.3, retryCount - 1), 2000);
                        retryTimeoutId = setTimeout(initPlayer, delay);
                    } else {
                        console.error("Player container not found after maximum retries");
                        setPlayerError("Failed to load video player. Please refresh the page.");
                    }
                    return;
                }

                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId: videoId,
                    playerVars: {
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        disablekb: 0,
                        fs: 1,
                        autohide: 1
                    },
                    events: {
                        onReady: (event) => {
                            try {
                                const dur = event.target.getDuration();
                                if (dur > 0) setDuration(dur);
                            } catch (e) {
                                console.error("Error getting duration:", e);
                            }
                        },
                        onStateChange: (event) => {
                            try {
                                if (event.data === window.YT.PlayerState.PLAYING) {
                                    setIsPlaying(true);
                                    startTimer();
                                } else if (event.data === window.YT.PlayerState.PAUSED) {
                                    setIsPlaying(false);
                                    stopTimer();
                                } else if (event.data === window.YT.PlayerState.ENDED) {
                                    setIsPlaying(false);
                                    stopTimer();
                                }
                            } catch (e) {
                                console.error("Error in state change handler:", e);
                            }
                        },
                        onError: (event) => {
                            console.error("YouTube player error:", event.data);
                            let errorMsg = "Video player error";
                            switch(event.data) {
                                case 2: errorMsg = "Invalid video ID"; break;
                                case 5: errorMsg = "Video player error (HTML5)"; break;
                                case 100: errorMsg = "Video not found"; break;
                                case 101:
                                case 150: errorMsg = "This video cannot be played"; break;
                            }
                            setPlayerError(errorMsg);
                        }
                    }
                });
            } catch (e) {
                console.error("Player initialization error:", e);
                setPlayerError("Failed to initialize video player. Please refresh the page.");
            }
        };

        const startTimer = () => {
            stopTimer();
            timerRef.current = setInterval(() => {
                try {
                    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                        const currentTime = playerRef.current.getCurrentTime();
                        const dur = playerRef.current.getDuration();
                        
                        if (dur <= 0) return; // Duration not ready yet
                        
                        // Anti-skip logic (From Guide)
                        const isAdmin = user?.role === 'admin';
                        if (!isCompleted && !isAdmin) {
                            if (currentTime > lastTimeRef.current + 2) {
                                try {
                                    playerRef.current.seekTo(lastTimeRef.current, true);
                                } catch (e) {
                                    console.warn("Seek error:", e);
                                }
                            } else if (currentTime > lastTimeRef.current) {
                                lastTimeRef.current = currentTime;
                            }
                        }

                        setProgress({
                            played: currentTime / dur,
                            playedSeconds: currentTime
                        });
                    }
                } catch (e) {
                    console.error("Timer update error:", e);
                }
            }, 500);
        };

        const stopTimer = () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            stopTimer();
            if (retryTimeoutId) clearTimeout(retryTimeoutId);
        };
    }, [videoData, id, isCompleted, user?.role, ytApiLoaded]);



    // Volume boshqaruvi
    useEffect(() => {
        if (!playerRef.current) return;
        
        try {
            // Handle HTML5 video player
            if (playerRef.current instanceof HTMLVideoElement) {
                playerRef.current.volume = isMuted ? 0 : Math.min(1, volume);
                return;
            }
            
            // Handle YouTube player
            if (typeof playerRef.current.setVolume === 'function') {
                const volumeLevel = isMuted ? 0 : Math.round(volume * 100);
                playerRef.current.setVolume(volumeLevel);
            }
        } catch (e) {
            console.warn("Error setting volume:", e);
        }
    }, [isMuted, volume]);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuizFinished(false);
    };

    const handleRetakeQuiz = () => {
        setQuizScore(null);
        handleStartQuiz();
    };

    const handleAnswerSelect = (optionIndex) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (lesson.quiz.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleFinishQuiz();
        }
    };

    const handleFinishQuiz = () => {
        const questions = lesson.quiz.questions || [];
        let correctCount = 0;
        
        questions.forEach((q, index) => {
            if (userAnswers[index] == q.correctAnswer || userAnswers[index] == q.correct) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);
        setQuizScore(score);
        setQuizFinished(true);
        setQuizStarted(false);
        
        if (user?.uid) {
            // Get existing progress to see if it was already completed
            const currentProgress = progressService.getUserProgress(user.uid)[id] || {};
            const alreadyCompleted = currentProgress.completed;
            
            progressService.saveProgress(user.uid, id, { 
                completed: alreadyCompleted || score >= 60, 
                score: score 
            });
            
            // Sinxronizatsiya: Backendga saqlash
            getIdToken().then(token => {
                apiService.saveProgress(id, { 
                    completed: alreadyCompleted || score >= 60, 
                    score: score 
                }, token).catch(console.error);
            });
            
            if (score >= 60 || alreadyCompleted) {
                setIsCompleted(true);
            }
        } else if (score >= 60) {
            setIsCompleted(true);
        }
    };

    const nextId = parseInt(id) + 1;
    const prevId = parseInt(id) - 1;
    const hasNext = (lessons || []).some(l => parseInt(l.id) === nextId);
    const hasPrev = (lessons || []).some(l => parseInt(l.id) === prevId);
    
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900 text-slate-900 dark:text-white transition-colors font-bold text-xl">{t('loading_api') || 'Loading API data...'}</div>;
    if (!lesson) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900 text-slate-900 dark:text-white transition-colors font-bold text-xl">{t('lesson_not_found') || 'Lesson not found.'}</div>;
    
    return (
        <div className="min-h-screen bg-white dark:bg-dark-900 border-x border-slate-200 dark:border-dark-800 transition-colors">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">
                
                {/* Main Content Area */}
                <div className="flex-1 lg:pr-8 p-4 sm:p-8 lg:border-r border-slate-100 dark:border-dark-700/50">
                    
                    <Link to="/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-electric transition-colors mb-6 font-medium">
                        <ArrowLeft size={18} />
                        {t('back_to_lessons') || 'Back to lessons'}
                    </Link>

                    {/* Premium Video Player Section (From Guide) */}
                    <div className="bg-black aspect-video rounded-3xl overflow-hidden mb-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_80px_rgba(0,180,255,0.1)] relative group border border-slate-200 dark:border-dark-700 select-none">
                        {playerError && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 rounded-3xl">
                                <div className="text-center">
                                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                                    <p className="text-red-400 font-bold text-lg mb-4">{playerError}</p>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Refresh Page
                                    </button>
                                </div>
                            </div>
                        )}

                        {(videoData?.type === 'youtube' || videoData?.type === 'bunny') ? (
                            <div 
                                ref={playerContainerRef}
                                className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden"
                            >
                                {videoData?.type === 'youtube' && (
                                    <div id="youtube-player" className="w-full h-full"></div>
                                )}

                                {videoData?.type === 'bunny' && (
                                    <iframe 
                                        src={videoData.url}
                                        loading="lazy" 
                                        style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} 
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" 
                                        allowFullScreen={true}
                                    />
                                )}
                            </div>
                        ) : videoData?.type === 'video' ? (
                            <div 
                                ref={playerContainerRef}
                                className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden"
                            >
                                {/* HTML5 Video Player for Local Videos */}
                                <video
                                    ref={playerRef}
                                    className="w-full h-full object-contain"
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => {
                                        setIsPlaying(false);
                                        if (timerRef.current) clearInterval(timerRef.current);
                                    }}
                                    onTimeUpdate={(e) => {
                                        const currentTime = e.currentTarget.currentTime;
                                        const duration = e.currentTarget.duration;
                                        
                                        if (duration > 0) {
                                            setDuration(duration);
                                            setProgress({
                                                played: currentTime / duration,
                                                playedSeconds: currentTime
                                            });
                                        }
                                    }}
                                    onLoadedMetadata={(e) => {
                                        setDuration(e.currentTarget.duration);
                                    }}
                                    onError={(e) => {
                                        console.error("Video error:", e);
                                        setPlayerError("Failed to load video. Please check the file path or your internet connection.");
                                    }}
                                    controls={false}
                                    crossOrigin="anonymous"
                                >
                                    <source src={videoData.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Transparent Click Overlay */}
                                <div 
                                    className="absolute inset-0 z-20 cursor-pointer bg-transparent"
                                    onClick={togglePlay}
                                />

                                {/* Custom Poster (Before play) */}
                                {!isPlaying && progress.playedSeconds === 0 && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900 pointer-events-none transition-all">
                                        <img 
                                            src={lesson?.thumbnail || ''} 
                                            alt={lesson?.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/80"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center p-8 animate-in fade-in zoom-in duration-700">
                                            <div className="w-24 h-24 bg-electric/90 text-white rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(0,180,255,0.6)] backdrop-blur-md">
                                                <Play size={48} className="ml-2" fill="currentColor" />
                                            </div>
                                            <h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-2xl max-w-2xl mb-3 tracking-tight">{lesson?.title}</h3>
                                            <p className="text-blue-200 font-bold tracking-[0.3em] uppercase text-xs opacity-80">Darsni boshlash uchun bosing</p>
                                        </div>
                                    </div>
                                )}

                                {/* Custom Control Panel (Appears on hover) */}
                                <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-40 transition-all duration-500 ease-out ${isPlaying ? 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0' : 'opacity-100'}`}>
                                    {/* Progress Bar */}
                                    <div 
                                        className={`w-full h-1.5 bg-white/20 rounded-full mb-6 relative group/progress transition-all cursor-pointer hover:h-2.5`}
                                        onClick={(e) => {
                                            try {
                                                const bounds = e.currentTarget.getBoundingClientRect();
                                                const percent = (e.clientX - bounds.left) / bounds.width;
                                                const seekTime = percent * duration;
                                                
                                                if (seekTime >= 0 && seekTime <= duration && playerRef.current) {
                                                    playerRef.current.currentTime = seekTime;
                                                }
                                            } catch (e) {
                                                console.error("Seek error:", e);
                                            }
                                        }}
                                    >
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-electric rounded-full shadow-[0_0_15px_rgba(0,180,255,0.8)] transition-all duration-300"
                                            style={{ width: `${progress.played * 100}%` }}
                                        />
                                        <div 
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"
                                            style={{ left: `${progress.played * 100}%` }}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-8">
                                            <button onClick={togglePlay} className="hover:text-electric transform hover:scale-110 active:scale-90 transition-all">
                                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                            </button>
                                            
                                            <div className="flex items-center gap-3 group/vol">
                                                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-electric transition-colors">
                                                    {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                                </button>
                                                <input 
                                                    type="range" min="0" max="1" step="0.1" 
                                                    value={volume} onChange={(e) => {
                                                        const newVolume = parseFloat(e.target.value);
                                                        setVolume(newVolume);
                                                        if (playerRef.current) {
                                                            playerRef.current.volume = isMuted ? 0 : newVolume;
                                                        }
                                                    }}
                                                    className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-electric h-1 rounded-full overflow-hidden opacity-0 group-hover:opacity-100"
                                                />
                                            </div>

                                            <div className="text-[0.7rem] font-black tracking-[0.2em] font-mono flex items-center gap-3">
                                                <span className="text-electric">{Math.floor(progress.playedSeconds / 60)}:{(Math.floor(progress.playedSeconds % 60)).toString().padStart(2, '0')}</span>
                                                <span className="opacity-30">/</span>
                                                <span className="opacity-60">{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                try {
                                                    if (screenfull.isEnabled && playerContainerRef.current) {
                                                        screenfull.toggle(playerContainerRef.current).catch(err => {
                                                            console.error("Fullscreen toggle error:", err);
                                                        });
                                                        setIsFullscreen(prev => !prev);
                                                    }
                                                } catch (e) {
                                                    console.error("Fullscreen error:", e);
                                                }
                                            }} 
                                            className="hover:text-electric transition-all hover:rotate-12"
                                        >
                                            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-4">
                                <RefreshCw className="text-electric animate-spin" size={40} />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Video yuklanmoqda...</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Info */}
                    <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm dark:shadow-xl transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="text-electric text-xs font-bold uppercase tracking-wider mb-2">
                                    {t('module') || 'Module'} {Math.ceil(lesson.id / 3)} • {t('lesson') || 'Lesson'} {lesson.id}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {lesson.title || t(`lesson${lesson.id}_title`)}
                                </h1>
                            </div>
                            
                             <div className="flex shrink-0">
                                {isCompleted ? (
                                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-[0_4px_15px_rgba(34,197,94,0.3)]">
                                        <CheckCircle size={20} fill="currentColor" className="text-white" /> 
                                        {t('badge_mastered') || 'Mastered'}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-dark-700 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl font-bold border border-slate-200 dark:border-dark-600">
                                        <Clock size={20} className="text-slate-400" /> 
                                        {t('complete_quiz_to_master') || "Testni yechib o'zlashtiring"}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                            {lesson.description}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-dark-700">
                            {hasPrev ? (
                                <Link to={`/dashboard/lesson/${prevId}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 px-4 py-2 rounded-lg font-medium shadow-sm">
                                    <ChevronLeft size={18} /> {t('previous') || 'Previous'}
                                </Link>
                            ) : <div></div>}
                            
                            {hasNext && (
                                (isCompleted || user?.role === 'admin') ? (
                                    <Link to={`/dashboard/lesson/${nextId}`} className="flex items-center gap-2 text-white hover:text-white transition-colors bg-electric hover:bg-blue-500 px-5 py-2 rounded-lg font-bold shadow-lg shadow-electric/20">
                                        {t('next') || 'Keyingi'} <ChevronRight size={18} />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-400 bg-slate-100 dark:bg-dark-800 px-5 py-2 rounded-lg font-bold border border-slate-200 dark:border-dark-700 cursor-not-allowed opacity-70">
                                        {t('next') || 'Keyingi'} <Lock size={16} />
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div className="space-y-8">
                        {lesson.quiz && (
                            <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl transition-colors">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="text-2xl">📝</span> {t('test_knowledge') || 'Test Your Knowledge'}
                                </h2>
                                
                                {!quizStarted && !quizFinished && quizScore === null ? (
                                    <div className="bg-slate-50/50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-700 rounded-xl p-6 text-center transition-colors">
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{t('quiz_description') || "Test what you've learned in this lesson. You can retake this quiz at any time."}</p>
                                        <button 
                                            onClick={handleStartQuiz}
                                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-purple-600/20"
                                        >
                                            {t('start_quiz') || 'Start Quiz Now'}
                                        </button>
                                    </div>
                                ) : quizStarted && !quizFinished ? (
                                    <div className="bg-slate-50/50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-700 rounded-xl p-6 transition-colors">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[0.65rem]">
                                                {t('question_count') || 'Question'} {currentQuestionIndex + 1} {t('of') || 'of'} {lesson.quiz.questions.length}
                                            </span>
                                            <div className="h-1.5 w-32 bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-purple-500 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                                                    style={{ width: `${((currentQuestionIndex + 1) / (lesson.quiz.questions?.length || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl text-slate-900 dark:text-white font-semibold mb-8 leading-snug">
                                            {lesson.quiz.questions?.[currentQuestionIndex]?.question}
                                        </h3>
                                        
                                        <div className="grid gap-3 mb-8">
                                            {lesson.quiz.questions?.[currentQuestionIndex]?.options?.map((opt, i) => {
                                                const isSelected = userAnswers[currentQuestionIndex] === i;
                                                return (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => handleAnswerSelect(i)}
                                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                                            isSelected 
                                                                ? 'bg-purple-600/10 border-purple-500 text-purple-700 dark:text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                                                                : 'bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700 hover:border-slate-300 dark:hover:border-dark-500'
                                                        }`}
                                                    >
                                                        <span className="font-medium">{opt}</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                                                            isSelected ? 'bg-purple-500 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'border-slate-200 dark:border-dark-500 group-hover:border-slate-300 dark:group-hover:border-dark-400'
                                                        }`}>
                                                            {isSelected && <div className="w-full h-full flex items-center justify-center text-[10px] text-white">✓</div>}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-dark-700">
                                            <button 
                                                onClick={handleNextQuestion} 
                                                disabled={userAnswers[currentQuestionIndex] === undefined}
                                                className={`font-bold px-8 py-3 rounded-xl transition-all ${
                                                    userAnswers[currentQuestionIndex] !== undefined
                                                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
                                                        : 'bg-slate-100 dark:bg-dark-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {currentQuestionIndex === (lesson.quiz.questions?.length || 1) - 1 ? (t('finish_submit') || 'Finish & Submit') : (t('next_question') || 'Next Question')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`rounded-xl p-8 text-center relative overflow-hidden border shadow-sm ${
                                        quizScore >= 60 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
                                    }`}>
                                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                                            quizScore >= 60 ? 'from-green-500 to-emerald-400' : 'from-red-500 to-rose-400'
                                        }`}></div>
                                        <h3 className={`text-2xl font-black mb-2 ${quizScore >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                                            {quizScore >= 60 ? (t('quiz_completed') || 'Quiz Completed!') : (t('quiz_failed') || 'Quiz Failed')}
                                        </h3>
                                        <div className={`text-5xl font-extrabold mb-4 ${
                                            quizScore >= 60 ? 'text-green-500' : 'text-red-500'
                                        }`}>{quizScore}%</div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
                                            {quizScore >= 60 
                                                ? (t('quiz_pass_msg') || "Excellent work! You have mastered the concepts of this lesson.")
                                                : (t('quiz_fail_msg') || "You need at least 60% to master this lesson. Please try again.")
                                            }
                                        </p>
                                        <button 
                                            onClick={handleRetakeQuiz}
                                            className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
                                        >
                                            {t('retake_quiz') || 'Retake Quiz'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lab Section */}
                        {lesson.labWork && (
                            <div className="bg-white dark:bg-dark-800 border p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-xl border-t-4 border-t-electric border-x-slate-200 dark:border-x-dark-700 border-b-slate-200 dark:border-b-dark-700 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-blue-500/10 text-electric rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                        <span className="text-3xl">🔬</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('lab_work_title') || 'Laboratory Work'}</h2>
                                        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg mb-2">{lesson.labWork.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{lesson.labWork.description}</p>
                                        <a 
                                            href={(lesson.labWork.downloadUrl || lesson.labWork.downloadLink)} 
                                            download 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95"
                                        >
                                            <Download size={18} /> {t('download_assignment') || 'Download Assignment'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Course Curriculum */}
                <div className="lg:w-96 p-4 sm:p-8 shrink-0">
                    <div className="sticky top-24 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 pb-4 border-b border-slate-100 dark:border-dark-700 transition-colors">
                            {t('course_content_title') || 'Course Content'}
                        </h3>
                        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                             {(lessons || []).map((l, index) => {
                                const active = parseInt(l.id) === parseInt(id);
                                const userProgress = progressService.getUserProgress(user?.uid);
                                
                                // Lock logic: lesson N is unlocked if Lesson N-1 is completed OR if user is admin
                                const isAdmin = user?.role === 'admin';
                                const prevLessonId = parseInt(l.id) - 1;
                                const prevCompleted = prevLessonId > 0 ? userProgress[prevLessonId]?.completed : true;
                                const isLocked = !user; 
                                const isUnreachable = user && !prevCompleted && !active && !isAdmin;
                                const lCompleted = userProgress[l.id]?.completed;
                                
                                return (
                                    <Link 
                                        key={l.id} 
                                        to={(isLocked || isUnreachable) ? '#' : `/dashboard/lesson/${l.id}`}
                                        className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                            active 
                                              ? 'bg-electric/5 dark:bg-electric/10 border-electric/40 shadow-inner' 
                                              : (isLocked || isUnreachable)
                                                ? 'bg-slate-100 dark:bg-dark-900 border-transparent opacity-40 cursor-not-allowed' 
                                                : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 hover:border-blue-200 dark:hover:border-dark-500 hover:bg-slate-50 dark:hover:bg-dark-800 shadow-sm transition-colors'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                                                active ? 'bg-electric text-white shadow-lg shadow-electric/30' : (lCompleted ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-100 dark:bg-dark-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-dark-600')
                                            }`}>
                                                {lCompleted && !active ? <CheckCircle size={16} /> : l.id}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[0.8rem] font-bold line-clamp-1 transition-colors ${active ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-electric dark:group-hover:text-slate-200'}`}>
                                                    {l.title}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[0.6rem] text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-dark-700 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter border border-slate-200 dark:border-dark-600 transition-colors">
                                                        {l.duration}
                                                    </span>
                                                    {lCompleted && <span className="text-[0.6rem] text-green-500 font-bold uppercase">{t('status_mastered') || 'O\'zlashtirildi'}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {(isLocked || isUnreachable) && <Lock size={14} className="text-slate-600 shrink-0" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Lesson;
