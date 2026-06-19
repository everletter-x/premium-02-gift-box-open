import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  captions?: string[];
  closing: string;
  reasons?: string[];
}

const themeColors: Record<string, { bg: string; cardBg: string; accent: string; accentHex: string; text: string; glow: string; muted: string }> = {
  pink: { 
    bg: 'bg-gradient-to-br from-[#0F0811] via-[#1A0B1A] to-[#250E20]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'bg-[#F6B3D0] text-[#0F0811]', 
    accentHex: '#F6B3D0',
    text: 'text-[#F9F5F6]', 
    glow: 'shadow-pink-500/20',
    muted: 'text-white/50',
  },
  lavender: { 
    bg: 'bg-gradient-to-br from-[#080711] via-[#0D0A1C] to-[#150F2A]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'bg-[#C5B3E6] text-[#080711]', 
    accentHex: '#C5B3E6',
    text: 'text-[#F5F3F7]', 
    glow: 'shadow-purple-500/20',
    muted: 'text-white/50',
  },
  gold: { 
    bg: 'bg-gradient-to-br from-[#12110F] via-[#1E1915] to-[#2B2118]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'bg-[#E6C29E] text-[#12110F]', 
    accentHex: '#E6C29E',
    text: 'text-[#FBFBF9]', 
    glow: 'shadow-stone-500/20',
    muted: 'text-white/50',
  },
};

/* ── Twinkling Stars (unique to Nocturne) ── */
function TwinklingStars({ color }: { color: string }) {
  const stars = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: `${(i * 11 + 3) % 100}%`,
      top: `${(i * 17 + 7) % 100}%`,
      size: 1 + (i % 4),
      duration: 2 + (i % 5) * 0.8,
      delay: (i % 8) * 0.6,
      drift: -10 + (i % 3) * 5,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: color,
            boxShadow: `0 0 ${s.size * 3}px ${color}`,
          }}
          animate={{
            opacity: [0, 1, 0.3, 1, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.5],
            y: [0, s.drift, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Ambient floating particles ── */
function AmbientParticles({ color, count = 8 }: { color: string; count?: number }) {
  const particles = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 10) % 100}%`,
      size: 1 + (i % 3),
      duration: 4 + (i % 5),
      delay: (i % 7) * 0.8,
    })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: color }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── 3D Parallax Section ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0, -1.5]);
  return (
    <motion.div
      className={className}
      style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Drop Cap Paragraph ── */
function DropCapParagraph({ text, delay = 0, accentHex }: { text: string; delay?: number; accentHex: string }) {
  const firstChar = text.charAt(0);
  const rest = text.slice(1);
  return (
    <motion.p
      className="text-lg md:text-xl text-white/80 leading-[2] font-light"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className="float-left font-serif-premium text-6xl md:text-7xl leading-[0.8] mr-3 mt-1 font-bold"
        style={{ color: accentHex }}
      >
        {firstChar}
      </span>
      {rest}
    </motion.p>
  );
}

/* ── Premium Gift Box SVG with ribbon ── */
const GiftBoxIcon = ({ className, accentHex }: { className?: string; accentHex: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="10" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    <path d="M12 10V22" stroke={accentHex} strokeWidth="0.6" opacity="0.5" />
    <path d="M2 15h20" stroke={accentHex} strokeWidth="0.6" opacity="0.4" />
    <rect x="3" y="7" width="18" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    <path d="M12 7c-1-3-4-4-5-2s1 4 5 2" stroke={accentHex} strokeWidth="0.6" fill="none" opacity="0.7" />
    <path d="M12 7c1-3 4-4 5-2s-1 4-5 2" stroke={accentHex} strokeWidth="0.6" fill="none" opacity="0.7" />
    <circle cx="12" cy="7" r="0.8" fill={accentHex} opacity="0.6" />
  </svg>
);

export default function GiftBoxOpen() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json');
  const [boxState, setBoxState] = useState<'closed' | 'opening' | 'revealed'>('closed');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = themeColors[config?.theme || 'lavender'] || themeColors.lavender;

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
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(prev => !prev);
    }
  };

  const handleOpen = () => {
    if (boxState === 'closed') {
      setBoxState('opening');
      setTimeout(() => setBoxState('revealed'), 2200);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <motion.div
          className="w-12 h-12 border border-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-t border-[#C5B3E6]/50 rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <div className="text-center">
          <p className="text-white/60 mb-4 font-display-premium">Gagal memuat konfigurasi</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title} - EverLetter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={`min-h-screen ${colors.bg} ${colors.text} overflow-hidden font-sans selection:bg-white/20 relative`}>
        {/* Global ambient glow */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[140px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[140px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
        />

        <AnimatePresence mode="wait">
          {/* ═══ CLOSED STATE ═══ */}
          {boxState === 'closed' && (
            <motion.div
              key="closed"
              className="min-h-screen flex flex-col items-center justify-center cursor-pointer px-4 relative z-10"
              role="button"
              tabIndex={0}
              onClick={handleOpen}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
            >
              <TwinklingStars color={colors.accentHex} />

              {/* Gift box with glow */}
              <motion.div
                className="relative w-40 h-40 md:w-56 md:h-56 mb-12"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="absolute inset-[-30%] rounded-full blur-[60px] opacity-20"
                  style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
                />
                <GiftBoxIcon className="w-full h-full text-white/70 relative z-10" accentHex={colors.accentHex} />
              </motion.div>

              <motion.p
                className="font-display-premium text-lg md:text-xl font-light tracking-[0.2em] uppercase text-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Sebuah Hadiah Untukmu
              </motion.p>

              <motion.div
                className="w-12 h-[1px] mt-8 mb-4"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />

              <motion.p
                className="text-[10px] tracking-[0.3em] uppercase text-white/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                Ketuk untuk membuka
              </motion.p>
            </motion.div>
          )}

          {/* ═══ OPENING ANIMATION ═══ */}
          {boxState === 'opening' && (
            <motion.div
              key="opening"
              className="min-h-screen flex items-center justify-center relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Expanding glow burst */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: `radial-gradient(circle at center, ${colors.accentHex}30, transparent 60%)` }}
              />
              {/* Star burst */}
              <motion.div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: 3,
                      height: 3,
                      backgroundColor: colors.accentHex,
                      boxShadow: `0 0 8px ${colors.accentHex}`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((i * 30 * Math.PI) / 180) * 200,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 200,
                      opacity: [1, 0],
                      scale: [1, 0.3],
                    }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.05 }}
                  />
                ))}
              </motion.div>
              {/* White flash */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
                animate={{ scale: [0, 1.5, 3], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          )}

          {/* ═══ REVEALED STATE ═══ */}
          {boxState === 'revealed' && (
            <motion.div
              key="revealed"
              className="min-h-screen relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <TwinklingStars color={colors.accentHex} />
              <main className="min-h-screen flex flex-col items-center py-24 px-6 md:px-12 max-w-5xl mx-auto relative z-10">

                {/* Hero Card */}
                <ParallaxSection speed={0.15} className="w-full mb-24">
                  <motion.div
                    className={`text-center ${colors.cardBg} backdrop-blur-[32px] border rounded-[24px] p-10 md:p-16 shadow-glass-lg`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex gap-1.5 mb-8 justify-center opacity-30">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <h1 className="font-serif-premium text-4xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight leading-tight">
                      {config.title}
                    </h1>
                    <p className="font-display-premium text-lg md:text-xl font-light tracking-widest text-white/50 uppercase">
                      Untuk {config.recipient}
                    </p>
                    <div
                      className="w-16 h-[1px] mx-auto mt-12"
                      style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }}
                    />
                  </motion.div>
                </ParallaxSection>

                {/* Message with drop cap */}
                <ParallaxSection speed={0.12} className="max-w-3xl mx-auto mb-24 w-full">
                  <div className="text-center space-y-6">
                    {config.message.split("\n").filter(l => l.trim().length > 0).map((line, i) => (
                      i === 0 ? (
                        <DropCapParagraph key={i} text={line} accentHex={colors.accentHex} />
                      ) : (
                        <motion.p
                          key={i}
                          className="font-display-premium text-lg md:text-xl text-white/75 leading-[1.9] font-light"
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {line}
                        </motion.p>
                      )
                    ))}
                  </div>
                </ParallaxSection>

                {/* Emotional depth section */}
                <section className="w-full mb-24 py-16 relative">
                  <AmbientParticles color={colors.accentHex} count={6} />
                  <ParallaxSection speed={0.08}>
                    <motion.div
                      className="text-center mb-12"
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold`} style={{ color: colors.accentHex }}>
                        Perasaanku
                      </p>
                      <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
                        Malam yang Berbisik
                      </h2>
                      <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
                    </motion.div>

                    <div className="space-y-10">
                      {[
                        "Di malam yang sunyi ini, aku merenungkan tentang bagaimana hidupku berubah sejak kehadiranmu. Bukan dengan ledakan besar, tapi dengan bisikan lembut yang mengubah segalanya. Kau datang seperti angin malam yang menyejukkan, membawa ketenangan yang tak pernah aku duga akan kutemui.",
                        "Aku teringat malam pertama kita — langit penuh bintang, tangan kita hampir bersentuhan, dan detak jantungku yang menyalip langkahku. Sejak saat itu, setiap malam menjadi pengingat bahwa di luar sana, ada seseorang yang memikirkanku juga.",
                        "Cinta kita bukan tentang kata-kata besar atau janji-janji megah. Ia tumbuh dalam hal-hal kecil — dalam tawa yang tumpah saat kita bercerita, dalam diam yang nyaman saat kita hanya duduk berdampingan, dalam sentuhan yang mengatakan lebih dari seribu kata.",
                        "Dan di sini, di bawah langit yang sama, aku menuliskan ini untukmu. Bukan karena aku harus, tapi karena hatiku tak bisa diam. Setiap kata ini adalah potongan kecil dari rasa syukurku memilikimu dalam hidupku."
                      ].map((text, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 40, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true, margin: "-5%" }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="font-display-premium text-lg md:text-xl text-white/75 leading-[2] font-light text-center">
                            {text}
                          </p>
                          {i < 3 && (
                            <div className="flex justify-center mt-8">
                              <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ParallaxSection>
                </section>

                {/* Reasons section */}
                {config.reasons && config.reasons.length > 0 && (
                  <section className="w-full mb-24">
                    <ParallaxSection speed={0.1}>
                      <motion.div
                        className="text-center mb-16"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold" style={{ color: colors.accentHex }}>
                          Alasan
                        </p>
                        <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
                          Mengapa Kau Spesial
                        </h2>
                        <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
                      </motion.div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.reasons.map((reason, i) => (
                          <motion.div
                            key={i}
                            className={`p-8 ${colors.cardBg} border rounded-[20px] backdrop-blur-[32px] shadow-glass-lg relative overflow-hidden`}
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -4, transition: { duration: 0.3 } }}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${colors.accentHex}, transparent)` }} />
                            <span className="font-serif-premium text-4xl font-bold block mb-4" style={{ color: `${colors.accentHex}30` }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <p className="font-display-premium text-base md:text-lg text-white/80 leading-relaxed font-light">{reason}</p>
                          </motion.div>
                        ))}
                      </div>
                    </ParallaxSection>
                  </section>
                )}

                {/* Photos */}
                {config.photos && config.photos.length > 0 && (
                  <section className="w-full mb-24">
                    <ParallaxSection speed={0.1}>
                      <motion.div
                        className="text-center mb-16"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold" style={{ color: colors.accentHex }}>Gallery</p>
                        <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">Momen Bersama</h2>
                        <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
                      </motion.div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.photos.map((photo, idx) => (
                          <motion.div
                            key={idx}
                            className="group relative aspect-[3/4] overflow-hidden rounded-[20px] bg-white/[0.02] border border-white/[0.08] cursor-pointer"
                            initial={{ y: 50, opacity: 0, rotateY: idx % 2 === 0 ? 3 : -3 }}
                            whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ delay: idx * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformPerspective: 1000 }}
                            whileHover={{ scale: 1.02, rotateY: idx % 2 === 0 ? 2 : -2, transition: { duration: 0.4 } }}
                          >
                            <img
                              src={`/${photo}`}
                              alt={config.captions?.[idx] || `Foto ${idx + 1}`}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                              style={{ background: `radial-gradient(circle at 50% 50%, ${colors.accentHex}15, transparent 70%)` }}
                            />
                            {config.captions?.[idx] && (
                              <div className="absolute bottom-0 inset-x-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="font-display-premium text-white/90 text-base font-light tracking-wide italic">{config.captions[idx]}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </ParallaxSection>
                  </section>
                )}

                {/* Closing */}
                <ParallaxSection speed={0.1} className="w-full">
                  <motion.div
                    className="text-center py-24 border-t border-white/[0.06]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-12 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    >
                      <motion.svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: colors.accentHex }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </motion.svg>
                    </motion.div>
                    <p className="font-display-premium text-2xl md:text-3xl font-light italic mb-8 text-white/85">&ldquo;{config.closing}&rdquo;</p>
                    <div className="w-8 h-[1px] mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">Tertanda</p>
                    <p className="font-serif-premium text-lg tracking-widest text-white/70">{config.sender}</p>
                  </motion.div>
                </ParallaxSection>
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Button */}
        <motion.button
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Pause musik' : 'Putar musik'}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white flex items-center justify-center shadow-glass-lg z-50 cursor-pointer"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: 'spring' }}
          whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.12)" }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <div className="flex gap-[3px] items-center justify-center h-4">
              <motion.div animate={{ height: [8, 16, 8] }} transition={{ duration: 1, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              <motion.div animate={{ height: [12, 6, 12] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              <motion.div animate={{ height: [6, 14, 6] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            </div>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
            </svg>
          )}
        </motion.button>
      </div>
    </>
  );
}
