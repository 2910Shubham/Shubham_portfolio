import { Github, Linkedin, Mail, ArrowDown, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { memo, useRef, useState, useEffect, useCallback } from "react";

/* ─── Typewriter Hook ─── */
function useTypewriter(text: string, speed = 60, delay = 1400) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, started, text, speed]);

  return { displayed, done: displayed.length >= text.length };
}

/* ─── Magnetic Button ─── */
function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0) scale(1)";
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)", willChange: "transform" }}
    >
      {children}
    </button>
  );
}

/* ─── Ticker Strip ─── */
const tickerText = "Available for work  ✦  Full Stack Dev  ✦  React & Node  ✦  AI Integration  ✦  Mobile Apps  ✦  Scalable Systems  ✦  Open Source  ✦  Patna → World  ✦  ";

function TickerStrip() {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.3, ease: "easeOut" }}
      className="absolute bottom-0 left-0 right-0 overflow-hidden group"
      style={{
        height: 48,
        background: "rgba(79,70,229,0.08)",
        borderTop: "1px solid rgba(79,70,229,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="flex items-center h-full whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: "ticker-scroll 35s linear infinite",
          width: "max-content",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-[13px] tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(240,244,255,0.45)" }}
          >
            {tickerText}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Film Grain Overlay ─── */
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: 0.035, mixBlendMode: "overlay" }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — "Liquid Intelligence"
   ═══════════════════════════════════════════════════════════ */
const HeroSection = memo(function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const nameScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { displayed, done } = useTypewriter("— Full Stack Developer");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Ticker keyframe */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>

      <GrainOverlay />

      <section
        ref={sectionRef}
        id="home"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-0">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">

            {/* ─── Left Column ─── */}
            <motion.div
              style={{ y: nameY, scale: nameScale, opacity: fadeOut }}
              className="relative z-10 max-w-2xl"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 mb-10"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span
                  className="text-sm tracking-wider uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(240,244,255,0.5)" }}
                >
                  Available for new projects
                </span>
              </motion.div>

              {/* Name — mixed typography */}
              <div className="mb-6">
                {/* SHUBHAM */}
                <motion.h1
                  initial={{ opacity: 0, y: 80, skewY: 4 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(80px, 12vw, 160px)",
                    letterSpacing: "0.04em",
                    lineHeight: 0.9,
                    color: "#F0F4FF",
                    willChange: "transform",
                  }}
                >
                  SHUBHAM
                </motion.h1>

                {/* Kr. Mishra — mixed fonts */}
                <motion.div
                  initial={{ opacity: 0, y: 80, skewY: 4 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4"
                  style={{
                    fontSize: "clamp(70px, 11vw, 140px)",
                    lineHeight: 0.95,
                    willChange: "transform",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      letterSpacing: "0.04em",
                      color: "#818CF8",
                    }}
                  >
                    Kr.
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontStyle: "italic",
                      color: "#F59E0B",
                    }}
                  >
                    Mishra
                  </span>
                </motion.div>
              </div>

              {/* Tagline — typewriter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="flex items-center gap-4 mb-7"
              >
                <div className="h-px w-10" style={{ background: "#F59E0B" }} />
                <span
                  className="text-lg sm:text-xl"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "rgba(240,244,255,0.7)",
                    fontWeight: 400,
                  }}
                >
                  {displayed}
                  <span
                    className={`inline-block w-[2px] h-[1.1em] ml-0.5 align-middle ${done ? "animate-pulse" : ""}`}
                    style={{ background: "#F59E0B" }}
                  />
                </span>
              </motion.div>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="text-sm sm:text-[15px] leading-relaxed max-w-lg mb-10"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(240,244,255,0.45)",
                  fontWeight: 300,
                }}
              >
                Full-Stack Engineer crafting scalable products with precision and performance —{" "}
                <span style={{ color: "#F0F4FF", fontWeight: 500 }}>e-commerce platforms</span>,{" "}
                <span style={{ color: "#F0F4FF", fontWeight: 500 }}>mobile apps</span>,{" "}
                <span style={{ color: "#F0F4FF", fontWeight: 500 }}>AI-powered systems</span>.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <MagneticButton
                  onClick={() => scrollTo("contact")}
                  className="group relative px-8 py-4 rounded-full text-sm overflow-hidden cursor-pointer"

                >
                  {/* Gold fill state */}
                  <div
                    className="absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-0"
                    style={{ background: "#F59E0B" }}
                  />
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "#4F46E5" }}
                  />
                  <span
                    className="relative z-10 flex items-center gap-2 transition-colors duration-300"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      color: "#050508",
                    }}
                  >
                    <span className="group-hover:text-white transition-colors duration-300">✦ Let's Work Together</span>
                  </span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => scrollTo("projects")}
                  className="group px-8 py-4 rounded-full text-sm cursor-pointer transition-all duration-300"
                >
                  <span
                    className="flex items-center gap-2 transition-all duration-300 rounded-full"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      color: "#F0F4FF",
                      border: "1px solid rgba(240,244,255,0.2)",
                      padding: "16px 32px",
                      borderRadius: "100px",
                    }}
                  >
                    View My Work{" "}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </MagneticButton>
              </motion.div>

              {/* Social icons + Location */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.1 }}
                className="flex items-center gap-4"
              >
                {[
                  { icon: Github, href: "https://github.com/2910Shubham", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:2910viwan@gmail.com", label: "Email" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 + i * 0.08 }}
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group"
                      style={{
                        background: "rgba(240,244,255,0.05)",
                        border: "1px solid rgba(240,244,255,0.10)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: "rgba(240,244,255,0.5)" }}
                        onMouseEnter={(e) => { (e.target as SVGElement).style.color = "#F59E0B"; }}
                        onMouseLeave={(e) => { (e.target as SVGElement).style.color = "rgba(240,244,255,0.5)"; }}
                      />
                    </motion.a>
                  );
                })}

                <span className="h-5 w-px mx-1" style={{ background: "rgba(240,244,255,0.1)" }} />

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: "rgba(240,244,255,0.45)",
                    background: "rgba(240,244,255,0.04)",
                    border: "1px solid rgba(240,244,255,0.08)",
                  }}
                >
                  <MapPin className="w-3 h-3" /> Patna, India
                </motion.span>
              </motion.div>
            </motion.div>

            {/* ─── Right Column: 3D mesh placeholder + Mascot handled by OceanCompanion ─── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.8, ease: "easeOut" }}
              className="hidden lg:flex flex-col items-center justify-center relative"
              style={{ width: 380, height: 420 }}
            >
              {/* Abstract geometric shape — CSS 3D wireframe icosahedron substitute */}
              <div className="relative w-64 h-64">
                {/* Rotating wireframe rings */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid rgba(79,70,229,0.2)",
                    animation: "spin-slow 12s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full"
                  style={{
                    border: "1px solid rgba(129,140,248,0.15)",
                    animation: "spin-slow 8s linear infinite reverse",
                    transform: "rotateX(60deg)",
                  }}
                />
                <div
                  className="absolute inset-8 rounded-full"
                  style={{
                    border: "1px solid rgba(245,158,11,0.12)",
                    animation: "spin-slow 15s linear infinite",
                    transform: "rotateY(45deg)",
                  }}
                />
                {/* Center glow */}
                <div
                  className="absolute inset-16 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
                    animation: "pulse-glow 3s ease-in-out infinite",
                  }}
                />
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: i % 2 === 0 ? "#818CF8" : "#F59E0B",
                      top: `${20 + Math.sin(i * 1.2) * 35}%`,
                      left: `${50 + Math.cos(i * 1.5) * 35}%`,
                      animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Scroll indicator ─── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={() => scrollTo("about")}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors z-10"
          style={{ color: "rgba(240,244,255,0.3)" }}
        >
          <span
            className="uppercase tracking-[3px]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
          >
            Scroll
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* ─── Ticker Strip ─── */}
        <TickerStrip />

        {/* Keyframes */}
        <style>{`
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(-12px) translateX(6px); }
          }
        `}</style>
      </section>
    </>
  );
});

export default HeroSection;
