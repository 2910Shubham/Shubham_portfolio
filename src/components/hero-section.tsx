import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";
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
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(t);
  }, [displayed, started, text, speed]);
  return { displayed, done: displayed.length >= text.length };
}

/* ─── Magnetic Button ─── */
function MagneticButton({
  children, className, onClick,
}: { children: React.ReactNode; className?: string; onClick?: () => void; }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.03)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0) scale(1)";
  }, []);
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={className} style={{ transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)", willChange: "transform" }}>
      {children}
    </button>
  );
}

/* ─── Orbital Ring ─── */
function OrbitalRing({
  size, borderStyle, duration, direction, dots, isDark,
}: {
  size: number; borderStyle: string; duration: number; direction: "normal" | "reverse";
  dots: Array<{ angle: number; type: "dot" | "icon" }>; isDark: boolean;
}) {
  const borderColor = isDark
    ? borderStyle
    : borderStyle.replace(/rgba\(79,70,229/g, "rgba(55,48,163");
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size, height: size, top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        border: borderColor,
        animation: `spin-orbital ${duration}s linear infinite ${direction}`,
      }}
    >
      {dots.map((dot, i) => {
        const rad = (dot.angle * Math.PI) / 180;
        const r = size / 2;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        return (
          <div key={i} className="absolute" style={{
            top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            /* Counter-rotate so content stays upright */
            animation: `spin-orbital ${duration}s linear infinite ${direction === "normal" ? "reverse" : "normal"}`,
          }}>
            {dot.type === "dot" ? (
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: isDark ? "#F59E0B" : "#D97706",
                boxShadow: `0 0 8px ${isDark ? "rgba(245,158,11,0.5)" : "rgba(217,119,6,0.4)"}`,
              }} />
            ) : (
              <span style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                color: isDark ? "#818CF8" : "#3730A3", fontWeight: 600, opacity: 0.7,
              }}>&lt;/&gt;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Orbital System (rings only — mascot is in FloatingMascot) ─── */
function OrbitalSystem({ isDark }: { isDark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const lerp = 0.06;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };
    let raf: number;
    const animate = () => {
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={containerRef} id="orbital-system" className="relative" style={{ width: 420, height: 420, willChange: "transform" }}>
      {/* Ring 3 — outermost */}
      <OrbitalRing size={420} borderStyle={`1px dashed rgba(79,70,229,0.08)`}
        duration={48} direction="normal" dots={[{ angle: 45, type: "dot" }]} isDark={isDark} />
      {/* Ring 2 — middle */}
      <OrbitalRing size={340} borderStyle={`1px solid rgba(79,70,229,0.15)`}
        duration={32} direction="reverse" dots={[{ angle: 120, type: "dot" }, { angle: 280, type: "icon" }]} isDark={isDark} />
      {/* Ring 1 — innermost */}
      <OrbitalRing size={220} borderStyle={`1px solid rgba(79,70,229,0.25)`}
        duration={20} direction="normal" dots={[{ angle: 30, type: "dot" }, { angle: 200, type: "dot" }]} isDark={isDark} />

      {/* Center glow */}
      <div className="absolute" style={{
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${isDark ? "rgba(79,70,229,0.12)" : "rgba(55,48,163,0.08)"} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ─── Ticker Strip ─── */
const tickerText = "Available for work  ✦  Full Stack Dev  ✦  React & Node  ✦  AI Integration  ✦  Mobile Apps  ✦  Scalable Systems  ✦  Open Source  ✦  Patna → World  ✦  ";

function TickerStrip({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.3, ease: "easeOut" }}
      className="absolute bottom-0 left-0 right-0 overflow-hidden group"
      style={{
        height: 48,
        background: isDark ? "rgba(79,70,229,0.08)" : "rgba(55,48,163,0.06)",
        borderTop: isDark ? "1px solid rgba(79,70,229,0.2)" : "1px solid rgba(55,48,163,0.15)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center h-full whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{ animation: "ticker-scroll 35s linear infinite", width: "max-content" }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[13px] tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: isDark ? "rgba(240,244,255,0.4)" : "#3D3A52" }}>
            {tickerText}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Film Grain ─── */
function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: 0.03, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION — Liquid Intelligence
   ═══════════════════════════════════════════════════ */
const HeroSection = memo(function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const nameScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { displayed, done } = useTypewriter("— Full Stack Developer");

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
        @keyframes spin-orbital { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes mascot-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bubble-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes pulse-line { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.15; } }
        .hero-grid { grid-template-columns: 1fr 420px; }
        @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <GrainOverlay />

      <section ref={sectionRef} id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* ─── Light mode atmospheric BG ─── */}
        {!isDark && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 80% 60% at 70% 40%, rgba(79,70,229,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 15% 85%, rgba(217,119,6,0.05) 0%, transparent 60%)
            `,
          }} />
        )}

        {/* ─── Grid container ─── */}
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", padding: "0 max(40px, 5vw)" }}>
          <div className="grid hero-grid items-center gap-8" style={{ minHeight: "100vh" }}>

            {/* ═══ LEFT COLUMN ═══ */}
            <motion.div style={{ y: nameY, scale: nameScale, opacity: fadeOut }} className="relative z-10" >

              {/* Badge — in document flow, above H1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: isDark ? "rgba(240,244,255,0.5)" : "#3D3A52",
                }}>
                  Available for new projects
                </span>
              </motion.div>

              {/* Name — SHUBHAM */}
              <motion.h1
                initial={{ opacity: 0, y: 80, skewY: 4 }} animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 8vw, 110px)",
                  letterSpacing: "0.04em", lineHeight: 0.9, willChange: "transform",
                  color: isDark ? "#F0F4FF" : "#0D0B1A",
                }}>
                SHUBHAM
              </motion.h1>

              {/* Name — Kr. Mishra */}
              <motion.div
                initial={{ opacity: 0, y: 80, skewY: 4 }} animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-4 mb-5"
                style={{ fontSize: "clamp(48px, 7vw, 100px)", lineHeight: 0.95, willChange: "transform" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em", color: isDark ? "#818CF8" : "#3730A3" }}>
                  Kr.
                </span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", color: isDark ? "#F59E0B" : "#D97706" }}>
                  Mishra
                </span>
              </motion.div>

              {/* Tagline — typewriter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="flex items-center gap-4 mb-6">
                <div className="h-px w-10" style={{ background: isDark ? "#F59E0B" : "#D97706" }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(14px, 1.6vw, 17px)",
                  color: isDark ? "rgba(240,244,255,0.7)" : "#3D3A52", fontWeight: 400,
                }}>
                  {displayed}
                  <span className={`inline-block w-[2px] h-[1.1em] ml-0.5 align-middle ${done ? "animate-pulse" : ""}`}
                    style={{ background: isDark ? "#F59E0B" : "#D97706" }} />
                </span>
              </motion.div>

              {/* Body paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="max-w-lg mb-8"
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(12px, 1vw, 14px)",
                  lineHeight: 1.7, fontWeight: 300,
                  color: isDark ? "rgba(240,244,255,0.45)" : "#3D3A52",
                }}>
                Full-Stack Engineer crafting scalable products with precision and performance —{" "}
                <span style={{ color: isDark ? "#F59E0B" : "#3730A3", fontWeight: 500 }}>e-commerce platforms</span>,{" "}
                <span style={{ color: isDark ? "#F59E0B" : "#3730A3", fontWeight: 500 }}>mobile apps</span>,{" "}
                <span style={{ color: isDark ? "#F59E0B" : "#3730A3", fontWeight: 500 }}>AI-powered systems</span>.
              </motion.p>

              {/* Social icons row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex items-center gap-4 mb-5">
                {[
                  { icon: Github, href: "https://github.com/2910Shubham", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:2910viwan@gmail.com", label: "Email" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.a key={s.label} href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer" aria-label={s.label}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9 + i * 0.06 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group"
                      style={{
                        background: isDark ? "rgba(240,244,255,0.05)" : "rgba(13,11,26,0.05)",
                        border: `1px solid ${isDark ? "rgba(240,244,255,0.10)" : "rgba(13,11,26,0.10)"}`,
                        backdropFilter: "blur(12px)",
                      }}>
                      <Icon className="w-4 h-4 transition-colors duration-300"
                        style={{ color: isDark ? "rgba(240,244,255,0.5)" : "#3D3A52" }}
                        onMouseEnter={(e) => { (e.target as SVGElement).style.color = isDark ? "#F59E0B" : "#D97706"; }}
                        onMouseLeave={(e) => { (e.target as SVGElement).style.color = isDark ? "rgba(240,244,255,0.5)" : "#3D3A52"; }} />
                    </motion.a>
                  );
                })}
                <span className="h-5 w-px mx-1" style={{ background: isDark ? "rgba(240,244,255,0.1)" : "rgba(13,11,26,0.1)" }} />
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: isDark ? "rgba(240,244,255,0.45)" : "#3D3A52",
                  background: isDark ? "rgba(240,244,255,0.04)" : "rgba(13,11,26,0.04)",
                  border: `1px solid ${isDark ? "rgba(240,244,255,0.08)" : "rgba(13,11,26,0.08)"}`,
                }}>
                  📍 Patna, India
                </span>
              </motion.div>

              {/* CTA buttons row */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.0, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-wrap items-center gap-4">
                <MagneticButton onClick={() => scrollTo("contact")}
                  className="group relative px-6 py-3 rounded-full text-sm overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 rounded-full transition-all duration-300 group-hover:opacity-0"
                    style={{ background: isDark ? "#F59E0B" : "#0D0B1A" }} />
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: isDark ? "#4F46E5" : "#3730A3" }} />
                  <span className="relative z-10 flex items-center gap-2" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: "0.05em",
                    color: isDark ? "#050508" : "#F5F0E8",
                  }}>
                    <span className="group-hover:text-white transition-colors duration-300">✦ Let's Work Together</span>
                  </span>
                </MagneticButton>

                <MagneticButton onClick={() => scrollTo("projects")}
                  className="group rounded-full text-sm cursor-pointer transition-all duration-300">
                  <span className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: "0.05em",
                    color: isDark ? "#F0F4FF" : "#0D0B1A",
                    border: `1px solid ${isDark ? "rgba(240,244,255,0.2)" : "rgba(13,11,26,0.25)"}`,
                  }}>
                    View My Work <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* ═══ RIGHT COLUMN — Orbital System ═══ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
              className="hidden lg:flex items-center justify-center relative">
              <OrbitalSystem isDark={isDark} />
            </motion.div>
          </div>
        </div>

        {/* ─── Scroll indicator — vertical line + chevron ─── */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          onClick={() => scrollTo("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
          <div style={{
            width: 1, height: 50,
            background: isDark ? "#F59E0B" : "#3730A3",
            animation: "pulse-line 2s ease-in-out infinite",
          }} />
          <ChevronDown style={{
            width: 14, height: 14,
            color: isDark ? "#F59E0B" : "#3730A3", opacity: 0.5,
          }} />
        </motion.button>

        {/* Ticker */}
        <TickerStrip isDark={isDark} />
      </section>
    </>
  );
});

export default HeroSection;
