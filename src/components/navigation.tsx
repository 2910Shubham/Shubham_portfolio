import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Sun, Moon, Github, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/*
 * Navigation — Liquid Intelligence
 * Dark mode: fully transparent, no background box
 * Light mode: frosted parchment with subtle border
 */

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

const socials = [
  { icon: Github, href: "https://github.com/2910Shubham", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:2910viwan@gmail.com", label: "Email" },
];

/* ── Dock-style magnifying button ── */
function DockItem({
  item, isActive, mouseX, onClick, isDark,
}: {
  item: (typeof navItems)[number]; isActive: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>; onClick: () => void; isDark: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const scale = useTransform(distance, [-120, 0, 120], [1, 1.12, 1]);
  const springScale = useSpring(scale, { mass: 0.1, stiffness: 200, damping: 12 });

  const activeColor = isDark ? "#818CF8" : "#3730A3";
  const dimColor = isDark ? "rgba(240,244,255,0.55)" : "rgba(10,8,30,0.55)";
  const hoverColor = isDark ? "rgba(240,244,255,0.9)" : "rgba(10,8,30,0.85)";

  return (
    <motion.button ref={ref} onClick={onClick} style={{ scale: springScale }}
      className="relative px-3 py-2 rounded-full transition-colors duration-300 group">
      {isActive && (
        <motion.div layoutId="nav-active" className="absolute inset-0 rounded-full"
          style={{
            background: isDark ? "rgba(79,70,229,0.12)" : "rgba(55,48,163,0.08)",
          }} transition={{ type: "spring", stiffness: 300, damping: 25 }} />
      )}
      <span className="relative z-10 text-[13px] font-medium tracking-wide transition-colors duration-300"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: isActive ? activeColor : dimColor,
        }}
        onMouseEnter={(e) => { if (!isActive) (e.target as HTMLElement).style.color = hoverColor; }}
        onMouseLeave={(e) => { if (!isActive) (e.target as HTMLElement).style.color = dimColor; }}>
        {item.label}
      </span>
      {isActive && (
        <motion.div layoutId="nav-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{
            background: isDark ? "#F59E0B" : "#D97706",
            boxShadow: `0 0 6px 2px ${isDark ? "rgba(245,158,11,0.5)" : "rgba(217,119,6,0.4)"}`,
          }} transition={{ type: "spring", stiffness: 300, damping: 25 }} />
      )}
    </motion.button>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const mouseX = useMotionValue(-1000);
  const switchAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setIsDark(saved === "dark");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const audio = new Audio(encodeURI("/video/switchSound.mp3"));
    audio.preload = "auto";
    audio.volume = 0.65;
    switchAudioRef.current = audio;

    return () => {
      if (switchAudioRef.current) {
        switchAudioRef.current.pause();
        switchAudioRef.current.currentTime = 0;
      }
      switchAudioRef.current = null;
    };
  }, []);

  // Watch for external theme changes
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => {
    const sfx = switchAudioRef.current;
    if (sfx) {
      sfx.currentTime = 0;
      void sfx.play().catch(() => {
        // Ignore autoplay/gesture edge cases.
      });
    }

    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("cyber");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      if (sy > lastScrollY.current + 8 && sy > 200) setHidden(true);
      if (sy < lastScrollY.current - 4) setHidden(false);
      lastScrollY.current = sy;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && sy >= el.offsetTop - 200) { setActiveSection(navItems[i].id); break; }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  }, []);

  // Colors
  const goldColor = isDark ? "#F59E0B" : "#D97706";
  const socialDim = isDark ? "rgba(240,244,255,0.35)" : "rgba(10,8,30,0.4)";
  const socialHover = isDark ? "#F59E0B" : "#D97706";

  return (
    <>
      {/* ─── Desktop Nav ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        style={{ paddingTop: 24 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-1000)}
      >
        <div className="max-w-[1400px] mx-auto" style={{ padding: "0 max(40px, 5vw)" }}>
          <div className="flex items-center justify-between py-2 px-1"
            style={{
              /* Dark: fully transparent. Light: frosted parchment */
              background: isDark ? "transparent" : "rgba(245,240,232,0.85)",
              backdropFilter: isDark ? "none" : "blur(20px) saturate(180%)",
              WebkitBackdropFilter: isDark ? "none" : "blur(20px) saturate(180%)",
              borderBottom: isDark ? "none" : "1px solid rgba(13,11,26,0.08)",
              borderRadius: isDark ? 0 : 16,
              padding: isDark ? "8px 0" : "8px 16px",
              transition: "background 0.4s, backdrop-filter 0.4s, border 0.4s",
            }}>

            {/* Logo */}
            <button onClick={() => scrollToSection("home")} className="flex items-center gap-2 group">
              <motion.div className="w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${goldColor}, ${isDark ? "#818CF8" : "#3730A3"})`,
                  boxShadow: `0 0 8px ${isDark ? "rgba(245,158,11,0.4)" : "rgba(217,119,6,0.3)"}`,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 14, letterSpacing: "0.15em",
                color: isDark ? "rgba(240,244,255,0.9)" : "#0D0B1A",
              }}>SM</span>
            </button>

            {/* Nav items */}
            <div className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <DockItem key={item.id} item={item} isActive={activeSection === item.id}
                  mouseX={mouseX} onClick={() => scrollToSection(item.id)} isDark={isDark} />
              ))}
            </div>

            {/* Right: socials + theme */}
            <div className="flex items-center gap-1">
              {socials.map((s) => (
                <a key={s.label} href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer" title={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                  style={{ color: socialDim }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = socialHover; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = socialDim; }}>
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
              <div className="w-px h-4 mx-1" style={{ background: isDark ? "rgba(240,244,255,0.1)" : "rgba(13,11,26,0.1)" }} />
              <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ color: socialDim }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = socialHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = socialDim; }}>
                <AnimatePresence mode="wait">
                  <motion.div key={isDark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Mobile Nav ─── */}
      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }} className="fixed top-3 left-3 right-3 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{
            background: isDark ? "rgba(2,8,18,0.85)" : "rgba(245,240,232,0.92)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(13,11,26,0.08)"}`,
          }}>
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{
              background: `linear-gradient(135deg, ${goldColor}, ${isDark ? "#818CF8" : "#3730A3"})`,
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
              letterSpacing: "0.15em", color: isDark ? "rgba(240,244,255,0.9)" : "#0D0B1A",
            }}>SM</span>
          </button>
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a key={s.label} href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: socialDim }}>
                <s.icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <div className="w-px h-4 mx-0.5" style={{ background: isDark ? "rgba(240,244,255,0.1)" : "rgba(13,11,26,0.1)" }} />
            <button onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: isDark ? "rgba(240,244,255,0.4)" : "rgba(13,11,26,0.4)" }}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: isDark ? "rgba(240,244,255,0.6)" : "rgba(13,11,26,0.6)" }}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl overflow-hidden py-2"
              style={{
                background: isDark ? "rgba(2,8,18,0.92)" : "rgba(245,240,232,0.95)",
                backdropFilter: "blur(24px)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(13,11,26,0.06)"}`,
              }}>
              {navItems.map((item, i) => (
                <motion.button key={item.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 transition-colors duration-200"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: activeSection === item.id
                      ? (isDark ? "#818CF8" : "#3730A3")
                      : (isDark ? "rgba(240,244,255,0.5)" : "rgba(13,11,26,0.5)"),
                  }}>
                  {activeSection === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: isDark ? "#F59E0B" : "#D97706",
                      boxShadow: `0 0 6px ${isDark ? "rgba(245,158,11,0.5)" : "rgba(217,119,6,0.4)"}`,
                    }} />
                  )}
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
