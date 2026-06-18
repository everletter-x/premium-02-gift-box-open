import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useConfigLoader } from '../shared';

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  musicAutoplay: boolean;
  template: string;
  captions: string[];
  closing: string;
}

const themeColors: Record<string, { bg: string; accent: string; text: string; glow: string }> = {
  pink: { bg: 'bg-pink-soft', accent: 'bg-rose', text: 'text-dark-luxury', glow: 'shadow-pink-soft' },
  lavender: { bg: 'bg-lavender', accent: 'bg-lavender', text: 'text-dark-luxury', glow: 'shadow-lavender' },
  gold: { bg: 'bg-starlight-glow', accent: 'bg-gold-accent', text: 'text-dark-luxury', glow: 'shadow-gold-accent' },
};

export default function GiftBoxOpen() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json');
  const [boxState, setBoxState] = useState<'closed' | 'opening' | 'revealed'>('closed');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = themeColors[config?.theme || 'pink'] || themeColors.pink;

  useEffect(() => {
    if (config?.music) {
      audioRef.current = new Audio(`/${config.music}`);
      audioRef.current.loop = true;
      if (config.musicAutoplay) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [config]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(prev => !prev);
    }
  };

  const handleOpen = () => {
    if (boxState === 'closed') {
      setBoxState('opening');
      setTimeout(() => setBoxState('revealed'), 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-dark-luxury">Loading...</div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-dark-luxury">Gagal memuat konfigurasi</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title} - EverLetter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className={`min-h-screen ${colors.bg} ${colors.text} overflow-hidden`}>
        <AnimatePresence mode="wait">
          {boxState === 'closed' && (
            <motion.div
              key="closed"
              className="min-h-screen flex flex-col items-center justify-center cursor-pointer px-4"
              role="button"
              tabIndex={0}
              onClick={handleOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-8xl md:text-9xl mb-8"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.1, y: -20 }}
                whileTap={{ scale: 0.95 }}
              >
                🎁
              </motion.div>
              <motion.p
                className="text-xl md:text-2xl font-light tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Buka hadiahnya ya.
              </motion.p>
              <motion.p
                className="text-sm mt-4 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
              >
                Klik untuk membuka
              </motion.p>
            </motion.div>
          )}

          {boxState === 'opening' && (
            <motion.div
              key="opening"
              className="min-h-screen flex items-center justify-center relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-starlight-glow via-transparent to-transparent" />
              </motion.div>

              <motion.div
                className="text-8xl md:text-9xl relative z-10"
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: -200,
                  rotate: 180,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                🎁
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-starlight-glow"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 3, 5],
                  opacity: [0, 0.8, 0],
                }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />
            </motion.div>
          )}

          {boxState === 'revealed' && (
            <motion.div
              key="revealed"
              className="min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {config.title}
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl mb-12 opacity-80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Untuk {config.recipient}
                </motion.p>

                <motion.div
                  className="max-w-2xl mx-auto mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <div className="text-center leading-relaxed text-lg md:text-xl whitespace-pre-line">
                    {config.message}
                  </div>
                </motion.div>

                {config.photos && config.photos.length > 0 && (
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    {config.photos.map((photo, idx) => (
                      <motion.div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 + idx * 0.2 }}
                      >
                        <img
                          src={`/photos/${photo}`}
                          alt={config.captions?.[idx] || `Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {config.captions?.[idx] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-sm text-center">{config.captions[idx]}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  <p className="text-xl md:text-2xl font-light mb-4">{config.closing}</p>
                  <p className="text-lg opacity-70">- {config.sender}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Pause musik' : 'Putar musik'}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full ${colors.accent} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: 'spring' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )}
        </motion.button>

        <a
          href="https://wa.me/6282320114535?text=Halo%2C%20saya%20tertarik%20dengan%20EverLetter!"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 left-8 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pesan Sekarang
        </a>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'EverLetter - Nocturne',
                text: 'Lihat hadiah digital indah ini!',
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              const toast = document.createElement('div');
              toast.textContent = 'Link disalin ke clipboard!';
              toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-warm-white/90 backdrop-blur-sm text-dark-luxury px-6 py-3 rounded-full shadow-lg text-sm font-medium';
              document.body.appendChild(toast);
              setTimeout(() => {
                toast.style.transition = 'opacity 0.3s';
                toast.style.opacity = '0';
                setTimeout(() => document.body.removeChild(toast), 300);
              }, 2000);
            }
          }}
          className="fixed bottom-24 right-8 z-50 bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          aria-label="Bagikan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </>
  );
}
