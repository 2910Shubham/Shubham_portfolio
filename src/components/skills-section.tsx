import { motion } from "framer-motion";

/*
 * Tech Stack — Infinite scrolling dual-row marquee.
 * Top row scrolls LEFT, bottom row scrolls RIGHT.
 * Uses CSS keyframe animations for smooth infinite scroll.
 */

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const topRow = [
  { name: "React", icon: `${CDN}/react/react-original.svg` },
  { name: "TypeScript", icon: `${CDN}/typescript/typescript-original.svg` },
  { name: "Next.js", icon: `${CDN}/nextjs/nextjs-original.svg` },
  { name: "JavaScript", icon: `${CDN}/javascript/javascript-original.svg` },
  { name: "Node.js", icon: `${CDN}/nodejs/nodejs-original.svg` },
  { name: "Express", icon: `${CDN}/express/express-original.svg` },
  { name: "Python", icon: `${CDN}/python/python-original.svg` },
  { name: "Tailwind", icon: `${CDN}/tailwindcss/tailwindcss-original.svg` },
  { name: "Three.js", icon: `${CDN}/threejs/threejs-original.svg` },
];

const bottomRow = [
  { name: "Flutter", icon: `${CDN}/flutter/flutter-original.svg` },
  { name: "Dart", icon: `${CDN}/dart/dart-original.svg` },
  { name: "MongoDB", icon: `${CDN}/mongodb/mongodb-original.svg` },
  { name: "PostgreSQL", icon: `${CDN}/postgresql/postgresql-original.svg` },
  { name: "Firebase", icon: `${CDN}/firebase/firebase-original.svg` },
  { name: "Docker", icon: `${CDN}/docker/docker-original.svg` },
  { name: "Git", icon: `${CDN}/git/git-original.svg` },
  { name: "Figma", icon: `${CDN}/figma/figma-original.svg` },
  { name: "TensorFlow", icon: `${CDN}/tensorflow/tensorflow-original.svg` },
];

function TechCard({ tech }: { tech: { name: string; icon: string } }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-background/50 backdrop-blur-sm flex-shrink-0 hover:border-foreground/20 transition-colors duration-300 group">
      <img
        src={tech.icon}
        alt={tech.name}
        className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        loading="lazy"
      />
      <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
        {tech.name}
      </span>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  speed = 30,
}: {
  items: typeof topRow;
  direction: "left" | "right";
  speed?: number;
}) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div
        className="flex gap-4"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((tech, i) => (
          <TechCard key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-16 lg:py-20 overflow-hidden">
      {/* CSS keyframes for marquee */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-foreground/20" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
            Tools I
            <br />
            <span className="text-muted-foreground">work with.</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee rows — full viewport width */}
      <div className="space-y-4">
        <MarqueeRow items={topRow} direction="left" speed={35} />
        <MarqueeRow items={bottomRow} direction="right" speed={40} />
      </div>
    </section>
  );
}
