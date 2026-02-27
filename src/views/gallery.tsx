import { useState } from "react";
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

/* ── Infinite marquee row ── */
function MarqueeGallery({
  items,
  direction,
  speed = 45,
  title,
  icon: Icon,
  onItemClick,
}: {
  items: GalleryItem[];
  direction: "left" | "right";
  speed?: number;
  title: string;
  icon: React.ElementType;
  onItemClick: (item: GalleryItem, allItems: GalleryItem[], index: number) => void;
}) {
  // Triple the items for a smoother seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div className="mb-10">
      {/* Row label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-5 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      {/* Scrolling track */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div
          className="flex gap-5"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
            width: "max-content",
          }}
        >
          {tripled.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="flex-shrink-0 group cursor-pointer"
              style={{ width: "320px" }}
              onClick={() => onItemClick(item, items, i % items.length)}
            >
              <div className="relative rounded-xl overflow-hidden border border-border bg-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.event}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground truncate">{item.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({
  items,
  index,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const count = items.length;

  const next = () => setCurrent((p) => (p + 1) % count);
  const prev = () => setCurrent((p) => (p - 1 + count) % count);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
      >
        <X className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 sm:left-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-4xl max-h-[85vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={items[current].src}
          alt={items[current].event}
          className="w-full h-full object-contain rounded-lg"
        />
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <p className="text-white font-semibold text-lg">{items[current].event}</p>
          <p className="text-white/60 text-sm mt-1">
            {current + 1} of {count}
          </p>
        </div>
      </motion.div>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 sm:right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

/* ── Main Gallery Section ── */
export function GallerySection() {
  const certificates = allItems.filter((i) => i.category === "certificate");
  const photos = allItems.filter((i) => i.category === "photo");
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

  const openLightbox = (_item: GalleryItem, items: GalleryItem[], index: number) => {
    setLightbox({ items, index });
  };

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* CSS keyframes */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-foreground/20" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Gallery
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
            Moments
            <br />
            <span className="text-muted-foreground">& achievements.</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite marquee rows — full viewport width */}
      <MarqueeGallery
        items={certificates}
        direction="left"
        speed={35}
        title="Certificates"
        icon={Award}
        onItemClick={openLightbox}
      />
      <MarqueeGallery
        items={photos}
        direction="right"
        speed={40}
        title="Hackathon Moments"
        icon={Camera}
        onItemClick={openLightbox}
      />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.items}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

const Gallery = GallerySection;
export default Gallery;
