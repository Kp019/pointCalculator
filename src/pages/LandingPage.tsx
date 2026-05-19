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
  as = "div",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "div";
}) => {
  const words = text.split(" ");
  
  const containerProps = {
    variants: staggerContainer,
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true },
    className: `flex flex-wrap gap-x-[0.3em] ${className}`
  };

  const content = words.map((word, i) => (
    <motion.span
      key={i}
      variants={fadeInUp}
      transition={{ delay: delay + i * 0.05 }}
      className="inline-block"
    >
      {word}
    </motion.span>
  ));

  if (as === "h1") {
    return <motion.h1 {...containerProps}>{content}</motion.h1>;
  }
  if (as === "h2") {
    return <motion.h2 {...containerProps}>{content}</motion.h2>;
  }
  if (as === "h3") {
    return <motion.h3 {...containerProps}>{content}</motion.h3>;
  }
  return <motion.div {...containerProps}>{content}</motion.div>;
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
      className="relative h-[400px] md:h-[550px] lg:h-[450px] xl:h-[550px] w-full overflow-visible group cursor-crosshair"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[350px] lg:h-[350px] xl:w-[450px] xl:h-[450px] bg-primary-100/30 rounded-full blur-[80px] md:blur-[130px]" 
      />

      <div className="relative h-full w-full">
        {players.map((player, index) => {
          const positions = [
            { x: 10, y: 10 },
            { x: 45, y: 40 },
            { x: 15, y: 70 },
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
                  className={`relative w-28 h-28 md:w-44 md:h-44 lg:w-36 lg:h-36 xl:w-44 xl:h-44 rounded-full bg-white/80 backdrop-blur-md border-2 md:border-4 border-white flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50`}
                >
                  <motion.div
                    animate={{ 
                      rotate: index % 2 === 0 ? [3, -3, 3] : [-3, 3, -3],
                      y: [0, -4, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 md:w-18 md:h-18 lg:w-14 lg:h-14 xl:w-18 xl:h-18 rounded-2xl ${player.color} flex items-center justify-center text-white text-3xl mb-2 shadow-xl shadow-slate-900/10 font-black`}
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
                    className="text-2xl md:text-4xl lg:text-3xl xl:text-4xl font-black leading-none"
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
        className="absolute -bottom-8 md:-bottom-12 right-0 text-right px-4 md:px-0"
      >
        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-2 md:mb-3">
          Experience the Flow
        </p>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 italic">
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
    <div className="relative py-20 md:py-32 px-6 overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Real-Time Score <br />
            Counter, Online <br />
            <span className="gradient-text">and In Sync.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-lg">
            Every point updates instantly across all your devices. Track scores live, save unlimited games, and never lose a result mid-match
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

        <GlassCard className="p-6 md:p-12 relative overflow-visible">
          <div className="absolute top-0 right-0 p-4 md:p-8">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 md:mb-10">
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
                      className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:scale-110 active:scale-75 transition-all shadow-xl shadow-primary-500/20"
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

// --- Step Previews ---

const Step0Preview = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] ${isMobile ? 'p-6' : 'p-10'} shadow-2xl border border-white flex flex-col ${isMobile ? 'gap-4' : 'gap-8'}`}>

    <div className={`flex items-center justify-between border-b border-primary-100/50 ${isMobile ? 'pb-3' : 'pb-5'}`}>
      <span className={`font-black text-slate-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>Add Players</span>
      <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold ${isMobile ? 'text-base' : 'text-xl'}`}>+</span>
    </div>
    <div className={`${isMobile ? 'space-y-3' : 'space-y-5'}`}>
      {['Alpha', 'Beta'].map((name, idx) => (
        <div key={idx} className={`flex items-center gap-3 md:gap-5 ${isMobile ? 'p-3' : 'p-4'} rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-100/50 transition-colors`}>
          <div className={`${isMobile ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg'} rounded-full flex items-center justify-center text-white font-black shadow-md ${idx === 0 ? 'bg-primary-500' : 'bg-accent-500'}`}>{name[0]}</div>
          <span className={`font-bold ${isMobile ? 'text-base' : 'text-xl'} text-slate-700 flex-1`}>{name}</span>
          <span className={`text-slate-300 ${isMobile ? 'text-base' : 'text-xl'}`}>⋮</span>
        </div>
      ))}
    </div>
    <button className={`w-full ${isMobile ? 'py-3.5 text-base' : 'py-5 text-xl'} bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-transform hover:bg-slate-900`}>Continue</button>
  </div>
);

const Step1Preview = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`w-full max-w-sm bg-slate-900 backdrop-blur-xl rounded-3xl md:rounded-4xl ${isMobile ? 'p-6' : 'p-8'} shadow-2xl border border-slate-800 flex flex-col ${isMobile ? 'gap-4' : 'gap-6'} text-white relative overflow-hidden`}>
    <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-500/20 rounded-full blur-[60px]" />
    <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'} relative z-10`}>
      <span className={`font-black ${isMobile ? 'text-lg' : 'text-xl'}`}>Ruleset</span>
      <span className={`text-primary-400 font-black uppercase tracking-widest bg-primary-500/10 ${isMobile ? 'text-[8px] px-2 py-1' : 'text-xs px-4 py-2'} rounded-full`}>Custom</span>
    </div>
    <div className={`${isMobile ? 'space-y-3' : 'space-y-4'} relative z-10`}>
      <div className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-5'} bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors`}>
        <div className="flex flex-col">
          <span className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>Target Score</span>
          <span className={`text-slate-400 font-medium ${isMobile ? 'text-[9px]' : 'text-xs'}`}>Game ends at this limit</span>
        </div>
        <span className={`font-black ${isMobile ? 'text-2xl' : 'text-3xl'} text-primary-400`}>100</span>
      </div>
      <div className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-5'} bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors`}>
        <div className="flex flex-col gap-1">
          <span className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>Win Condition</span>
          <span className={`text-slate-400 font-medium ${isMobile ? 'text-[9px]' : 'text-xs'}`}>High or low score</span>
        </div>
        <div className={`flex bg-white/10 ${isMobile ? 'p-0.5' : 'p-1'} rounded-xl`}>
          <span className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-xs'} bg-primary-500 rounded-lg font-black shadow-lg`}>High</span>
          <span className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-xs'} text-slate-400 font-bold`}>Low</span>
        </div>
      </div>
    </div>
  </div>
);

const Step2Preview = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl md:rounded-4xl ${isMobile ? 'p-6' : 'p-8'} shadow-2xl border border-white flex flex-col items-center relative overflow-hidden`}>
    <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-primary-100/50 to-transparent pointer-events-none" />
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className={`absolute -top-16 -right-16 ${isMobile ? 'w-24 h-24' : 'w-40 h-40'} bg-yellow-300/30 rounded-full blur-3xl pointer-events-none`} 
    />
    <motion.div 
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`${isMobile ? 'w-16 h-16 text-3xl mb-4' : 'w-24 h-24 text-5xl mb-6'} bg-linear-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 relative z-10 border-4 border-white`}
    >
      👑
    </motion.div>
    <h4 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-slate-900 tracking-tight mb-1 relative z-10`}>Alpha Wins!</h4>
    <p className={`text-primary-600 font-black uppercase tracking-widest ${isMobile ? 'text-[9px] mb-6 px-3 py-1.5' : 'text-xs mb-10 px-4 py-2'} relative z-10 bg-primary-50 rounded-full`}>Target 100 Reached</p>
    <div className="w-full space-y-3 md:space-y-4 relative z-10">
      {[
        {name: 'Alpha', score: 105, color: 'bg-primary-500', width: '100%'},
        {name: 'Beta', score: 85, color: 'bg-slate-300', width: '80%'},
        {name: 'Gamma', score: 60, color: 'bg-slate-200', width: '60%'},
      ].map((p, j) => (
        <div key={j} className="flex flex-col gap-1.5 md:gap-2">
          <div className={`flex justify-between font-black text-slate-700 uppercase tracking-wider ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
            <span>{p.name}</span>
            <span>{p.score}</span>
          </div>
          <div className={`${isMobile ? 'h-2' : 'h-3'} w-full bg-slate-100 rounded-full overflow-hidden`}>
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: p.width }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.2 + (j * 0.1), ease: "easeOut" }}
               className={`h-full ${p.color} rounded-full`} 
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const sectionRef = useRef<HTMLDivElement>(null);
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
      desc: "With our clean intuitive interface, add up your players to play the game.",
    },
    {
      title: "Configure Rules",
      icon: "⚡",
      color: "from-slate-500 to-amber-600",
      desc: "Set up your game rules and criteria that decide the winner and loser. Target the score limits and conditions.",
    },
    {
      title: "Start your Game",
      desc: "Every point updates instantly across all your devices. Track scores live, save unlimited games, and never lose a result mid-match",
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
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-6 md:py-8">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto glass-card px-4 md:px-8 h-16 md:h-20 flex items-center justify-between border-white/50 bg-white/40"
        >
          <div
            className="flex items-center gap-2 md:gap-3 group cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
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
            <span className="text-xl md:text-2xl font-black tracking-tighter">
              PointCalc
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-12 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
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
            <Link
              to="/signup"
              className="btn-primary py-3! px-8!"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border border-primary-100 rounded-lg text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 glass-card bg-white/95 border-white/50 overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex flex-col gap-6 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-slate-900 transition-colors py-2"
                >
                  Features
                </a>
                <a 
                  href="#guide" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-slate-900 transition-colors py-2"
                >
                  Process
                </a>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-slate-900 transition-colors py-2"
                >
                  Sign In
                </Link>
                <div className="h-px bg-slate-100 my-2" />
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-center"
                >
                  Sign Up and Play
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-40 md:pt-64 pb-20 md:pb-32 px-6">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
        >
          <div className="lg:col-span-7">
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl bg-white border border-primary-100/50 shadow-sm text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 md:mb-12"
            >
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-slate-400">Invite Only</span>
              <span className="text-slate-900">Private Beta 1.0</span>
            </motion.div>
            
            <TextReveal 
              as="h1"
              text="Game Points Calculator"
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-8 md:mb-14"
            />

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-3xl text-slate-500 font-medium max-w-2xl mb-10 md:mb-16 leading-tight"
            >
              Free online score counter for board games, card games, tournaments, and more.
            </motion.p>
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-8"
            >
              <motion.div variants={scaleIn}>
                <Link
                  to="/signup"
                  className="btn-primary text-base md:text-xl px-8 md:px-16 py-5 md:py-8 shadow-2xl shadow-slate-900/10 block text-center"
                >
                  Sign Up and Play
                </Link>
              </motion.div>
              <motion.div variants={scaleIn}>
                <Link
                  to="/quick-play"
                  className="btn-secondary text-base md:text-xl px-8 md:px-16 py-5 md:py-8 border-2 border-primary-100/50 hover:border-slate-200 bg-white shadow-xl shadow-slate-200/20 block text-center"
                >
                  Try It for One Game
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-5 relative mt-12 lg:mt-0"
          >
            <HeroInteraction />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Stream */}
      <section
        id="features"
        className="py-24 md:py-64 px-6 bg-white/40 border-y border-primary-100/50"
      >
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 md:mb-40"
          >
            <motion.p variants={fadeInUp} className="text-primary-600 font-black uppercase text-xs tracking-[0.4em] mb-4 md:mb-6">
              Precision Engineering
            </motion.p>
            <TextReveal 
              as="h2"
              text="Built for high stakes."
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
            />
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12"
          >
            <GlassCard className="p-8 md:p-10 xl:p-16 min-h-[350px] md:min-h-[500px] xl:min-h-[550px] flex flex-col justify-between border-white/50 shadow-sm">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: 15 }}
                className="absolute -right-16 -top-16 w-56 h-56 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" 
              />
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-4xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-xl shadow-primary-500/5 border border-primary-100/50">
                <svg
                  className="w-8 h-8 md:w-12 md:h-12 text-primary-600"
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
              <div className="relative z-10 mt-8 md:mt-0">
                <h3 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4 md:mb-8 tracking-tighter text-slate-900 leading-[0.9]">
                  Full Score <br />
                  History.
                </h3>
                <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed opacity-80">
                  Points scored for every game are stored and recorded. The scores will also be accessible across all devices with cloud sync.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 md:p-10 xl:p-16 min-h-[350px] md:min-h-[500px] xl:min-h-[550px] flex flex-col justify-between bg-slate-900 text-white shadow-2xl border-white/10">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: -15 }}
                className="absolute -left-16 -bottom-16 w-56 h-56 bg-accent-500/20 rounded-full blur-3xl group-hover:bg-accent-500/40 transition-all duration-700" 
              />
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-2xl md:rounded-4xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                <svg
                  className="w-8 h-8 md:w-12 md:h-12 text-accent-400"
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
              <div className="relative z-10 mt-8 md:mt-0">
                <p className="text-accent-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 md:mb-8">
                  Flexible Logic
                </p>
                <h3 className="text-4xl md:text-5xl xl:text-6xl font-black mb-6 md:mb-10 tracking-tighter leading-[0.9]">
                  Custom Rule <br />
                  Presets.
                </h3>
                <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">
                  Customize your gaming rules on how you win and lose. Set your target points, number of rounds to be played, and decide the highest and lowest scorers.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 md:p-10 xl:p-16 min-h-[350px] md:min-h-[500px] xl:min-h-[550px] flex flex-col justify-between md:col-span-2 xl:col-span-1 border-white/50 shadow-sm">
              <motion.div 
                whileHover={{ scale: 1.8, rotate: 15 }}
                className="absolute -right-16 -bottom-16 w-56 h-56 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/20 transition-all duration-700" 
              />
              <div className="w-16 h-16 md:w-24 md:h-24 bg-accent-50 rounded-2xl md:rounded-4xl flex items-center justify-center group-hover:-rotate-12 transition-transform duration-700 shadow-xl shadow-accent-500/5 border border-accent-100/50">
                <svg
                  className="w-8 h-8 md:w-12 md:h-12 text-accent-600"
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
              <div className="relative z-10 mt-8 md:mt-0">
                <h3 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4 md:mb-8 tracking-tighter text-slate-900 leading-[0.9]">
                  Seamless <br />
                  Cloud Sync.
                </h3>
                <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed opacity-80">
                  Syncing optimized for any device. Whether you play on a laptop or a phone, the data you make and stored will be reflected across any device.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Scroll-Story Process */}
      <section id="guide" className="relative">
        {/* Desktop Sticky Scroll (lg+) */}
        <div ref={sectionRef} className="hidden lg:block h-[300vh] relative">
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
                  as="h2"
                  text="How our Online Game Score Calculator Works ?"
                  className="text-5xl lg:text-6xl font-black tracking-tighter justify-center text-slate-900"
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-32 items-center">
                <div className="space-y-10 relative">
                  {guideSteps.map((step, i) => {
                    const start = i / guideSteps.length;
                    const end = (i + 1) / guideSteps.length;
                    const stepBarProgress = useTransform(sectionScrollProgress, [start, end], [0, 1]);

                    return (
                      <motion.div
                        key={i}
                        animate={{ opacity: activeStep === i ? 1 : 0.4, scale: activeStep === i ? 1 : 0.95 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="group cursor-default relative origin-left"
                      >
                        <div className="flex items-center gap-6 mb-4">
                          <motion.div
                            animate={activeStep === i ? { scale: 1.1, rotate: 12 } : { scale: 1, rotate: 0 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xl transition-all duration-700 bg-linear-to-br ${activeStep === i ? step.color + " shadow-primary-500/20 text-white" : "bg-white text-slate-400 border border-primary-100/50"}`}
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
                        <div className={`h-0.5 bg-slate-100 w-1/2 overflow-hidden rounded-full mt-6`}>
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
                      animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-linear-to-br from-primary-500/20 to-orange-600/20 rounded-[6rem] blur-[120px]" 
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
                            className="absolute inset-0 p-16 flex flex-col items-center justify-center"
                          >
                            <Step0Preview />
                          </motion.div>
                        )}
                        {activeStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 p-16 flex flex-col items-center justify-center"
                          >
                            <Step1Preview />
                          </motion.div>
                        )}
                        {activeStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 p-16 flex flex-col items-center justify-center"
                          >
                            <Step2Preview />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    <motion.div 
                      animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-3xl border border-primary-100/50"
                    >
                      📈
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-4xl border border-primary-100/50"
                    >
                      🎮
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Vertical List (<lg) */}
        <div className="lg:hidden py-32 md:py-48 px-6 space-y-32 bg-white/40 backdrop-blur-2xl border-t border-primary-100/30">
          <div className="text-center mb-24 md:mb-32">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary-600 font-black uppercase text-[10px] md:text-xs tracking-[0.4em] mb-4 md:mb-6"
            >
              The Workflow
            </motion.p>
            <TextReveal 
              as="h2"
              text="How our Online Game Score Calculator Works ?"
              className="text-4xl md:text-6xl font-black tracking-tighter justify-center text-slate-900"
            />
          </div>

          {guideSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24"
            >
              <div className="flex-1 flex flex-col gap-6 md:gap-8">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-xl bg-linear-to-br ${step.color}`}>
                    {step.icon}
                  </div>
                  <span className="text-4xl md:text-6xl font-black text-slate-100">0{i + 1}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-slate-900">{step.title}</h3>
                <p className="text-slate-600 md:text-xl font-medium leading-relaxed max-w-2xl">{step.desc}</p>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-primary-500/10 rounded-[4rem] blur-[60px] -z-10" />
                <div className="glass-card p-4 md:p-8 bg-white/40 border-white/50 shadow-2xl overflow-hidden rounded-[3rem] md:rounded-[4rem] flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                  {i === 0 && <Step0Preview isMobile={false} />}
                  {i === 1 && <Step1Preview isMobile={false} />}
                  {i === 2 && <Step2Preview isMobile={false} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Minimalist Light Footer & CTA */}
      <footer className="bg-white border-t border-primary-100/50 pt-32 md:pt-64 px-6 overflow-hidden relative">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-[0.03]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-slate-50/40 rounded-full blur-[160px] z-0" 
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
              as="h2"
              text="Start your Game"
              className="text-4xl sm:text-6xl md:text-9xl lg:text-[11rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-10 md:mb-16 justify-center text-center"
            />

            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 mb-20 md:mb-40"
            >
              <motion.div variants={scaleIn} className="w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="btn-primary text-lg md:text-2xl px-10 md:px-24 py-5 md:py-9 shadow-2xl shadow-primary-500/20 border-none block text-center"
                >
                  Sign Up and Play
                </Link>
              </motion.div>
              <motion.div variants={scaleIn} className="w-full sm:w-auto">
                <Link
                  to="/quick-play"
                  className="btn-secondary text-lg md:text-2xl px-10 md:px-24 py-5 md:py-9 border-2 border-primary-100/50 hover:border-slate-300 bg-white shadow-xl shadow-slate-200/20 block text-center"
                >
                  Try It for One Game
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
