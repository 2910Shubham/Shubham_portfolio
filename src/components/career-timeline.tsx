import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Trophy, Briefcase, Award, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const careerMilestones = [
  {
    date: "Aug 2023",
    title: "The Beginning",
    story: "Started my college journey with a burning curiosity. Dived into HTML, CSS, and the core building blocks of web development.",
    type: "learning",
  },
  {
    date: "May 2024",
    title: "Building My Foundation",
    story: "Mastered C programming and built my first client website with JavaScript — turning static HTML into interactive experiences.",
    type: "project",
  },
  {
    date: "Dec 2024",
    title: "Reaching National Stage",
    story: "Competed in Smart India Hackathon against 500+ teams. Made it to the finals — proving ideas could compete nationally.",
    type: "achievement",
  },
  {
    date: "Jan 2025",
    title: "Going Backend",
    story: "Mastered Node.js and backend architecture. Built systems that could handle real data, real users, and real complexity.",
    type: "learning",
  },
  {
    date: "Feb 2025",
    title: "Campus Kart: First Real Impact",
    story: "Built a peer-to-peer marketplace with real-time chat, payment flows, seller verification — learned what production-grade means.",
    type: "project",
  },
  {
    date: "Mar 2025",
    title: "Wins and Losses",
    story: "Won LogoVation, lost at Hackit, then won Techphilia. The losses taught me more than the wins.",
    type: "achievement",
  },
  {
    date: "Apr 2025",
    title: "Sikati.in — Frontend Intern",
    story: "Shifted from side projects to a real product team. Built PuffNMore e-commerce platform handling thousands of transactions.",
    type: "career",
  },
  {
    date: "June 2025",
    title: "Internnexus — Software Engineer",
    story: "Engineered Career Bridge — a real-time job-matching platform connecting seekers with perfect-fit positions.",
    type: "career",
  },
  {
    date: "May 2025",
    title: "Mobile Frontier",
    story: "Learned Flutter, offline-first architecture, native performance. Started Tuku Go — a ride-sharing app with real-time tracking.",
    type: "learning",
  },
  {
    date: "Jan 2026",
    title: "Fullstack Freelancer",
    story: "Building end-to-end solutions for clients. From learning HTML to architecting systems at scale — every day is a lesson.",
    type: "career",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "learning": return <Code className="w-4 h-4" />;
    case "achievement": return <Trophy className="w-4 h-4" />;
    case "career": return <Briefcase className="w-4 h-4" />;
    case "project": return <Award className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

/* ─── Single timeline item with its own scroll tracking ─── */
function DesktopTimelineItem({
  milestone,
  index,
}: {
  milestone: (typeof careerMilestones)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  // Each item tracks its own scroll progress for the ladder effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.4"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [isLeft ? -60 : 60, 0]
  );
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <div
      ref={ref}
      className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* ─── Center dot ─── */}
      <motion.div
        style={{ opacity }}
        className="absolute left-0 md:left-1/2 top-2 transform -translate-x-[3px] md:-translate-x-1/2 z-10"
      >
        <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background" />
      </motion.div>

      {/* ─── Content card ─── */}
      <div
        className={`ml-8 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`}
      >
        <motion.div
          style={{ opacity, x, y }}
          className="p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm hover:border-foreground/20 transition-colors duration-300"
        >
          {/* Date + icon */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              {milestone.date}
            </span>
            <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground">
              {getIcon(milestone.type)}
            </div>
          </div>

          <h3 className="text-base font-bold text-foreground mb-2">
            {milestone.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {milestone.story}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Lightweight mobile item animation ─── */
function MobileTimelineItem({
  milestone,
  index,
}: {
  milestone: (typeof careerMilestones)[number];
  index: number;
}) {
  return (
    <div className="relative flex">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.18) }}
        viewport={{ once: true, amount: 0.55 }}
        className="absolute left-0 top-2 -translate-x-[3px] z-10"
      >
        <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background shadow-[0_0_0_4px_rgba(255,255,255,0.04)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.34,
          ease: [0.22, 1, 0.36, 1],
          delay: Math.min(index * 0.035, 0.2),
        }}
        viewport={{ once: true, amount: 0.35 }}
        className="ml-8 w-full p-5 rounded-xl border border-border bg-background/55 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            {milestone.date}
          </span>
          <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground">
            {getIcon(milestone.type)}
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-2">
          {milestone.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {milestone.story}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Animated vertical line that grows with scroll ─── */
function GrowingLine({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border/70" />
    );
  }

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 overflow-hidden"
    >
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="w-full h-full bg-border"
      />
    </div>
  );
}

/* ─── Main component ─── */
export default function CareerTimeline() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return (
    <section id="career" className="relative py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-foreground/20" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Journey
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
            My path
            <br />
            <span className="text-muted-foreground">so far.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <GrowingLine isMobile={isMobile} />

          <div className="space-y-7 md:space-y-16">
            {careerMilestones.map((milestone, index) => (
              isMobile ? (
                <MobileTimelineItem key={index} milestone={milestone} index={index} />
              ) : (
                <DesktopTimelineItem key={index} milestone={milestone} index={index} />
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
