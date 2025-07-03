import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProjectModal from "@/components/project-modal";
import { GallerySection } from "./gallery";
import { useState } from "react";
import CareerTimeline from "@/components/career-timeline";

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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-white">
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
  );
}
