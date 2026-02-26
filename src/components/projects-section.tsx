import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, X, Sparkles, Layers, Zap, Globe, Smartphone, Brain } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  link?: string | null;
  details: {
    overview: string;
    features: string[];
    technologies: string[];
    content: string;
  };
};

/* ────── accent colors per project ────── */
const ACCENT_MAP: Record<string, string> = {
  "tuku-go": "#00e5cc",
  "puffnmore": "#7c5cfc",
  "campus-kart": "#ff5e87",
  "mishras-enterprises": "#ffd97d",
  "success-gateway": "#ff9f43",
  "green-island-uhi": "#2ecc71",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Mobile App": <Smartphone className="w-3.5 h-3.5" />,
  "E-Commerce": <Globe className="w-3.5 h-3.5" />,
  "Marketplace": <Layers className="w-3.5 h-3.5" />,
  "Business Site": <Sparkles className="w-3.5 h-3.5" />,
  "Education": <Zap className="w-3.5 h-3.5" />,
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

/* ────── Bento Card Component ────── */
function BentoCard({
  project,
  index,
  size,
  onProjectClick,
}: {
  project: Project;
  index: number;
  size: "large" | "medium" | "small";
  onProjectClick: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const accent = ACCENT_MAP[project.id] || "#7c5cfc";
  const status = STATUS_MAP[project.id];
  const catIcon = CATEGORY_ICONS[project.category];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true, margin: "-40px" }}
      className={`group relative cursor-pointer ${sizeClasses[size]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      onClick={() => onProjectClick(project)}
      layout
    >
      <div
        className="relative h-full rounded-[20px] overflow-hidden transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? `${accent}50` : "rgba(255,255,255,0.06)"}`,
          boxShadow: hovered
            ? `0 0 0 1px ${accent}22, 0 20px 60px -10px ${accent}20, 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 2px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Spotlight gradient following cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-[20px]"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${accent}12, transparent 40%)`,
          }}
        />

        {/* Shimmer line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
          }}
        />

        {/* Image area */}
        <div
          className="relative overflow-hidden"
          style={{
            height: size === "large" ? "60%" : size === "medium" ? "55%" : "55%",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{
              transform: hovered ? "scale(1.08)" : "scale(1)",
              filter: hovered ? "brightness(1.1)" : "brightness(0.85)",
            }}
          />
          {/* Gradient overlay on image */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%), linear-gradient(135deg, ${accent}15, transparent 60%)`,
            }}
          />

          {/* Status badge */}
          {status && (
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl"
              style={{
                background: "rgba(0,0,0,0.5)",
                border: `1px solid ${status.color}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: status.color }}
              />
              <span
                className="text-[10px] font-mono font-semibold uppercase tracking-wider"
                style={{ color: status.color }}
              >
                {status.text}
              </span>
            </div>
          )}

          {/* Number badge */}
          <div
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl text-[11px] font-mono font-bold transition-all duration-300"
            style={{
              background: hovered ? `${accent}30` : "rgba(255,255,255,0.08)",
              color: hovered ? accent : "rgba(255,255,255,0.4)",
              border: `1px solid ${hovered ? `${accent}40` : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Category on image for large cards */}
          {size === "large" && (
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-xl"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: accent,
                  border: `1px solid ${accent}30`,
                }}
              >
                {catIcon}
                {project.category}
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="relative p-5 flex flex-col justify-between" style={{ height: size === "large" ? "40%" : size === "medium" ? "45%" : "45%" }}>
          {/* Category tag for non-large cards */}
          {size !== "large" && (
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider"
                style={{ color: accent, opacity: 0.8 }}
              >
                {catIcon}
                {project.category}
              </span>
            </div>
          )}

          <div className="flex-1">
            <h3
              className="font-bold text-white mb-2 leading-tight transition-colors duration-300"
              style={{
                fontSize: size === "large" ? "1.4rem" : size === "medium" ? "1.15rem" : "1rem",
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-sm leading-relaxed transition-all duration-300"
              style={{
                color: "rgba(255,255,255,0.45)",
                display: size === "small" ? "-webkit-box" : undefined,
                WebkitLineClamp: size === "small" ? 2 : undefined,
                WebkitBoxOrient: size === "small" ? "vertical" : undefined,
                overflow: size === "small" ? "hidden" : undefined,
              }}
            >
              {project.description}
            </p>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
            {project.technologies.slice(0, size === "large" ? 5 : 3).map((tech, ti) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md transition-all duration-300"
                style={{
                  background: hovered ? `${accent}15` : "rgba(255,255,255,0.05)",
                  color: hovered ? accent : "rgba(255,255,255,0.35)",
                  border: `1px solid ${hovered ? `${accent}25` : "rgba(255,255,255,0.06)"}`,
                  transitionDelay: `${ti * 40}ms`,
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > (size === "large" ? 5 : 3) && (
              <span className="text-[10px] font-mono px-2 py-0.5 text-white/20">
                +{project.technologies.length - (size === "large" ? 5 : 3)}
              </span>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-auto">
            <span
              className="flex items-center gap-2 text-xs font-medium transition-all duration-300"
              style={{ color: hovered ? accent : "rgba(255,255,255,0.3)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: accent,
                  boxShadow: hovered ? `0 0 10px ${accent}` : "none",
                }}
              />
              View Details
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{
                  transform: hovered ? "translateX(4px)" : "translateX(0)",
                }}
              />
            </span>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300"
                style={{
                  color: hovered ? accent : "rgba(255,255,255,0.25)",
                  background: hovered ? `${accent}10` : "transparent",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-700"
          style={{
            background: hovered
              ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
              : "transparent",
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ────── Smooth Project Detail Modal ────── */
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const accent = project ? ACCENT_MAP[project.id] || "#7c5cfc" : "#7c5cfc";
  const status = project ? STATUS_MAP[project.id] : null;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(20px)",
            }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
              mass: 0.8,
            }}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[24px]"
            style={{
              background: "linear-gradient(180deg, rgba(20,20,30,0.98), rgba(10,10,18,0.99))",
              border: `1px solid ${accent}25`,
              boxShadow: `0 0 0 1px ${accent}15, 0 40px 100px -20px ${accent}25, 0 0 80px ${accent}08`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[92vh] custom-scrollbar" data-lenis-prevent>
              {/* Hero Image */}
              <div className="relative h-[280px] sm:h-[340px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.7)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 20%, rgba(10,10,18,0.95) 100%), linear-gradient(135deg, ${accent}20, transparent 60%)`,
                  }}
                />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {status && (
                      <span
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider"
                        style={{
                          background: `${status.color}15`,
                          color: status.color,
                          border: `1px solid ${status.color}30`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: status.color }}
                        />
                        {status.text}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider"
                      style={{
                        background: `${accent}15`,
                        color: accent,
                        border: `1px solid ${accent}30`,
                      }}
                    >
                      {CATEGORY_ICONS[project.category]}
                      {project.category}
                    </span>
                  </div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
                  >
                    {project.title}
                  </motion.h2>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4
                    className="text-xs font-mono uppercase tracking-[0.2em] mb-4"
                    style={{ color: accent }}
                  >
                    Overview
                  </h4>
                  <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {project.details.overview}
                  </p>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4
                    className="text-xs font-mono uppercase tracking-[0.2em] mb-4"
                    style={{ color: accent }}
                  >
                    Key Features
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.details.features.map((feature, fi) => (
                      <motion.div
                        key={fi}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + fi * 0.06 }}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/[0.03]"
                        style={{
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono font-bold"
                          style={{
                            background: `${accent}15`,
                            color: accent,
                            border: `1px solid ${accent}20`,
                          }}
                        >
                          {fi + 1}
                        </span>
                        <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Technologies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4
                    className="text-xs font-mono uppercase tracking-[0.2em] mb-4"
                    style={{ color: accent }}
                  >
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.details.technologies.map((tech, ti) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45 + ti * 0.04 }}
                        className="px-4 py-2 rounded-xl text-sm font-mono transition-all duration-300 hover:scale-105"
                        style={{
                          background: `${accent}10`,
                          color: accent,
                          border: `1px solid ${accent}20`,
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Impact / Result */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: `linear-gradient(135deg, ${accent}08, transparent)`,
                    border: `1px solid ${accent}15`,
                  }}
                >
                  <h4
                    className="text-xs font-mono uppercase tracking-[0.2em] mb-3"
                    style={{ color: accent }}
                  >
                    Impact & Results
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {project.details.content}
                  </p>
                </motion.div>

                {/* CTA */}
                {project.link && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex justify-center pt-2 pb-4"
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                        color: "#000",
                        boxShadow: `0 8px 30px ${accent}30`,
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      Visit Live Project
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────── Bento grid layout ────── */
// Define sizes: first 2 are featured (large/medium), rest alternate
const GRID_SIZES: ("large" | "medium" | "small")[] = [
  "large",   // Tuku Go — hero card
  "medium",  // PuffNMore — tall side card
  "small",   // Campus Kart
  "small",   // Mishras
  "medium",  // Success Gateway — tall card
  "large",   // Green Island UHI — another hero
];

/* ────── main section ────── */
export default function ProjectsSection({
  onProjectClick: _externalClick,
}: {
  onProjectClick: (project: any) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const projects: Project[] = [
    {
      id: "tuku-go",
      title: "Tuku Go — Ride-hailing App",
      category: "Mobile App",
      description:
        "Cross-platform Flutter app with real-time location tracking, integrated payments, and MVP architecture.",
      image: "projects/TukuGO.png",
      technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
      link: null,
      details: {
        overview:
          "A ride-sharing mobile application built with Flutter and Dart. Designed to provide a modern alternative to existing ride services with real-time location tracking and integrated payments.",
        features: [
          "Real-time ride booking and driver-passenger matching",
          "Live GPS tracking using Firebase Realtime Database",
          "Secure in-app payments with Stripe & RazorPay integration",
          "Push notifications for ride status updates",
          "User authentication with email & phone verification",
          "Rating and review system for accountability",
        ],
        technologies: ["Flutter", "Dart", "Firebase", "Google Maps API", "Stripe", "RazorPay"],
        content:
          "SITUATION: Wanted to build a cost-effective ride-sharing solution. ACTION: Developed a cross-platform Flutter app with real-time location sync, driver matching, and payment processing. RESULT: Functional MVP demonstrating expertise in real-time data handling and payment integration.",
      },
    },
    {
      id: "puffnmore",
      title: "PuffNMore — E-Commerce Platform",
      category: "E-Commerce",
      description:
        "$500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment. Production-grade storefront.",
      image: "projects/puffNmore.com.png",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe"],
      link: "https://puffsnmore.com/",
      details: {
        overview:
          "Scalable full-featured e-commerce platform handling complex product catalog, secure payments, real-time inventory, and order fulfillment.",
        features: [
          "Dynamic product catalog with advanced filtering (10K+ SKUs)",
          "Secure checkout with Stripe & PayPal integration",
          "User authentication & CRM system (50K+ registered users)",
          "Order tracking with real-time updates & SMS notifications",
          "Admin dashboard with analytics and sales forecasting",
          "Mobile-responsive design with 100/100 Lighthouse score",
        ],
        technologies: ["React", "Node.js", "Express.js", "MongoDB", "Stripe", "PayPal", "Redux"],
        content:
          "Built production-grade platform with 1-click checkout, real-time stock sync, abandoned cart recovery. RESULT: $500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment.",
      },
    },
    {
      id: "campus-kart",
      title: "Campus Kart — P2P Marketplace",
      category: "Marketplace",
      description:
        "Campus marketplace with real-time chat, seller verification, and full development lifecycle ownership.",
      image: "projects/campusKart.png",
      technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
      link: "https://campuskart.meetshubham.site/",
      details: {
        overview:
          "A campus-focused peer-to-peer marketplace with real-time communication, seller verification, and fraud detection systems.",
        features: [
          "User authentication & seller verification system",
          "Real-time chat between buyers & sellers with Socket.io",
          "Product listing with search, filtering & recommendations",
          "Payment system with escrow-based protection",
          "Order management with automated status updates",
          "Admin dashboard with moderation tools & fraud detection",
        ],
        technologies: ["Node.js", "Express.js", "MongoDB", "Socket.io", "JWT Auth"],
        content:
          "Built a peer-to-peer marketplace with Socket.io real-time chat, seller verification workflows, escrow payment design, and fraud detection.",
      },
    },
    {
      id: "mishras-enterprises",
      title: "Mishras Enterprises — Company Website",
      category: "Business Site",
      description:
        "B2B company portal with service showcase, lead capture forms, and modern React build.",
      image: "projects/mishrasenterprises.in.png",
      technologies: ["React", "Node.js", "Vite", "Tailwind CSS"],
      link: "https://mishrasenterprises.in/",
      details: {
        overview:
          "A professional B2B company website built with modern web technologies — services, company info, and contact forms.",
        features: [
          "Responsive service catalog and company information",
          "SEO-friendly structure with meta tags",
          "Contact forms for lead capture with email notifications",
          "Mobile-responsive design using Tailwind CSS",
          "Fast load times with Vite build tooling",
          "Analytics integration for traffic monitoring",
        ],
        technologies: ["React", "Vite", "Tailwind CSS", "Node.js"],
        content:
          "Built a modern, responsive business website with React and Vite focusing on performance and lead capture.",
      },
    },
    {
      id: "success-gateway",
      title: "Success Gateway — Coaching Institute",
      category: "Education",
      description:
        "Static website with course portal, mobile-responsive design, and SEO optimization.",
      image: "projects/successgateway.co.in.png",
      technologies: ["HTML", "Tailwind CSS", "JavaScript"],
      link: "https://successgateway.co.in/",
      details: {
        overview:
          "Professional informational website for a coaching institute with course information, faculty details, and contact forms.",
        features: [
          "Course information and curriculum details",
          "Faculty profiles with credentials",
          "Contact forms for admission inquiries",
          "Mobile-responsive optimized for low bandwidth",
          "Student testimonials gallery",
          "SEO-optimized structure",
        ],
        technologies: ["HTML", "Tailwind CSS", "JavaScript", "Responsive Design"],
        content:
          "Built a lightweight, responsive website with course information, faculty profiles, and inquiry forms optimized for mobile.",
      },
    },
    {
      id: "green-island-uhi",
      title: "Green Island — Urban Heat Visualizer",
      category: "AI / Research",
      description:
        "Data-driven platform to detect, visualize, and mitigate Urban Heat Islands using satellite data and AI.",
      image: "projects/UHI.png",
      technologies: ["Next.js", "Streamlit", "Leaflet.js", "Python", "TensorFlow", "GDAL"],
      link: "https://greenisland-uhi.vercel.app/",
      details: {
        overview:
          "Full-stack web platform leveraging satellite imagery, semantic segmentation, and real-time sensor data to map temperature hotspots in Patna.",
        features: [
          "Real-time temperature monitoring",
          "Roof detection using UNet + ResNet50",
          "Heatmap visualization from satellite data",
          "Vegetation density analysis",
          "GeoJSON-based area segmentation with Leaflet.js",
          "Green intervention recommendations",
        ],
        technologies: [
          "Next.js", "Streamlit", "Leaflet.js",
          "Python", "GDAL", "TensorFlow", "Scikit-learn",
        ],
        content:
          "Revealed 6.88°C rise in Patna's surface temperature (1990–2022) and demonstrated AI-powered UHI mapping for urban planners.",
      },
    },
  ];

  return (
    <>
      <section ref={sectionRef} id="projects" className="py-24 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
            style={{ background: "rgba(124, 92, 252, 0.15)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
            style={{ background: "rgba(0, 229, 204, 0.1)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[1]">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(124, 92, 252, 0.08)",
                border: "1px solid rgba(124, 92, 252, 0.15)",
              }}
            >
              <Layers className="w-3.5 h-3.5" style={{ color: "#7c5cfc" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#7c5cfc" }}>
                Portfolio
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Featured Projects
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="w-24 h-[2px] mx-auto rounded-full origin-left"
              style={{
                background: "linear-gradient(90deg, #7c5cfc, #00e5cc)",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-3xl mx-auto text-lg"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Production-grade applications with measurable impact. Mobile-first architecture,
              AI/ML integration, and data engineering at scale.
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] sm:auto-rows-[300px]"
          >
            {projects.map((project, index) => (
              <BentoCard
                key={project.id}
                project={project}
                index={index}
                size={GRID_SIZES[index] || "small"}
                onProjectClick={handleProjectClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
