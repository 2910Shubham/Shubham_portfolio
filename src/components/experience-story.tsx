import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Rocket, Award } from "lucide-react";

/*
 * ExperienceStory — A narrative scrolling experience showcase.
 * Each role is told as a chapter in a story with scroll-driven reveals.
 */

const chapters = [
    {
        id: "sikati",
        chapter: "Chapter I",
        period: "Apr – Jul 2025",
        company: "Sikati Enterprises",
        role: "Frontend Developer Intern",
        icon: Briefcase,
        color: "#6366f1",
        narrative:
            "It started with a message. Sikati was building something ambitious — a cross-platform mobile app — and they needed someone who could turn designs into reality.",
        highlights: [
            "Engineered the mobile frontend using Flutter & Dart",
            "Built reusable widget systems for design consistency",
            "Integrated REST APIs with optimized state management",
            "Shipped on both Android & iOS simultaneously",
        ],
        reflection:
            "This was my first real production environment. I learned that writing code is easy — shipping software that works for real users is the hard part.",
        tech: ["Flutter", "Dart", "REST APIs", "Git"],
    },
    {
        id: "internnexus",
        chapter: "Chapter II",
        period: "Jun – Aug 2025",
        company: "TechIntelliVerse Pvt. Ltd.",
        role: "Full-Stack Software Engineer Intern",
        icon: Rocket,
        color: "#06b6d4",
        narrative:
            "While still at Sikati, an opportunity from InternNexus TechHub landed. They needed a full-stack engineer to build Progressive Web Application — a platform connecting job seekers with perfect-fit positions through real-time matching.",
        highlights: [
            "Built full-stack apps with Node.js, Next.js & MongoDB",
            "Designed RESTful APIs with Express.js for seamless data flow",
            "Optimized database queries → measurable performance gains",
            "Implemented responsive UIs with React, Next.js and Tailwind CSS",
        ],
        reflection:
            "Going full-stack changed how I think about software. Frontend and backend aren't separate worlds — they're one system. Understanding both made me a fundamentally better engineer.",
        tech: ["React", "Node.js", "MongoDB", "Express"],
    },
    {
        id: "rootkit",
        chapter: "Chapter III",
        period: "Aug – Dec 2025",
        company: "Rootkit Consultancy",
        role: "Mobile Developer → Lead Maintainer",
        icon: Award,
        color: "#f59e0b",
        narrative:
            "Rootkit was a startup. They brought me in on a contract for a laundry delivery app. The plan was simple: build a few features and move on. But the work spoke louder than the plan.",
        highlights: [
            "Developed 20+ features for a cross-platform app serving 500+ users",
            "Built secure payment gateway with Firebase Cloud Functions",
            "Improved conversion by 25% through seamless transactions",
            "Reduced development cycle by 30% via rapid iterations",
        ],
        reflection:
            "My work impressed them enough to offer me maintenance of their main client project — a full iOS and Android app. I went from contractor to the person they trusted with their core product.",
        promotion: "Offered full ownership of their primary client's mobile apps.",
        tech: ["Flutter", "Firebase", "Cloud Functions", "Payments"],
    },
];

/* ─── Single story chapter with its own scroll tracking ─── */
function StoryChapter({
    chapter,
    index,
}: {
    chapter: (typeof chapters)[number];
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.8", "start 0.2"],
    });
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

    const Icon = chapter.icon;
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} className="relative">
            {/* Connecting line to next chapter */}
            {index < chapters.length - 1 && (
                <div
                    className="absolute left-1/2 top-full w-px h-20 -translate-x-1/2 hidden md:block"
                    style={{ background: `linear-gradient(to bottom, ${chapter.color}40, transparent)` }}
                />
            )}

            <motion.div
                style={{ opacity, y }}
                className="p-8 rounded-2xl"
            >
                {/* ─── Header row: badge + company + role (full width) ─── */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${chapter.color}18` }}
                    >
                        <Icon className="w-5 h-5" style={{ color: chapter.color }} />
                    </div>
                    <div>
                        <span
                            className="text-sm font-mono uppercase tracking-[0.2em] block mb-0.5"
                            style={{ color: chapter.color }}
                        >
                            {chapter.chapter} · {chapter.period}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                            {chapter.company}
                        </h3>
                        <p className="text-sm font-semibold text-foreground/60">
                            {chapter.role}
                        </p>
                    </div>
                </div>

                {/* ─── Two columns: Narrative + Highlights (aligned) ─── */}
                <div className={`grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start ${!isEven ? "md:direction-rtl" : ""
                    }`}>
                    {/* Story side */}
                    <div className={!isEven ? "md:order-2" : ""} style={{ direction: "ltr" }}>
                        <p className="text-base text-foreground/90 leading-relaxed mb-6 italic">
                            "{chapter.narrative}"
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            {chapter.reflection}
                        </p>
                        {chapter.promotion && (
                            <div
                                className="mt-4 px-4 py-3 rounded-xl text-sm font-medium"
                                style={{
                                    backgroundColor: `${chapter.color}10`,
                                    border: `1px solid ${chapter.color}25`,
                                    color: chapter.color,
                                }}
                            >
                                🏆 {chapter.promotion}
                            </div>
                        )}
                    </div>

                    {/* Highlights side */}
                    <div className={!isEven ? "md:order-1" : ""} style={{ direction: "ltr" }}>
                        <div className="space-y-3 mb-8">
                            {chapter.highlights.map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                        style={{ backgroundColor: chapter.color }}
                                    />
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {h}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {chapter.tech.map((t) => (
                                <span
                                    key={t}
                                    className="px-3 py-1.5 text-[11px] font-mono rounded-full border border-foreground/20 text-foreground/70"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ─── Main component ─── */
export default function ExperienceStory() {
    return (
        <section id="experience" className="relative py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px w-12 bg-foreground/20" />
                        <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
                            Experience
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
                        From intern
                        <br />
                        <span className="text-muted-foreground">to trusted engineer.</span>
                    </h2>
                </motion.div>

                {/* Story chapters */}
                <div className="space-y-16">
                    {chapters.map((chapter, i) => (
                        <StoryChapter key={chapter.id} chapter={chapter} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
