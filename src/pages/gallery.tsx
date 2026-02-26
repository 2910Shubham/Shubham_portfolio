import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Award, Camera } from "lucide-react";

interface GalleryItem {
  src: string;
  event: string;
  category: "certificate" | "photo";
}

const allItems: GalleryItem[] = [
  { src: "cirtificates/Hackit.jpg", event: "Hackit", category: "certificate" },
  { src: "cirtificates/logovatio0n.jpg", event: "LogoVation", category: "certificate" },
  { src: "cirtificates/SIH2024.jpg", event: "SIH 2024", category: "certificate" },
  { src: "cirtificates/Techphilia.jpg", event: "Techphilia", category: "certificate" },
  { src: "images/LogoVationPrizeREcieving.jpg", event: "Logovation — Prize Ceremony", category: "photo" },
  { src: "images/Sih1.jpg", event: "Smart India Hackathon", category: "photo" },
  { src: "images/Sih2.jpg", event: "Smart India Hackathon — Team", category: "photo" },
  { src: "images/Sih3.jpg", event: "Smart India Hackathon — Presentation", category: "photo" },
  { src: "images/techphiliaPrizeReciving.jpg", event: "Techphilia — Winner", category: "photo" },
  { src: "images/TechphiliaSoloWithCheck.jpg", event: "Techphilia — Prize Check", category: "photo" },
];

/* ── Carousel Row ── */
function CarouselRow({
  items,
  title,
  icon: Icon,
  autoDirection = 1,
}: {
  items: GalleryItem[];
  title: string;
  icon: React.ElementType;
  autoDirection?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const count = items.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      if (autoDirection > 0) next();
      else prev();
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [paused, next, prev, autoDirection]);

  // Keyboard nav in lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox((p) => (p !== null ? (p + 1) % count : null));
      if (e.key === "ArrowLeft") setLightbox((p) => (p !== null ? (p - 1 + count) % count : null));
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, count]);

  // How many cards visible based on screen
  const getVisible = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const visible = getVisible();
  const cardWidth = 100 / visible;

  return (
    <div className="mb-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h3>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground mr-3 hidden sm:inline">
            {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Carousel track */}
      <div
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className="flex"
          animate={{ x: `-${current * cardWidth}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          {items.map((item, i) => (
            <div
              key={item.src}
              className="flex-shrink-0 px-2"
              style={{ width: `${cardWidth}%` }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.event}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-6">
                    <span className="text-white text-sm font-medium px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      View Full Size
                    </span>
                  </div>
                  {/* Accent corner */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Label */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground truncate">{item.event}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{item.category}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 6,
                background: i === current ? "var(--primary)" : "var(--border)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p !== null ? (p - 1 + count) % count : null));
              }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[lightbox].src}
                alt={items[lightbox].event}
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="text-white font-semibold text-lg">{items[lightbox].event}</p>
                <p className="text-white/60 text-sm mt-1">
                  {lightbox + 1} of {count} · {items[lightbox].category}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p !== null ? (p + 1) % count : null));
              }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Gallery Section ── */
export function GallerySection() {
  const certificates = allItems.filter((i) => i.category === "certificate");
  const photos = allItems.filter((i) => i.category === "photo");

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Gallery & Achievements
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary mx-auto rounded-full origin-left"
          />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
            Certificates, hackathon wins, and moments captured along the journey.
          </p>
        </motion.div>

        {/* Certificates carousel */}
        <CarouselRow items={certificates} title="Certificates" icon={Award} autoDirection={1} />

        {/* Photos carousel (auto-scrolls opposite direction) */}
        <CarouselRow items={photos} title="Hackathon Moments" icon={Camera} autoDirection={-1} />
      </div>
    </section>
  );
}

const Gallery = GallerySection;
export default Gallery;
