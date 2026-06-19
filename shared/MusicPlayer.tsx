import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
  src?: string;
  title?: string;
  audioSrc?: string;
  autoPlay?: boolean;
}

export function MusicPlayer({ src, title, audioSrc, autoPlay }: MusicPlayerProps) {
  const audioSource = src || audioSrc || "";
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  // Update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!audioSource) return null;

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={audioSource} loop preload="metadata" />

      {/* Expanded Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full right-0 mb-4 w-72 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15, 15, 20, 0.85)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.03)",
            }}
          >
            {/* Album Art / Visualizer */}
            <div className="relative h-48 w-full overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: playing
                    ? "linear-gradient(135deg, rgba(246, 179, 208, 0.3), rgba(197, 179, 230, 0.2), rgba(230, 194, 158, 0.2))"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                  transition: "background 1s ease",
                }}
              />
              {/* Animated bars */}
              <div className="absolute inset-0 flex items-end justify-center gap-1 px-8 pb-6">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(180deg, rgba(246, 179, 208, ${0.3 + (i % 3) * 0.2}), rgba(246, 179, 208, 0.05))`,
                    }}
                    animate={
                      playing
                        ? {
                            height: [
                              `${20 + Math.sin(i * 0.8) * 15}%`,
                              `${50 + Math.cos(i * 0.6) * 30}%`,
                              `${15 + Math.sin(i * 1.2) * 10}%`,
                              `${40 + Math.cos(i * 0.4) * 25}%`,
                              `${20 + Math.sin(i * 0.8) * 15}%`,
                            ],
                          }
                        : { height: "8%" }
                    }
                    transition={
                      playing
                        ? {
                            duration: 1.5 + (i % 4) * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.05,
                          }
                        : { duration: 0.5 }
                    }
                  />
                ))}
              </div>
              {/* Playing indicator */}
              {playing && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[9px] tracking-widest uppercase text-white/40">
                    Now Playing
                  </span>
                </div>
              )}
            </div>

            {/* Info & Controls */}
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-white/90 truncate mb-0.5">
                {title || "Music"}
              </p>
              <p className="text-[10px] text-white/40 mb-3">EverLetter</p>

              {/* Progress bar */}
              <div className="w-full h-[3px] rounded-full bg-white/10 mb-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #F6B3D0, #C5B3E6)",
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-white/30 mb-3">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : "0:00"}</span>
              </div>

              {/* Play controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                    }
                  }}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                  aria-label="Rewind 10 seconds"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.5 8c-2.65 0-5.05 1.04-6.83 2.73L3 8v8h8l-2.81-2.81C9.63 11.77 10.99 11 12.5 11c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5H5.5c0 3.87 3.13 7 7 7s7-3.13 7-7-3.13-7-7-7z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    background: playing
                      ? "rgba(255, 255, 255, 0.1)"
                      : "linear-gradient(135deg, #F6B3D0, #C5B3E6)",
                  }}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(
                        audioRef.current.duration || 0,
                        audioRef.current.currentTime + 10
                      );
                    }
                  }}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                  aria-label="Forward 10 seconds"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.5 8c2.65 0 5.05 1.04 6.83 2.73L21 8v8h-8l2.81-2.81C14.37 11.77 13.01 11 11.5 11c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5h2c0 3.87-3.13 7-7 7s-7-3.13-7-7 3.13-7 7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={toggleExpand}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer relative"
        style={{
          background: playing
            ? "linear-gradient(135deg, rgba(246, 179, 208, 0.2), rgba(197, 179, 230, 0.15))"
            : "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${playing ? "rgba(246, 179, 208, 0.25)" : "rgba(255, 255, 255, 0.1)"}`,
          boxShadow: playing
            ? "0 8px 32px rgba(246, 179, 208, 0.15)"
            : "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
        aria-label={playing ? "Toggle music player" : "Open music player"}
      >
        {playing ? (
          <div className="flex gap-[2px] items-center justify-center h-4">
            <motion.div
              animate={{ height: [6, 14, 6] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-[2.5px] rounded-full"
              style={{ backgroundColor: "#F6B3D0" }}
            />
            <motion.div
              animate={{ height: [10, 4, 10] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-[2.5px] rounded-full"
              style={{ backgroundColor: "#C5B3E6" }}
            />
            <motion.div
              animate={{ height: [5, 12, 5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-[2.5px] rounded-full"
              style={{ backgroundColor: "#E6C29E" }}
            />
          </div>
        ) : (
          <svg className="w-5 h-5 ml-0.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        )}

        {/* Playing pulse ring */}
        {playing && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(246, 179, 208, 0.3)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Title tooltip */}
      {!expanded && title && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
        >
          <span
            className="text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full"
            style={{
              color: "rgba(255, 255, 255, 0.35)",
              background: "rgba(15, 15, 20, 0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {title}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default MusicPlayer;
