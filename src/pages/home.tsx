import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProjectModal from "@/components/project-modal";
import { GallerySection } from "./gallery";
import { useState, useEffect } from "react";
import CareerTimeline from "@/components/career-timeline";
import WebGLBackground from "@/components/webgl-background";
import MouseFollower from "@/components/mouse-follower";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string | null;
  details: {
    overview: string;
    features: string[];
    technologies: string[];
    content: string;
  };
}

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Listen for theme changes on the <html> element
  useEffect(() => {
    const html = document.documentElement;

    const checkTheme = () => {
      setIsDark(html.classList.contains("dark"));
    };

    // Check initial theme
    checkTheme();

    // Observe class changes on <html>
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* WebGL Interactive Particle Background */}
      <WebGLBackground isDark={isDark} />

      {/* Custom Mouse Follower */}
      <MouseFollower />

      {/* Content (above the canvas) */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CareerTimeline />
        <ProjectsSection onProjectClick={handleProjectClick} />
        <ContactSection />
        <div id="gallery">
          <GallerySection />
        </div>
        <Footer />
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
