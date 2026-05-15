import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService, { BASE_URL } from '../services/api';
import { Play, Loader2, Video, X, Maximize2 } from 'lucide-react';

const PracticalClips = () => {
  const { t } = useTranslation();
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Video turini aniqlash va formatlash (Lesson.jsx dan olindi)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // 1. YouTube
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYouTube) {
      const ytMatch = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/);
      if (ytMatch) {
        return {
          type: 'youtube',
          id: ytMatch[1],
          url: `https://www.youtube.com/embed/${ytMatch[1]}`
        };
      }
    }

    // 2. Bunny.net
    const isBunny = url.includes('mediadelivery.net') || url.includes('bunny.net');
    if (isBunny) {
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

    // 3. Local/Internal
    if (url.startsWith('/uploads')) {
      return { type: 'local', url: `${BASE_URL}${url}` };
    }

    return { type: 'other', url: url };
  };

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        const data = await apiService.getClips();
        setClips(data);
      } catch (error) {
        console.error("Failed to fetch clips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 border-x border-slate-200 dark:border-dark-800 transition-colors">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-dark-700/50 bg-white/50 dark:bg-dark-800/30 pt-8 pb-4 px-4 sm:px-6 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <span className="text-brand-cyan"><Video size={36} /></span>
              <span>Amaliy lavhalar</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Tarmoq qurilmalari va texnologiyalari haqida haqiqiy hayotdan olingan qisqa videolar.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-cyan" size={48} />
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-700">
            <Video size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hozircha videolar yo'q</h3>
            <p className="text-slate-500 dark:text-slate-400">Tez orada bu yerga yangi videolar joylanadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...clips].reverse().map((clip) => (
              <div 
                key={clip.id} 
                className="group relative bg-white dark:bg-dark-800 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-dark-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
                onClick={() => setSelectedVideo(clip)}
              >
                
                {/* Video Preview Container (9:16) */}
                <div className="relative w-full aspect-[9/16] bg-slate-900 overflow-hidden">
                  {(() => {
                    const videoData = getEmbedUrl(clip.videoUrl);
                    if (videoData.type === 'local') {
                      return (
                        <video 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                          preload="metadata"
                        >
                          <source src={videoData.url} type="video/mp4" />
                        </video>
                      );
                    } else {
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 transition-transform duration-700 group-hover:scale-110">
                          <Video size={48} className="text-slate-700 opacity-50" />
                        </div>
                      );
                    }
                  })()}

                  {/* Top Glass Header */}
                  <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/70 to-transparent z-10">
                    <h3 className="font-bold text-white text-base leading-tight line-clamp-2 drop-shadow-lg">
                      {clip.title}
                    </h3>
                  </div>

                  {/* Bottom Description Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 opacity-100 group-hover:from-black/90 transition-all duration-300">
                    <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                      {clip.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        {getEmbedUrl(clip.videoUrl).type === 'local' ? 'Lokal Lavha' : 'Bulutli Lavha'}
                      </span>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                      <Play fill="currentColor" size={32} />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Video Modal (Lightbox) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 p-4 sm:p-10">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:rotate-90 z-[110]"
          >
            <X size={28} />
          </button>

          <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center gap-6">
            <div className="relative w-full max-h-[85vh] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {(() => {
                const videoData = getEmbedUrl(selectedVideo.videoUrl);
                if (videoData.type === 'local') {
                  return (
                    <video 
                      autoPlay
                      controls
                      className="w-full h-full object-contain"
                      controlsList="nodownload"
                    >
                      <source src={videoData.url} type="video/mp4" />
                    </video>
                  );
                } else {
                  return (
                    <iframe 
                      src={videoData.url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  );
                }
              })()}
            </div>
            
            <div className="text-center max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-white mb-2">{selectedVideo.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PracticalClips;
