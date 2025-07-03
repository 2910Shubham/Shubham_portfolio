import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
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
          transition={{ duration: 0.8 }}
          className="float-animation"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6">
            Hi, I'm{" "}
            <span className="gradient-text">Shubham Kumar Mishra</span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8">
            Full Stack Web & App Developer
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Passionate about creating modern web applications and mobile
          experiences using cutting-edge technologies. Specialized in MERN Stack
          and Flutter development with a focus on clean, scalable solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
