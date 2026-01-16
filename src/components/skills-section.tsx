import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  Database,
  Globe,
  Server,
  GitBranch,
  TestTube,
} from "lucide-react";

export default function SkillsSection() {
  const skills = [
    {
      name: "Frontend",
      description: "React, TypeScript, Tailwind CSS, Framer Motion",
      icon: Code,
      category: "web",
      size: "large",
    },
    {
      name: "Backend",
      description: "Node.js, Express, Python, REST APIs",
      icon: Server,
      category: "backend",
      size: "large",
    },
    {
      name: "Mobile",
      description: "Flutter, Dart, Cross-platform",
      icon: Smartphone,
      category: "mobile",
      size: "default",
    },
    {
      name: "Databases",
      description: "MongoDB, Firebase, PostgreSQL",
      icon: Database,
      category: "data",
      size: "default",
    },
    {
      name: "AI/ML",
      description: "TensorFlow, Python, Data Analysis",
      icon: Code,
      category: "ai",
      size: "default",
    },
    {
      name: "DevOps",
      description: "Git, Docker, Nginx, Deployment",
      icon: GitBranch,
      category: "devops",
      size: "default",
    },
    {
      name: "Tools & Testing",
      description: "Postman, Jest, Vite, ESLint",
      icon: TestTube,
      category: "tools",
      size: "default",
    },
    {
      name: "Geospatial",
      description: "GDAL, Leaflet.js, GeoJSON, Maps",
      icon: Globe,
      category: "geo",
      size: "default",
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Skills & Technologies
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg">
            I specialize in modern web and mobile development technologies,
            focusing on creating scalable and efficient solutions.
          </p>
        </motion.div>

        <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            const isLarge = skill.size === "large";
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`bento-item group relative overflow-hidden cursor-pointer ${
                  isLarge ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className={`w-12 h-12 mb-4 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                    <IconComponent className="w-6 h-6 text-primary group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className={`font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 ${
                    isLarge ? "text-xl" : "text-lg"
                  }`}>
                    {skill.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-grow">
                    {skill.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Learn more</span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
