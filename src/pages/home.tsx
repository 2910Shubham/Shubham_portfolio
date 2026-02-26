import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ExperienceStory from "@/components/experience-story";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProjectModal from "@/components/project-modal";
import { GallerySection } from "./gallery";
import { useState, useEffect } from "react";
import CareerTimeline from "@/components/career-timeline";
import WebGLBackground from "@/components/webgl-background";
import MouseFollower from "@/components/mouse-follower";
import FloatingMascot from "@/components/floating-mascot";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

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

  // ─── Lenis buttery smooth scroll ───
  useSmoothScroll();

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
    <div className="min-h-screen relative" style={{ background: "var(--li-bg)" }}>
      {/* Light mode atmospheric gradient overlay */}
      {!isDark && (
        <div className="fixed inset-0 pointer-events-none z-[1]" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(79,70,229,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 15% 85%, rgba(217,119,6,0.04) 0%, transparent 60%)
          `,
        }} />
      )}

      {/* WebGL Interactive Particle Background */}
      <WebGLBackground isDark={isDark} />

      {/* Custom Mouse Follower */}
      <MouseFollower />

      {/* Floating Mascot — starts in hero, follows user on scroll */}
      <FloatingMascot />

      {/* Content (above the canvas) */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ExperienceStory />
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
