import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  captions: string[];
  closing: string;
}

function useConfigLoader<T>(path: string) {
  const [config, setConfig] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(path).then(r => r.json()).then(d => { setConfig(d); setLoading(false); }).catch(e => { setError(e); setLoading(false); });
  }, [path]);
  return { config, loading, error };
}

const themeColors: Record<string, { bg: string; accent: string; text: string; glow: string }> = {
  pink: { bg: 'bg-pink-soft', accent: 'bg-rose', text: 'text-dark-luxury', glow: 'shadow-pink-soft' },
  lavender: { bg: 'bg-lavender', accent: 'bg-dark-luxury', text: 'text-dark-luxury', glow: 'shadow-lavender' },
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
      audioRef.current = new Audio(`/audio/${config.music}`);
      audioRef.current.loop = true;
    }
  }, [config]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
        <div className="text-dark-luxury">Failed to load configuration</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title} - EverLetter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen ${colors.bg} ${colors.text} overflow-hidden`}>
        <AnimatePresence mode="wait">
          {boxState === 'closed' && (
            <motion.div
              key="closed"
              className="min-h-screen flex flex-col items-center justify-center cursor-pointer px-4"
              onClick={handleOpen}
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
                          alt={config.captions?.[idx] || `Photo ${idx + 1}`}
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
      </div>
    </>
  );
}
