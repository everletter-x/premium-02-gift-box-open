import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  src: string;
  title?: string;
}

export function MusicPlayer({ src, title }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  if (!src) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      onClick={togglePlay}
      aria-label={playing ? "Jeda musik" : "Putar musik"}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/30 flex items-center justify-center backdrop-blur-sm hover:bg-gold-accent/30 transition-colors"
      title={title}
    >
      <span className="text-gold-accent text-lg">{playing ? "⏸" : "▶"}</span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </motion.button>
  );
}
