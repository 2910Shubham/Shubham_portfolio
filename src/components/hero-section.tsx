import { Button } from "@/components/ui/button";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import KineticTypography from "./kinetic-typography";

const HeroSection = memo(function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="float-animation"
        >
          <h1 className="text-4xl p-3 sm:text-5xl lg:text-7xl font-bold text-foreground mb-6">
            <KineticTypography 
              text="Hi, I'm Shubham Kr. Mishra" 
              className="block"
            />
            <motion.span
              className="gradient-text block mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Full Stack Developer
            </motion.span>
          </h1>
          <motion.p 
            className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            Specialized in Mobile & Web Applications
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Passionate about crafting elegant, scalable solutions. Specialized in MERN Stack, 
          Flutter development, and data-driven architectures with a focus on performance and user experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Let's Work Together
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="border-2 border-primary text-primary px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View My Work
          </Button>
        </motion.div>

        {/* Social Links Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="mt-12 px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {/* GitHub - Blue Gradient */}
          <motion.a
            href="https://github.com/2910Shubham"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative group overflow-hidden rounded-xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
            <div className="relative z-10 p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all duration-300">
              <Github className="w-6 h-6 text-blue-400" />
            </div>
            <div className="relative z-10 text-center">
              <span className="font-bold text-base text-white block">GitHub</span>
              <span className="text-xs text-blue-300 group-hover:text-blue-200 transition-colors">Code & Projects</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.a>

          {/* LinkedIn - Blue Gradient */}
          <motion.a
            href="https://www.linkedin.com/in/shubham-kumar-mishra-/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative group overflow-hidden rounded-xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
            <div className="relative z-10 p-3 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-all duration-300">
              <Linkedin className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="relative z-10 text-center">
              <span className="font-bold text-base text-white block">LinkedIn</span>
              <span className="text-xs text-cyan-300 group-hover:text-cyan-200 transition-colors">Professional</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.a>

          {/* Email - Purple Gradient */}
          <motion.a
            href="mailto:2910viwan@gmail.com"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative group overflow-hidden rounded-xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-purple-500 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
            <div className="relative z-10 p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-all duration-300">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div className="relative z-10 text-center">
              <span className="font-bold text-base text-white block">Email</span>
              <span className="text-xs text-purple-300 group-hover:text-purple-200 transition-colors">Let's Connect</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
