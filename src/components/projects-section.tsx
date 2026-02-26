import { motion, useInView } from "framer-motion";
import { ExternalLink, ArrowLeft, ArrowRight, Sparkles, Layers, Zap, Globe, Smartphone, Brain, X } from "lucide-react";
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import CinematicWarpOverlay from "@/components/cinematic-warp-overlay";
import { PROJECTS, type Project } from "@/data/projects";

const ACCENT_MAP: Record<string, string> = {
  "tuku-go": "#00e5cc",
  "puffnmore": "#7c5cfc",
  "campus-kart": "#ff5e87",
  "mishras-enterprises": "#ffd97d",
  "success-gateway": "#ff9f43",
  "green-island-uhi": "#2ecc71",
};

const CATEGORY_ICONS: Record<string, ReactNode> = {
  "Mobile App": <Smartphone className="w-3.5 h-3.5" />,
  "E-Commerce": <Globe className="w-3.5 h-3.5" />,
  "Marketplace": <Layers className="w-3.5 h-3.5" />,
  "Business Site": <Sparkles className="w-3.5 h-3.5" />,
  Education: <Zap className="w-3.5 h-3.5" />,
  "AI / Research": <Brain className="w-3.5 h-3.5" />,
};

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  "tuku-go": { text: "In Development", color: "#00e5cc" },
  "puffnmore": { text: "Live", color: "#2ecc71" },
  "campus-kart": { text: "Live", color: "#2ecc71" },
  "mishras-enterprises": { text: "Live", color: "#2ecc71" },
  "success-gateway": { text: "Live", color: "#2ecc71" },
  "green-island-uhi": { text: "Research", color: "#7c5cfc" },
};

const GRID_SIZES: ("large" | "medium" | "small")[] = ["large", "medium", "small", "small", "medium", "large"];

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

function createClone(source: HTMLElement, rect?: DOMRect) {
  const r = rect ?? source.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  const cs = window.getComputedStyle(source);

  clone.style.position = "fixed";
  clone.style.left = `${r.left}px`;
  clone.style.top = `${r.top}px`;
  clone.style.width = `${r.width}px`;
  clone.style.height = `${r.height}px`;
  clone.style.margin = "0";
  clone.style.zIndex = "9998";
  clone.style.pointerEvents = "none";
  clone.style.overflow = "hidden";
  clone.style.transformOrigin = "center center";
  clone.style.willChange = "left,top,width,height,border-radius,filter,opacity,transform";
  clone.style.borderRadius = cs.borderRadius || "20px";
  clone.style.background = cs.background;

  document.body.appendChild(clone);
  return clone;
}

function BentoCard({
  project,
  index,
  size,
  registerCardRef,
  hidden,
  transitioning,
  onOpen,
}: {
  project: Project;
  index: number;
  size: "large" | "medium" | "small";
  registerCardRef: (id: string, el: HTMLDivElement | null) => void;
  hidden: boolean;
  transitioning: boolean;
  onOpen: (project: Project) => void;
}) {
  const isDark = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const accent = ACCENT_MAP[project.id] || "#7c5cfc";
  const status = STATUS_MAP[project.id];
  const catIcon = CATEGORY_ICONS[project.category];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
  };

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el;
        registerCardRef(project.id, el);
      }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.56, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className={`group relative ${sizeClasses[size]} ${transitioning ? "cursor-wait" : "cursor-pointer"}`}
      style={{ opacity: hidden ? 0 : 1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      onClick={() => {
        if (!transitioning) onOpen(project);
      }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        className="relative h-full rounded-[20px] overflow-hidden transition-all duration-500"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
          border: `1px solid ${hovered ? `${accent}50` : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: hovered
            ? `0 0 0 1px ${accent}22, 0 20px 60px -10px ${accent}20, 0 4px 20px rgba(0,0,0,${isDark ? "0.3" : "0.08"})`
            : `0 2px 20px rgba(0,0,0,${isDark ? "0.1" : "0.04"})`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${accent}12, transparent 40%)`,
          }}
        />

        <div className="relative overflow-hidden" style={{ height: size === "large" ? "60%" : "55%" }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)", filter: hovered ? "brightness(1.08)" : "brightness(0.85)" }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%), linear-gradient(135deg, ${accent}15, transparent 60%)` }} />

          {status && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${status.color}40` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: status.color }} />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: status.color }}>{status.text}</span>
            </div>
          )}

          <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl text-[11px] font-mono font-bold" style={{ background: hovered ? `${accent}30` : isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)", color: hovered ? accent : isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <div className="relative p-5 flex flex-col justify-between" style={{ height: size === "large" ? "40%" : "45%" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider" style={{ color: accent, opacity: 0.9 }}>
              {catIcon}
              {project.category}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold mb-2 leading-tight" style={{ fontSize: size === "large" ? "1.4rem" : size === "medium" ? "1.15rem" : "1rem", color: isDark ? "#fff" : "#0D0B1A" }}>
              {project.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(13,11,26,0.55)", display: size === "small" ? "-webkit-box" : undefined, WebkitLineClamp: size === "small" ? 2 : undefined, WebkitBoxOrient: size === "small" ? "vertical" : undefined, overflow: size === "small" ? "hidden" : undefined }}>
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
            {project.technologies.slice(0, size === "large" ? 5 : 3).map((tech) => (
              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded-md" style={{ background: hovered ? `${accent}15` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: hovered ? accent : isDark ? "rgba(255,255,255,0.35)" : "rgba(13,11,26,0.45)" }}>
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="flex items-center gap-2 text-xs font-medium" style={{ color: hovered ? accent : isDark ? "rgba(255,255,255,0.3)" : "rgba(13,11,26,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              Enter Project
              <ArrowRight className="w-3.5 h-3.5" />
            </span>

            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg" style={{ color: hovered ? accent : isDark ? "rgba(255,255,255,0.25)" : "rgba(13,11,26,0.3)", background: hovered ? `${accent}10` : "transparent" }} onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const isDark = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zoomSfxRef = useRef<HTMLAudioElement | null>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [warpProgress, setWarpProgress] = useState(0);
  const [warpActive, setWarpActive] = useState(false);
  const [detailLoadStep, setDetailLoadStep] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    ctxRef.current = gsap.context(() => {}, sectionRef);
    return () => ctxRef.current?.revert();
  }, []);

  useEffect(() => {
    const audio = new Audio(encodeURI("/video/Zoom 8.mp3"));
    audio.preload = "auto";
    audio.volume = 0.5;
    zoomSfxRef.current = audio;

    return () => {
      zoomSfxRef.current?.pause();
      zoomSfxRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDetailPanel && selectedProject && !isTransitioning) {
        void handleBackToCard();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showDetailPanel, selectedProject, isTransitioning]);

  const registerCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  }, []);

  const openProject = useCallback((project: Project) => {
    if (isTransitioning) return;

    const cardEl = cardRefs.current[project.id];
    const contentEl = contentRef.current;
    if (!cardEl || !contentEl) return;

    const clone = createClone(cardEl);
    const driver = { p: 0 };

    const sfx = zoomSfxRef.current;
    if (sfx) {
      sfx.currentTime = 0;
      void sfx.play().catch(() => {
        // Ignore autoplay/gesture edge cases.
      });
    }

    setSelectedProject(project);
    setShowDetailPanel(true);
    setDetailLoadStep(0);
    setHiddenCardId(project.id);
    setIsTransitioning(true);
    setWarpActive(true);
    setWarpProgress(0);

    const rollback = () => {
      clone.remove();
      setShowDetailPanel(false);
      setSelectedProject(null);
      setHiddenCardId(null);
      setWarpActive(false);
      setWarpProgress(0);
      setIsTransitioning(false);
      gsap.set(contentEl, { autoAlpha: 1, filter: "blur(0px)" });
    };

    const waitForDetailAndAnimate = (triesLeft = 12) => {
      const detailEl = detailPanelRef.current;
      if (!detailEl) {
        if (triesLeft <= 0) {
          rollback();
          return;
        }
        window.setTimeout(() => waitForDetailAndAnimate(triesLeft - 1), 16);
        return;
      }

      gsap.set(detailEl, { autoAlpha: 0 });
      const runAnimation = () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            clone.remove();
            setHiddenCardId(null);
            setWarpActive(false);
            setWarpProgress(0);
            setIsTransitioning(false);
          },
        });

        tl.to(driver, {
          p: 1,
          duration: 0.95,
          onUpdate: () => setWarpProgress(driver.p),
        }, 0);

        tl.to(contentEl, { autoAlpha: 0.08, filter: "blur(14px)", duration: 0.9 }, 0);

        tl.to(clone, {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.95,
        }, 0);

        tl.to(detailEl, { autoAlpha: 1, duration: 0.28, ease: "power2.out" }, 0.7);
      };

      if (ctxRef.current) {
        ctxRef.current.add(runAnimation);
      } else {
        runAnimation();
      }
    };

    requestAnimationFrame(() => {
      waitForDetailAndAnimate();
    });
  }, [isTransitioning]);

  const handleBackToCard = useCallback(() => {
    if (!selectedProject || isTransitioning) return;

    const cardEl = cardRefs.current[selectedProject.id];
    const detailEl = detailPanelRef.current;
    const contentEl = contentRef.current;
    if (!cardEl || !detailEl || !contentEl) return;

    const to = cardEl.getBoundingClientRect();
    const clone = createClone(detailEl, detailEl.getBoundingClientRect());
    const driver = { p: 0 };

    setHiddenCardId(selectedProject.id);
    setIsTransitioning(true);
    setWarpActive(true);

    gsap.set(detailEl, { autoAlpha: 0 });

    ctxRef.current?.add(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          clone.remove();
          setShowDetailPanel(false);
          setSelectedProject(null);
          setHiddenCardId(null);
          setWarpActive(false);
          setWarpProgress(0);
          setIsTransitioning(false);
        },
      });

      tl.to(driver, {
        p: 0.8,
        duration: 0.22,
        ease: "power2.out",
        onUpdate: () => setWarpProgress(driver.p),
      }, 0);

      tl.to(driver, {
        p: 0,
        duration: 0.78,
        ease: "power4.inOut",
        onUpdate: () => setWarpProgress(driver.p),
      }, 0.2);

      tl.to(contentEl, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.86,
        ease: "power3.out",
      }, 0.08);

      tl.to(clone, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        borderRadius: 20,
        duration: 0.86,
      }, 0.14);
    });
  }, [selectedProject, isTransitioning]);

  useEffect(() => {
    if (!showDetailPanel) return;
    const scroller = detailScrollRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: 0, behavior: "auto" });
    setDetailLoadStep(0);
  }, [showDetailPanel, selectedProject?.id]);

  const handleDetailScroll = useCallback(() => {
    const scroller = detailScrollRef.current;
    if (!scroller) return;
    const y = scroller.scrollTop;
    const h = scroller.clientHeight || 1;

    let step = 0;
    if (y > h * 0.16) step = 1;
    if (y > h * 0.52) step = 2;
    if (y > h * 0.95) step = 3;

    setDetailLoadStep((prev) => (prev === step ? prev : step));
  }, []);

  return (
    <>
      <CinematicWarpOverlay progress={warpProgress} active={warpActive} zIndex={9996} />

      <section ref={sectionRef} id="projects" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: "rgba(124, 92, 252, 0.15)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15" style={{ background: "rgba(0, 229, 204, 0.1)" }} />
        </div>

        <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[1]">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(124, 92, 252, 0.08)", border: "1px solid rgba(124, 92, 252, 0.15)" }}>
              <Layers className="w-3.5 h-3.5" style={{ color: "#7c5cfc" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#7c5cfc" }}>Portfolio</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: "var(--li-text)" }}>
              Featured Projects
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="mt-6 max-w-3xl mx-auto text-lg" style={{ color: "var(--li-text-dim)" }}>
              Production-grade applications with measurable impact. Mobile-first architecture, AI/ML integration, and data engineering at scale.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] sm:auto-rows-[300px]">
            {PROJECTS.map((project, index) => (
              <BentoCard
                key={project.id}
                project={project}
                index={index}
                size={GRID_SIZES[index] || "small"}
                registerCardRef={registerCardRef}
                hidden={hiddenCardId === project.id}
                transitioning={isTransitioning}
                onOpen={openProject}
              />
            ))}
          </div>
        </div>
      </section>

      {showDetailPanel && selectedProject && (
        <div
          ref={detailPanelRef}
          className="fixed inset-0 z-[9995]"
          style={{
            background: isDark ? "rgba(10,10,18,0.98)" : "rgba(245,240,232,0.96)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            ref={detailScrollRef}
            className="h-full overflow-y-auto no-scrollbar"
            data-lenis-prevent
            onScroll={handleDetailScroll}
            onWheelCapture={(e) => e.stopPropagation()}
            onTouchMoveCapture={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="min-h-screen px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
              <div
                className="relative overflow-hidden rounded-[24px] border"
                style={{
                  borderColor: `${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}40`,
                  boxShadow: `0 0 0 1px ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}20, 0 40px 100px -24px ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}30`,
                  background: isDark ? "rgba(10,10,18,0.94)" : "rgba(255,255,255,0.88)",
                }}
              >
                <button
                  onClick={handleBackToCard}
                  className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.24)" : "rgba(13,11,26,0.2)",
                    background: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.75)",
                    color: isDark ? "rgba(255,255,255,0.82)" : "rgba(13,11,26,0.72)",
                  }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-[52vh] sm:h-[58vh] overflow-hidden">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" style={{ filter: isDark ? "brightness(0.82)" : "brightness(0.94)" }} />
                  <div className="absolute inset-0" style={{ background: isDark ? `linear-gradient(180deg, transparent 22%, rgba(0,0,0,0.72) 100%), linear-gradient(135deg, ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}1c, transparent 62%)` : `linear-gradient(180deg, transparent 22%, rgba(245,240,232,0.66) 100%), linear-gradient(135deg, ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}16, transparent 62%)` }} />
                </div>

                <div className="relative p-5 sm:p-7" style={{ background: isDark ? "linear-gradient(130deg, rgba(8,9,22,0.96), rgba(19,16,48,0.94) 46%, rgba(12,14,34,0.95))" : "linear-gradient(130deg, rgba(255,255,255,0.88), rgba(245,240,232,0.96) 46%, rgba(237,232,220,0.96))" }}>
                  <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2" style={{ color: isDark ? "#ffffff" : "var(--li-text)" }}>{selectedProject.title}</h2>
                  <p className="text-base sm:text-lg max-w-4xl" style={{ color: isDark ? "rgba(255,255,255,0.65)" : "var(--li-text-dim)" }}>{selectedProject.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedProject.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                          color: ACCENT_MAP[selectedProject.id] || "#7c5cfc",
                          border: `1px solid ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}32`,
                          background: `${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}14`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button onClick={handleBackToCard} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(13,11,26,0.2)", color: isDark ? "rgba(255,255,255,0.86)" : "var(--li-text)" }}>
                      <ArrowLeft className="w-4 h-4" />
                      Back To Card
                    </button>
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}, ${(ACCENT_MAP[selectedProject.id] || "#7c5cfc")}cc)`,
                          color: "#04040a",
                        }}
                      >
                        Visit Live
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div
                    className="mt-5 inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase transition-all duration-500"
                    style={{
                      opacity: detailLoadStep === 0 ? 0.75 : 0,
                      transform: detailLoadStep === 0 ? "translateY(0px)" : "translateY(-8px)",
                      color: isDark ? "rgba(255,255,255,0.55)" : "rgba(13,11,26,0.55)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT_MAP[selectedProject.id] || "#7c5cfc" }} />
                    Scroll to load details
                  </div>
                </div>
              </div>

              <div
                className="max-w-6xl mx-auto mt-8 pb-16 transition-all duration-700"
                style={{
                  opacity: detailLoadStep >= 1 ? 1 : 0,
                  transform: detailLoadStep >= 1 ? "translateY(0px)" : "translateY(40px)",
                }}
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  <section className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6">
                    <h3 className="text-lg font-bold mb-3">Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedProject.details.overview}</p>
                  </section>

                  <section className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-3">Key Features</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {selectedProject.details.features.map((feature, i) => (
                        <li key={i}>- {feature}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 mt-6 transition-all duration-700"
                  style={{
                    opacity: detailLoadStep >= 2 ? 1 : 0,
                    transform: detailLoadStep >= 2 ? "translateY(0px)" : "translateY(34px)",
                  }}
                >
                  <h3 className="text-lg font-bold mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.details.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full text-sm border border-border bg-background/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                <section
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 mt-6 transition-all duration-700"
                  style={{
                    opacity: detailLoadStep >= 3 ? 1 : 0,
                    transform: detailLoadStep >= 3 ? "translateY(0px)" : "translateY(34px)",
                  }}
                >
                  <h3 className="text-lg font-bold mb-3">Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedProject.details.content}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
