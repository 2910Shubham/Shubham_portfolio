import { motion } from "framer-motion";
import {
  Smartphone,
  BarChart3,
  Zap,
  Award,
  GraduationCap,
  MapPin,
} from "lucide-react";

/* ─── Data ─── */

const skills = [
  { icon: Smartphone, label: "Mobile-First", accent: "#6366f1" },
  { icon: BarChart3, label: "Data-Driven", accent: "#8b5cf6" },
  { icon: Zap, label: "Full-Stack", accent: "#06b6d4" },
  { icon: Award, label: "Hackathon Winner", accent: "#f59e0b" },
];



export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* ─── Header ─── */}
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
              About
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
            Engineer who
            <br />
            builds things
            <br />
            <span className="text-muted-foreground">that matter.</span>
          </h2>
        </motion.div>

        {/* ─── Two-column: Big Image + Bio ─── */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center mb-24">
          {/* Left — Large profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex flex-col items-center lg:items-start">
              {/* Large circular profile image — hides the white bg */}
              <div className="relative mb-8">
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden ">
                  <img
                    src="images/shubham1.png"
                    alt="Shubham Kumar Mishra"
                    className=""
                  />
                </div>
              </div>

              {/* Name & location under the image */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Shubham Kr. Mishra
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Patna, India
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> BCA, Patna University
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right — Bio + Skills */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Full-stack engineer specializing in{" "}
              <span className="text-foreground font-medium">
                mobile-first development
              </span>
              . I build production-grade applications that solve real-world
              problems — from cross-platform mobile apps to AI-powered
              geospatial platforms.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed mb-10">
              I care about clean code, performance, and user experience.
              Every project I ship is built to work at scale.
            </p>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-3">
              {skills.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm text-foreground hover:border-foreground/30 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" style={{ color: s.accent }} />
                    {s.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
