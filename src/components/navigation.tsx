import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Sun, Moon, Github, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/*
 * Premium dock-style navigation bar.
 * - Floating glass pill centered at top
 * - macOS dock magnification on hover
 * - Animated glowing active dot
 * - Social links (GitHub, LinkedIn, Email)
 * - Animated gradient border
 * - Auto-hide on scroll down
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
  item,
  isActive,
  mouseX,
  onClick,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-120, 0, 120], [1, 1.15, 1]);
  const springScale = useSpring(scale, { mass: 0.1, stiffness: 200, damping: 12 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ scale: springScale }}
      className="relative px-3.5 py-2 rounded-full transition-colors duration-300 group"
    >
      {/* Active glow background */}
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(96,212,240,0.15), rgba(96,212,240,0.05))",
            boxShadow: "0 0 20px rgba(96,212,240,0.08)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      <span
        className={`relative z-10 text-[13px] font-medium tracking-wide transition-colors duration-300 ${isActive
            ? "text-cyan-300"
            : "text-white/45 group-hover:text-white/90"
          }`}
      >
        {item.label}
      </span>

      {/* Active dot */}
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
          style={{ boxShadow: "0 0 6px 2px rgba(96,212,240,0.5)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </motion.button>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const mouseX = useMotionValue(-1000);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setIsDark(saved === "dark");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
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
      setScrolled(sy > 40);
      if (sy > lastScrollY.current + 8 && sy > 200) setHidden(true);
      if (sy < lastScrollY.current - 4) setHidden(false);
      lastScrollY.current = sy;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && sy >= el.offsetTop - 200) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* ─── Desktop: Floating dock ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-1000)}
      >
        <div
          className="relative p-[1px] rounded-full overflow-hidden"
          style={{
            background: scrolled
              ? "linear-gradient(135deg, rgba(96,212,240,0.3), rgba(96,212,240,0.05) 40%, rgba(255,255,255,0.08) 60%, rgba(96,212,240,0.2))"
              : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            transition: "background 0.5s ease",
          }}
        >
          <div
            className="flex items-center gap-0.5 px-2 py-1.5 rounded-full"
            style={{
              background: scrolled ? "rgba(2,8,18,0.8)" : "rgba(2,8,18,0.45)",
              backdropFilter: "blur(24px) saturate(1.5)",
              WebkitBackdropFilter: "blur(24px) saturate(1.5)",
              transition: "background 0.5s ease",
            }}
          >
            {/* Logo */}
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full group mr-1"
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #60d4f0, #34d399)",
                  boxShadow: "0 0 10px rgba(96,212,240,0.4)",
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-sm font-bold text-white/90 tracking-widest font-mono">
                SM
              </span>
            </button>

            <div className="w-px h-4 bg-white/10" />

            {/* Nav items */}
            {navItems.map((item) => (
              <DockItem
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                mouseX={mouseX}
                onClick={() => scrollToSection(item.id)}
              />
            ))}

            <div className="w-px h-4 bg-white/10 ml-1" />

            {/* Social icons */}
            <div className="flex items-center gap-0.5 ml-1">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  title={s.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-cyan-300 transition-colors duration-300 relative group"
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium text-white bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                    {s.label}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="w-px h-4 bg-white/10 ml-0.5" />

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-cyan-300 transition-colors duration-300 ml-0.5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ─── Mobile: Floating bar + sheet ─── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-3 left-3 right-3 z-50 md:hidden"
      >
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(2,8,18,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #60d4f0, #34d399)",
                boxShadow: "0 0 8px rgba(96,212,240,0.4)",
              }}
            />
            <span className="text-sm font-bold text-white/90 tracking-widest font-mono">SM</span>
          </button>

          <div className="flex items-center gap-1">
            {/* Mobile social icons */}
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-cyan-300 transition-colors"
              >
                <s.icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl overflow-hidden py-2"
              style={{
                background: "rgba(2,8,18,0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 transition-colors duration-200 ${activeSection === item.id
                      ? "text-cyan-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {activeSection === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 6px rgba(96,212,240,0.5)" }} />
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
