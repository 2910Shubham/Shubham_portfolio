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
      name: "MERN Stack",
      description: "MongoDB, Express, React, Node.js",
      icon: Code,
    },
    {
      name: "Flutter",
      description: "Cross-platform mobile development",
      icon: Smartphone,
    },
    {
      name: "Firebase",
      description: "Backend as a Service platform",
      icon: Database,
    },
    {
      name: "REST APIs",
      description: "API design and integration",
      icon: Globe,
    },
    {
      name: "Nginx",
      description: "Web server and reverse proxy",
      icon: Server,
    },
    {
      name: "Hostinger",
      description: "Web hosting and deployment",
      icon: Globe,
    },
    {
      name: "Postman",
      description: "API testing and documentation",
      icon: TestTube,
    },
    {
      name: "Git & GitHub",
      description: "Version control and collaboration",
      icon: GitBranch,
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="skill-card bg-card p-6 rounded-xl shadow-lg border border-border text-center cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                  {skill.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
