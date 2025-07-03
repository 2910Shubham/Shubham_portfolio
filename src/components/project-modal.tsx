import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Project = {
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
};

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  {project.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              {project.link && (
                <div className="mb-6 text-right">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded shadow hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              <div className="prose max-w-none">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <h4 className="text-xl font-semibold mb-4 text-foreground">
                  Project Overview
                </h4>
                <p className="mb-4 text-muted-foreground">
                  {project.details.overview}
                </p>

                <h4 className="text-xl font-semibold mb-4 text-foreground">
                  Key Features
                </h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {project.details.features.map((feature, index) => (
                    <li key={index} className="text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>

                <h4 className="text-xl font-semibold mb-4 text-foreground">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.details.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground">
                  {project.details.content}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
