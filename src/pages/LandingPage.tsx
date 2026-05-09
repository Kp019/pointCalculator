import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
} as any;

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  }
} as any;

// --- Sub-components ---

const TextReveal = ({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const words = text.split(" ");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex flex-wrap gap-x-[0.3em] ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={fadeInUp}
          transition={{ delay: delay + i * 0.05 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const SpotlightCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      transition={{ delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group ${className.includes("bg-") ? "" : "bg-white/40"} ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 128, 0, 0.08), transparent 40%)`,
          opacity,
        }}
      />
      {children}
    </motion.div>
  );
};

const GlassCard = SpotlightCard;

const HeroInteraction = () => {
  const [players, setPlayers] = useState([
    { id: "h1", name: "Alpha", score: 120, color: "bg-primary-500" },
    { id: "h2", name: "Beta", score: 95, color: "bg-blue-500" },
    { id: "h3", name: "Gamma", score: 80, color: "bg-indigo-500" },
  ]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ 
      x: (clientX - window.innerWidth / 2) / 25, 
      y: (clientY - window.innerHeight / 2) / 25 
    });
  };

  const addPoint = (id: string) => {
    setPlayers((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, score: p.score + 10 } : p,
      );
      return [...next].sort((a, b) => b.score - a.score);
    });
  };

  return (
    <div 
      className="relative h-[550px] w-full overflow-visible group cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
          x: mousePos.x * -0.5,
          y: mousePos.y * -0.5,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary-100/30 rounded-full blur-[130px]" 
      />

      <div className="relative h-full w-full">
        {players.map((player, index) => {
          const positions = [
            { x: 15, y: 10 },
            { x: 55, y: 40 },
            { x: 20, y: 70 },
          ];
          const pos = positions[index];

          return (
            <motion.div
              key={player.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: index === 0 ? 1.3 : 1, 
                opacity: 1,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                x: mousePos.x * (index + 1) * 0.2,
                y: mousePos.y * (index + 1) * 0.2,
              }}
              transition={{ 
                layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5 }
              }}
              className="absolute select-none"
              style={{ zIndex: 10 - index }}
              onClick={() => addPoint(player.id)}
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="relative group/player"
              >
                <div
                  className={`absolute inset-0 ${player.color} opacity-20 blur-2xl group-hover/player:opacity-40 transition-opacity rounded-full`}
                />
                <div
                  className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/80 backdrop-blur-md border-4 border-white flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50`}
                >
                  <motion.div
                    animate={{ 
                      rotate: index % 2 === 0 ? [3, -3, 3] : [-3, 3, -3],
                      y: [0, -4, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 md:w-18 md:h-18 rounded-2xl ${player.color} flex items-center justify-center text-white text-3xl mb-2 shadow-xl shadow-slate-900/10 font-black`}
                  >
                    {player.name[0]}
                  </motion.div>
                  <p className="text-xs uppercase font-black text-slate-400 tracking-[0.2em] mb-1">
                    {player.name}
                  </p>
                  <motion.p 
                    key={player.score}
                    initial={{ scale: 1.4, y: -10, color: "#ff8000" }}
                    animate={{ scale: 1, y: 0, color: "#0f172a" }}
                    className="text-3xl md:text-4xl font-black leading-none"
                  >
                    {player.score}
                  </motion.p>

                  <AnimatePresence>
                    {index === 0 && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 12 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-6 -right-4 bg-yellow-400 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white"
                      >
                        <span className="text-xl">🏆</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Point burst effect */}
                <motion.div 
                  key={`burst-${player.score}`}
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, y: -40 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className={`w-full h-full rounded-full border-4 ${player.color.replace('bg-', 'border-')} opacity-30`} />
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="absolute -bottom-12 right-0 text-right"
      >
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-3">
          Experience the Flow
        </p>
        <p className="text-xs font-bold text-slate-400 italic">
          Click circles to simulate live scoring
        </p>
      </motion.div>
    </div>
  );
};

const InteractiveDemoSection = () => {
  const [players, setPlayers] = useState([
    { id: "1", name: "Alex", score: 45 },
    { id: "2", name: "Sarah", score: 32 },
    { id: "3", name: "Mike", score: 58 },
  ]);

  const addScore = (id: string, points: number) => {
    setPlayers((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, score: p.score + points } : p,
      );
      return [...next].sort((a, b) => b.score - a.score);
    });
  };

  return (
    <div className="relative py-32 px-6 overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Experience the <br />
            <span className="gradient-text">Instant Flow.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-lg">
            No page reloads, no wait times. Every point added is reflected
            across your session with instantaneous precision.
          </motion.p>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <p className="text-4xl font-black text-slate-900 mb-2">
                Real-time
              </p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Device Sync
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <p className="text-4xl font-black text-slate-900 mb-2">
                Unlimited
              </p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Saved Games
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <GlassCard className="p-12 relative overflow-visible">
          <div className="absolute top-0 right-0 p-8">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-10">
            Live Sandbox
          </h3>

          <div className="relative flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {players.map((player, index) => {
                return (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 }
                    }}
                    className="flex items-center gap-6 p-5 bg-white/80 rounded-3xl border border-white shadow-sm"
                  >
                    <motion.div
                      layout
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg transition-colors duration-700 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-slate-400"
                            : "bg-amber-600"
                      }`}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1 font-extrabold text-lg text-slate-800">
                      {player.name}
                    </div>
                    <motion.div 
                      key={player.score}
                      initial={{ scale: 1.2, color: "#ff8000" }}
                      animate={{ scale: 1, color: "#0f172a" }}
                      className="text-3xl font-black gradient-text min-w-16 text-right"
                    >
                      {player.score}
                    </motion.div>
                    <button
                      onClick={() => addScore(player.id, 10)}
                      className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:scale-110 active:scale-75 transition-all shadow-xl shadow-slate-900/10"
                    >
                      +
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothX1 = useSpring(x1, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothX2 = useSpring(x2, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return sectionScrollProgress.on("change", (latest) => {
      const step = Math.min(Math.floor(latest * 3), 2);
      if (step !== activeStep) {
        setActiveStep(step);
      }
    });
  }, [sectionScrollProgress, activeStep]);

  const guideSteps = [
    {
      title: "Initialize Players",
      icon: "💎",
      color: "from-blue-500 to-indigo-600",
      desc: "Quickly add players to your session with a clean, intuitive interface that scales with your game.",
    },
    {
      title: "Configure Rules",
      icon: "⚡",
      color: "from-orange-500 to-amber-600",
      desc: "Set win conditions and target limits. Choose between high or low score victories for total control.",
    },
    {
      title: "Log Rounds",
      desc: "Enter scores round-by-round and watch the rankings update instantly with real-time analytics.",
      icon: "🎮",
      color: "from-slate-800 to-slate-950",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-200/20 rounded-full blur-[160px]"
          style={{
            x: smoothX1,
            y: smoothY1,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent-200/20 rounded-full blur-[160px]"
          style={{
            x: smoothX2,
            y: smoothY2,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto glass-card px-8 h-20 flex items-center justify-between border-white/50 bg-white/40"
        >
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter">
              PointCalculator
            </span>
          </div>

          <div className="hidden md:flex items-center gap-12 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a href="#guide" className="hover:text-slate-900 transition-colors">
              Process
            </a>
            <Link
              to="/login"
              className="hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <a
              href="mailto:krishnaprasadr666@gmail.com?subject=Request Pro Access"
              className="btn-primary py-3! px-8!"
            >
              Request Pro
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-64 pb-32 px-6">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center"
        >
          <div className="lg:col-span-7">
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-white border border-slate-100 shadow-sm text-xs font-black uppercase tracking-[0.2em] mb-12"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-slate-400">Invite Only</span>
              <span className="text-slate-900">Private Beta 1.0</span>
            </motion.div>
            
            <TextReveal 
              text="Scoring Redefined."
              className="text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-14"
            />

            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-slate-500 font-medium max-w-2xl mb-16 leading-tight"
            >
              The ultimate companion for competitive gaming.{" "}
              <br className="hidden md:block" />
              Fast, synchronized, and beautifully simple.
            </motion.p>
            <motion.div 
              variants={staggerContainer}
              className="flex flex-wrap gap-8"
            >
              <motion.a
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:krishnaprasadr666@gmail.com?subject=Request Pro Access"
                className="btn-primary text-xl px-16 py-8 shadow-2xl shadow-slate-900/10"
              >
                Request Access
              </motion.a>
              <motion.div variants={scaleIn}>
                <Link
                  to="/quick-play"
                  className="btn-secondary text-xl px-16 py-8 border-2 border-slate-100 hover:border-slate-200 bg-white shadow-xl shadow-slate-200/20 block"
                >
                  Try Quick Play
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-5 relative"
          >
            <HeroInteraction />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Stream */}
      <section
        id="features"
        className="py-64 px-6 bg-white/40 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-40"
          >
            <motion.p variants={fadeInUp} className="text-primary-600 font-black uppercase text-xs tracking-[0.4em] mb-6">
              Precision Engineering
            </motion.p>
            <TextReveal 
              text="Built for high stakes."
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
            />
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
          >
            <GlassCard className="p-16 min-h-[550px] flex flex-col justify-between border-white/50 shadow-sm">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: 15 }}
                className="absolute -right-16 -top-16 w-56 h-56 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" 
              />
              <div className="w-24 h-24 bg-primary-50 rounded-4xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-xl shadow-primary-500/5 border border-primary-100/50">
                <svg
                  className="w-12 h-12 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-8 tracking-tighter text-slate-900">
                  Full Game <br />
                  History.
                </h3>
                <p className="text-slate-500 text-xl font-medium leading-relaxed opacity-80">
                  Every session and every point recorded. Securely stored and
                  accessible across all your devices with cloud sync.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-16 min-h-[550px] flex flex-col justify-between bg-slate-900 text-white shadow-2xl border-white/10">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: -15 }}
                className="absolute -left-16 -bottom-16 w-56 h-56 bg-accent-500/20 rounded-full blur-3xl group-hover:bg-accent-500/40 transition-all duration-700" 
              />
              <div className="w-24 h-24 bg-white/10 rounded-4xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                <svg
                  className="w-12 h-12 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-accent-400 font-black text-xs uppercase tracking-[0.3em] mb-8">
                  Flexible Logic
                </p>
                <h3 className="text-6xl font-black mb-10 tracking-tighter leading-[0.9]">
                  Custom Rule <br />
                  Presets.
                </h3>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                  Define how you win. Set target points, round limits, and
                  choose between high or low score victories.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-16 min-h-[550px] flex flex-col justify-between md:col-span-2 lg:col-span-1 border-white/50 shadow-sm">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: 15 }}
                className="absolute -right-16 -bottom-16 w-56 h-56 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/20 transition-all duration-700" 
              />
              <div className="w-24 h-24 bg-accent-50 rounded-4xl flex items-center justify-center group-hover:-rotate-12 transition-transform duration-700 shadow-xl shadow-accent-500/5 border border-accent-100/50">
                <svg
                  className="w-12 h-12 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-8 tracking-tighter text-slate-900">
                  Seamless <br />
                  Cloud Sync.
                </h3>
                <p className="text-slate-500 text-xl font-medium leading-relaxed opacity-80">
                  Start your game on one device and finish on another. Your
                  profile keeps every session synchronized effortlessly.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Scroll-Story Process */}
      <section ref={sectionRef} id="guide" className="h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl z-40 overflow-hidden">
          {/* Decorative Background Track */}
          <div className="absolute left-[calc(50%-350px)] top-0 bottom-0 w-px bg-slate-200/50 hidden lg:block" />
          
          <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-10 text-center pt-20"
            >
              <motion.p variants={fadeInUp} className="text-primary-600 font-black uppercase text-xs tracking-[0.4em] mb-3">
                The Workflow
              </motion.p>
              <TextReveal 
                text="How legends are logged."
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter justify-center text-slate-900"
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
              <div className="space-y-10 relative">
                {/* Vertical Progress Line (Mobile) */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-50 lg:hidden rounded-full" />

                {guideSteps.map((step, i) => {
                  const start = i / guideSteps.length;
                  const end = (i + 1) / guideSteps.length;
                  
                  const stepBarProgress = useTransform(sectionScrollProgress, [start, end], [0, 1]);

                  return (
                    <motion.div
                      key={i}
                      animate={{ opacity: activeStep === i ? 1 : 0.4, scale: activeStep === i ? 1 : 0.95 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="group cursor-default relative pl-16 lg:pl-0 origin-left"
                    >
                      <div className="flex items-center gap-6 mb-4">
                        <motion.div
                          animate={activeStep === i ? { scale: 1.1, rotate: 12 } : { scale: 1, rotate: 0 }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xl transition-all duration-700 bg-linear-to-br ${activeStep === i ? step.color + " shadow-primary-500/20 text-white" : "bg-white text-slate-400 border border-slate-100"}`}
                        >
                          {step.icon}
                        </motion.div>
                        <p
                          className={`text-5xl font-black tracking-tighter transition-all duration-700 ${activeStep === i ? "text-slate-900 opacity-10" : "text-slate-50 opacity-100"}`}
                        >
                          0{i + 1}
                        </p>
                      </div>
                      <h3
                        className={`text-3xl font-black mb-4 transition-all duration-700 ${activeStep === i ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {step.title}
                      </h3>
                      <AnimatePresence>
                        {activeStep === i && (
                          <motion.p 
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-base text-slate-600 font-medium leading-relaxed max-w-sm mb-6 overflow-hidden"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <div
                        className={`h-0.5 bg-slate-100 w-full lg:w-1/2 overflow-hidden rounded-full mt-6`}
                      >
                        <motion.div
                          style={{ scaleX: stepBarProgress, originX: 0 }}
                          className={`h-full bg-slate-900`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="relative">
                <div className="relative aspect-square max-w-[500px] mx-auto group">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-linear-to-br from-primary-500/20 to-accent-600/20 rounded-[6rem] blur-[120px]" 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 p-1 bg-white/20 backdrop-blur-3xl shadow-2xl border border-white/40 overflow-hidden rounded-[4rem]"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none" />
                    
                    <AnimatePresence mode="wait">
                      {activeStep === 0 && (
                        <motion.div
                          key="step0"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 p-8 sm:p-16 flex flex-col items-center justify-center"
                        >
                          <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white flex flex-col gap-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                              <span className="font-black text-slate-800 text-2xl">Add Players</span>
                              <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">+</span>
                            </div>
                            <div className="space-y-5">
                              {['Alpha', 'Beta'].map((name, idx) => (
                                <div key={idx} className="flex items-center gap-5 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md ${idx === 0 ? 'bg-primary-500' : 'bg-accent-500'}`}>{name[0]}</div>
                                  <span className="font-bold text-xl text-slate-700 flex-1">{name}</span>
                                  <span className="text-slate-300 text-xl">⋮</span>
                                </div>
                              ))}
                              <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100 border-dashed">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-black text-xl">+</div>
                                <span className="font-bold text-xl text-slate-400">New Player</span>
                              </div>
                            </div>
                            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-xl font-black shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-transform">Continue</button>
                          </div>
                        </motion.div>
                      )}

                      {activeStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 p-8 sm:p-16 flex flex-col items-center justify-center"
                        >
                          <div className="w-full max-w-sm bg-slate-900 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-slate-800 flex flex-col gap-6 text-white relative overflow-hidden">
                            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-500/20 rounded-full blur-[60px]" />
                            <div className="flex items-center justify-between mb-2 relative z-10">
                              <span className="font-black text-xl">Ruleset</span>
                              <span className="text-primary-400 text-xs font-black uppercase tracking-widest bg-primary-500/10 px-4 py-2 rounded-full">Custom</span>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">Target Score</span>
                                  <span className="text-xs text-slate-400 font-medium">Game ends at this limit</span>
                                </div>
                                <span className="font-black text-3xl text-primary-400">100</span>
                              </div>

                              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-sm">Win Condition</span>
                                  <span className="text-xs text-slate-400 font-medium">High or low score</span>
                                </div>
                                <div className="flex bg-white/10 p-1 rounded-xl">
                                  <span className="px-4 py-2 bg-primary-500 rounded-lg font-black text-xs shadow-lg">High</span>
                                  <span className="px-4 py-2 text-slate-400 font-bold text-xs">Low</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 p-8 sm:p-16 flex flex-col items-center justify-center"
                        >
                          <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-primary-100/50 to-transparent pointer-events-none" />
                            
                            <motion.div 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" 
                            />
                            
                            <motion.div 
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              className="w-24 h-24 bg-linear-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 mb-6 relative z-10 border-4 border-white"
                            >
                              👑
                            </motion.div>
                            
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-1 relative z-10">Alpha Wins!</h4>
                            <p className="text-primary-600 font-black uppercase text-xs tracking-widest mb-10 relative z-10 bg-primary-50 px-4 py-2 rounded-full">Target 100 Reached</p>
                            
                            <div className="w-full space-y-4 relative z-10">
                              {[
                                {name: 'Alpha', score: 105, color: 'bg-primary-500', width: '100%'},
                                {name: 'Beta', score: 85, color: 'bg-slate-300', width: '80%'},
                                {name: 'Gamma', score: 60, color: 'bg-slate-200', width: '60%'},
                              ].map((p, j) => (
                                <div key={j} className="flex flex-col gap-2">
                                  <div className="flex justify-between text-xs font-black text-slate-700 uppercase tracking-wider">
                                    <span>{p.name}</span>
                                    <span>{p.score}</span>
                                  </div>
                                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: p.width }}
                                       transition={{ duration: 1, delay: 0.2 + (j * 0.1), ease: "easeOut" }}
                                       className={`h-full ${p.color} rounded-full`} 
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Floating Elements */}
                  <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-3xl border border-slate-100"
                  >
                    📈
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-4xl border border-slate-100"
                  >
                    🎮
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Light Footer & CTA */}
      <footer className="bg-white border-t border-slate-100 pt-64 px-6 overflow-hidden relative">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-[0.03]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-50/40 rounded-full blur-[160px] z-0" 
        />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Social Proof Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 flex flex-col items-center"
          >
            <div className="flex -space-x-3 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-primary-500 flex items-center justify-center text-xs font-black text-white">
                10k+
              </div>
            </div>
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-slate-400">
              Trusted by players worldwide
            </p>
          </motion.div>

          {/* Final CTA Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-24"
          >
            <TextReveal 
              text="Start your Legend."
              className="text-7xl md:text-9xl lg:text-[11rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-16 justify-center"
            />

            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-40"
            >
              <motion.a
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:krishnaprasadr666@gmail.com?subject=Request Pro Access"
                className="btn-primary text-2xl px-24 py-9 bg-slate-900 hover:bg-primary-600 shadow-2xl shadow-slate-900/20 border-none"
              >
                Request Access
              </motion.a>
              <motion.div variants={scaleIn}>
                <Link
                  to="/quick-play"
                  className="btn-secondary text-2xl px-24 py-9 border-2 border-slate-100 hover:border-slate-300 bg-white shadow-xl shadow-slate-200/20 block"
                >
                  Quick Launch
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center gap-14 opacity-60"
            >
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-12">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-900">
                  PointCalculator
                </span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="h-px w-16 bg-slate-200 mb-3" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                  Designed for Elite Performance
                </p>
                <p className="text-xs font-bold text-slate-300">
                  © 2024 PointCalculator. All rights reserved.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
