import { motion } from "framer-motion";
import { Smartphone, BarChart3, Zap, Award } from "lucide-react";

export default function AboutSection() {
  const specializations = [
    {
      icon: Smartphone,
      title: "Mobile-First Development",
      description: "Cross-platform Flutter apps & responsive mobile-optimized web applications with 99%+ performance scores.",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Solutions",
      description: "AI/ML integration, satellite imagery analysis, UHI mapping, and geospatial data visualization at scale.",
    },
    {
      icon: Zap,
      title: "Full-Stack Performance",
      description: "End-to-end optimization from real-time data pipelines to responsive UIs. Real-time ride tracking, live heatmaps.",
    },
    {
      icon: Award,
      title: "Production-Grade Code",
      description: "Techphilia 2025 Hackathon winner. Deployed apps serving 1000+ users with secure payment & authentication.",
    },
  ];

  const experience = [
    {
      role: "Software Engineer Intern",
      company: "Internnexus",
      achievement: "Engineered Career Bridge platform | Real-time job-matching algorithm | 50% faster UX",
    },
    {
      role: "Frontend Engineer Intern",
      company: "Sikati.in",
      achievement: "Built dynamic Mobile applications frontend | Reduced load time by 40% | Improved user engagement",
    },
    {
      role: "Smart India Hackathon Finalist",
      company: "Govt. of India",
      achievement: "Build a Gamified Solition for Ocean Literacy | Top 5/500+ teams nationwide",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full Stack Engineer
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
        </motion.div>

        {/* Profile Image – Always on top, centered */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="relative group">
            {/* Decorative gradient ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary via-blue-400 to-indigo-600 opacity-60 group-hover:opacity-100 blur-md transition-opacity duration-500" />
            <img
              src="images/shubham1.png"
              alt="Shubham Kumar Mishra - Professional Developer Portrait"
              className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full shadow-2xl object-cover border-4 border-background hover-lift"
            />
          </div>
        </motion.div>

        {/* Bio text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm <span className="font-semibold text-foreground">Shubham Kumar Mishra</span>, a full-stack engineer specializing in <span className="font-semibold text-primary">mobile-first development</span>.  I build production-grade applications that solve real-world problems—from cross-platform mobile apps serving thousands of users to AI-powered geospatial analysis platforms.
          </p>
          <p className="text-sm text-primary font-semibold mt-4">
            📚 Bachelor of Computer Application | Patna University
          </p>
        </motion.div>

        {/* Specialization cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {specializations.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <Icon className="w-5 h-5 text-primary mb-2" />
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  {spec.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {spec.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Professional Experience */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-semibold text-foreground text-lg mb-4 text-center">Professional Experience</h3>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="pl-4 border-l-2 border-primary"
              >
                <p className="font-semibold text-foreground">{exp.role}</p>
                <p className="text-sm text-primary">{exp.company}</p>
                <p className="text-sm text-muted-foreground">{exp.achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
