import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Music, Pause, Settings, Unlock, Play } from 'lucide-react';
import ReactPlayer from 'react-player';
import { AppConfig } from '../types';
import { getDirectImageUrl } from '../utils';

interface HomeViewProps {
  config: AppConfig;
  onAdminClick: () => void;
}

export default function HomeView({ config, onAdminClick }: HomeViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isYoutube = config.musicUrl && (config.musicUrl.includes('youtube.com') || config.musicUrl.includes('youtu.be'));

  const toggleMusic = () => {
    if (isYoutube && !isReady) return;
    
    if (!isYoutube && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Audio error", e);
          setIsPlaying(false);
        });
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 pb-20 text-zinc-100">
      {/* Dynamic gradients in background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500/30"
            initial={{
              y: '100vh',
              x: Math.random() * window.innerWidth,
              scale: Math.random() * 0.5 + 0.5,
              rotate: 0,
            }}
            animate={{
              y: '-20vh',
              rotate: 360,
              x: `calc(${Math.random() * 100}vw)`,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 10,
            }}
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10">
        {/* Header Admin Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onAdminClick}
            className="p-3 bg-zinc-900/80 backdrop-blur rounded-full shadow-sm text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-800"
            title="Edit Content"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-rose-500 mb-6 leading-tight drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
            {config.title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-medium">
            {config.heroMessage}
          </p>
        </motion.div>

        {/* Spotify-style Music Player */}
        {config.musicUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-zinc-900/60 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 max-w-sm mx-auto border border-zinc-800/80 shadow-[0_4px_30px_rgba(225,29,72,0.15)] mb-20"
          >
            {isYoutube ? (
              <div className="fixed bottom-0 left-0 w-32 h-32 opacity-0 pointer-events-none z-[-1] overflow-hidden">
                <ReactPlayer 
                  url={getDirectImageUrl(config.musicUrl)} 
                  playing={isPlaying} 
                  loop={true} 
                  width="100%" 
                  height="100%" 
                  playsinline 
                  volume={1}
                  onReady={() => setIsReady(true)}
                  onError={(e) => console.error('Player error:', e)}
                  config={{ 
                    youtube: { 
                      playerVars: { 
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0
                      } 
                    } 
                  }}
                />
              </div>
            ) : (
              <audio 
                ref={audioRef}
                src={getDirectImageUrl(config.musicUrl)} 
                loop 
                playsInline
                onCanPlay={() => setIsReady(true)}
              />
            )}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center">
              {config.gallery.find(u => u.trim() !== '') ? (
                <img 
                  src={getDirectImageUrl(config.gallery.find(u => u.trim() !== '')!)} 
                  alt="Album Art" 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all ${isPlaying ? 'animate-[spin_8s_linear_infinite] scale-110' : ''}`} 
                />
              ) : (
                <Music className="text-zinc-500" size={24} />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-zinc-100 font-semibold truncate">Lagu Kenangan Kita</h3>
              <p className="text-rose-400 text-xs font-medium">Happy 27th Mensive</p>
            </div>
            <button 
              onClick={toggleMusic} 
              className="w-12 h-12 flex-shrink-0 bg-rose-600 rounded-full flex items-center justify-center text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all hover:scale-105"
            >
              {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} className="ml-1" />}
            </button>
          </motion.div>
        )}

        {/* Secret Message Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-md mx-auto mb-24 cursor-pointer"
        >
          <div 
            onClick={() => setSecretRevealed(!secretRevealed)}
            className="bg-zinc-900/80 backdrop-blur rounded-3xl p-8 shadow-[0_0_20px_rgba(225,29,72,0.1)] text-center border border-zinc-800 hover:border-rose-500/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <AnimatePresence mode="wait">
              {!secretRevealed ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-rose-400"
                >
                  <div className="p-4 bg-rose-500/10 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                    <Heart size={48} className="animate-pulse" fill="currentColor" />
                  </div>
                  <p className="text-lg">Klik untuk membuka pesan rahasia...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Unlock size={32} className="text-rose-500 mb-2 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                  <p className="text-2xl text-rose-500 font-bold italic leading-relaxed">
                    "{config.secretMessage}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Custom Message Boxes */}
        {config.boxMessages.length > 0 && (
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center text-rose-500 mb-12 drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]">Catatan Untuk Kita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.boxMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-zinc-900/80 backdrop-blur p-6 rounded-2xl border border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-rose-500/30 transition-colors"
                >
                  <h3 className="font-bold text-rose-500 text-xl mb-3">{msg.title}</h3>
                  <p className="text-zinc-300 leading-relaxed">{msg.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {config.gallery.filter(u => u.trim() !== '').length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center text-rose-500 mb-12 drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]">Kenangan Kita</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {config.gallery.filter(u => u.trim() !== '').map((url, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-zinc-800"
                >
                  <img 
                    src={getDirectImageUrl(url)} 
                    alt={`Memory ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
