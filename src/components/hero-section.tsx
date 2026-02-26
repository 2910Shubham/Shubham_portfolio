import { Github, Linkedin, Mail, ArrowDown, MapPin, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { memo, useRef } from "react";

const HeroSection = memo(function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-0">
        <div className="max-w-3xl">
          {/* ─── Left: Main content ─── */}
          <motion.div
            style={{ y: nameY, opacity: fadeOut }}
            className="relative z-10"
          >
            {/* Status line */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-mono text-muted-foreground tracking-wide">
                Available for new projects
              </span>
            </motion.div>

            {/* Name — editorial split */}
            <div className="mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-foreground leading-[0.95] tracking-tight"
              >
                Shubham
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight"
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, #6366f1 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kr. Mishra
              </motion.h1>
            </div>

            {/* Role line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-10 bg-primary/60" />
              <span className="text-lg sm:text-xl font-medium text-muted-foreground">
                Full Stack Developer
              </span>
            </motion.div>

            {/* Description — short, punchy, not generic */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              Full-Stack Engineer crafting scalable products with precision and performance. —{" "}
              <span className="text-foreground font-medium">e-commerce platforms</span> {", "}
              <span className="text-foreground font-medium">Mobile apps</span> {", "}
              <span className="text-foreground font-medium">AI-powered</span>
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <button
                onClick={() => scrollTo("contact")}
                className="group relative px-7 py-3.5 bg-foreground text-background rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Let's Work Together
                </span>
                <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                <span className="absolute inset-0 flex items-center justify-center gap-2 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 z-10">
                  <Sparkles className="w-4 h-4" />
                  Let's Work Together
                </span>
              </button>
              <button
                onClick={() => scrollTo("projects")}
                className="px-7 py-3.5 border border-border rounded-full text-sm font-semibold text-foreground hover:border-foreground transition-all duration-300"
              >
                View My Work →
              </button>
            </motion.div>

            {/* Social strip — minimal, not bento cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center gap-5"
            >
              {[
                { icon: Github, href: "https://github.com/2910Shubham", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", label: "LinkedIn" },
                { icon: Mail, href: "mailto:2910viwan@gmail.com", label: "Email" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
              <span className="h-5 w-px bg-border mx-1" />
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> Patna, India
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-[10px] font-mono uppercase tracking-[3px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
});

export default HeroSection;
