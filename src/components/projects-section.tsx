import { motion } from "framer-motion";
import { Play } from "lucide-react";

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

interface ProjectsSectionProps {
  onProjectClick: (project: Project) => void;
}

export default function ProjectsSection({
  onProjectClick,
}: ProjectsSectionProps) {
  const projects: Project[] = [
    {
      id: "tuku-go",
      title: "Tuku Go - City Travel App",
      description:
        "A city travel app like Uber and Rapido, built with Flutter and Dart. Real-time ride booking, live tracking, and seamless payments.",
      image: "projects/TukuGO.png",
      technologies: ["Flutter", "Dart", "Firebase"],
      link: null, // No public web link
      details: {
        overview:
          "Tuku Go is a modern city travel application inspired by Uber and Rapido, developed using Flutter and Dart. It offers real-time ride booking, live driver tracking, and secure payment integration. The app is designed for both drivers and passengers, providing a smooth and intuitive user experience.",
        features: [
          "Real-time ride booking and matching",
          "Live driver and ride tracking on maps",
          "Secure in-app payments",
          "Push notifications for ride status",
          "User authentication and profile management",
        ],
        technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
        content:
          "Tuku Go demonstrates my expertise in cross-platform mobile development, real-time data handling, and seamless user experience design.",
      },
    },
    {
      id: "campus-kart",
      title: "Campus Kart - Peer-to-Peer Marketplace",
      description:
        "A campus marketplace for peer-to-peer product selling. Built with EJS, Node.js, Express, and MongoDB.",
      image: "projects/campusKart.png",
      technologies: ["Node.js", "Express", "EJS", "MongoDB"],
      link: null, // No public web link
      details: {
        overview:
          "Campus Kart is a peer-to-peer marketplace platform designed for students to buy and sell products within their campus. The solution is built using EJS for templating, Node.js and Express for the backend, and MongoDB for data storage.",
        features: [
          "User registration and authentication",
          "Product listing and search",
          "Chat and negotiation between buyers and sellers",
          "Order management and notifications",
          "Admin dashboard for moderation",
        ],
        technologies: ["Node.js", "Express", "EJS", "MongoDB"],
        content:
          "This project highlights my skills in building scalable web applications, real-time communication, and secure user management.",
      },
    },
    {
      id: "mishras-enterprises",
      title: "Mishras Enterprises - Company Portfolio",
      description:
        "A client project for a business portfolio website, created with React, Node.js, and Vite.",
      image: "projects/mishrasenterprises.in.png",
      technologies: ["React", "Node.js", "Vite"],
      link: "https://mishrasenterprises.in/",
      details: {
        overview:
          "Mishras Enterprises is a professional company portfolio website developed for a client. The site is built with React for the frontend, Node.js for the backend, and Vite for fast development and build.",
        features: [
          "Modern, responsive design",
          "Company services and portfolio showcase",
          "Contact forms and lead capture",
          "SEO optimization",
          "Admin panel for content management",
        ],
        technologies: ["React", "Node.js", "Vite"],
        content:
          "This project demonstrates my ability to deliver high-quality, client-focused web solutions with modern tech stacks.",
      },
    },
    {
      id: "success-gateway",
      title: "Success Gateway - Coaching Institute Website",
      description:
        "A coaching institute website built with HTML, Tailwind CSS, and JavaScript. Clean, informative, and mobile-friendly.",
      image: "projects/successgateway.co.in.png",
      technologies: ["HTML", "Tailwind CSS", "JavaScript"],
      link: "https://successgateway.co.in/",
      details: {
        overview:
          "Success Gateway is a website for a coaching institute, designed to provide information about courses, faculty, and admissions. Built with HTML, Tailwind CSS, and JavaScript for a fast, responsive, and visually appealing experience.",
        features: [
          "Course listings and details",
          "Faculty profiles",
          "Admission inquiry forms",
          "Responsive and mobile-friendly design",
          "Gallery and testimonials",
        ],
        technologies: ["HTML", "Tailwind CSS", "JavaScript"],
        content:
          "This project showcases my frontend development skills and ability to create clean, user-centric educational websites.",
      },
    },
    {
      id: "puffnmore",
      title: "PuffNMore - Vape E-commerce Website",
      description:
        "A client project for an online vape selling website, built with React, Node.js, and MongoDB. Features product catalog, secure checkout, and admin dashboard.",
      image: "projects/puffNmore.com.png",
      technologies: ["React", "Node.js", "MongoDB", "Express.js"],
      link: "https://puffsnmore.com/",
      details: {
        overview:
          "PuffNMore is a modern e-commerce platform developed for a client in the vape industry. The website features a comprehensive product catalog, secure checkout process, and an admin dashboard for inventory and order management. Built with React for the frontend and Node.js/Express/MongoDB for the backend, it ensures a seamless shopping experience and robust backend operations.",
        features: [
          "Product catalog with search and filtering",
          "User authentication and profile management",
          "Secure checkout and payment integration",
          "Order tracking and history",
          "Admin dashboard for inventory and order management",
        ],
        technologies: ["React", "Node.js", "Express.js", "MongoDB"],
        content:
          "This project demonstrates my ability to deliver scalable, secure, and user-friendly e-commerce solutions tailored to client requirements.",
      },
    },
    {
      id: "green-island-uhi",
      title: "Green Island — Urban Heat Island Visualizer & Reducer",
      description:
        "A data-driven web platform to detect, visualize, and suggest mitigation strategies for Urban Heat Islands (UHIs) in Patna. Built for Techphilia & Hackathon 2025, Amity University Patna.",
      image: "projects/UHI.png",
      technologies: [
        "Next.js",
        "Streamlit",
        "Leaflet.js",
        "Python",
        "GDAL",
        "Rasterio",
        "NumPy",
        "Pandas",
        "TensorFlow",
        "Scikit-learn",
        "UNet",
        "ResNet50",
        "Chart.js",
      ],
      link: "https://greenisland-uhi.vercel.app/",
      details: {
        overview:
          "Green Island is a full-stack web platform that leverages satellite imagery, semantic segmentation, and real-time sensor data to map temperature hotspots and green cover loss in Patna. The project provides actionable insights and recommendations for urban planners to mitigate Urban Heat Islands (UHIs).",
        features: [
          "Real-time temperature monitoring",
          "Roof detection using UNet + ResNet50 (transfer learning)",
          "Heatmap visualization from satellite data",
          "Vegetation density analysis",
          "GeoJSON-based area segmentation with Leaflet.js",
          "Green intervention recommendations",
        ],
        technologies: [
          "Frontend: Next.js, Streamlit, Leaflet.js (interactive GeoJSON maps)",
          "Backend: Python 3.10, GDAL, Rasterio, NumPy, Pandas",
          "Machine Learning: TensorFlow 2.13, Scikit-learn, UNet (ResNet50 encoder, transfer learning)",
          "Visualization: Chart.js, Heatmap overlays",
        ],
        content:
          "Green Island revealed a 6.88°C rise in Patna’s surface temperature (1990–2022), visualized the urgent need for green planning in dense urban pockets, and demonstrated AI-powered UHI mapping and prediction to urban planners and policy experts.",
      },
    },
  ];

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg">
            Here are some of my recent projects that showcase my expertise in
            full-stack development and mobile app creation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="project-card group relative bg-card rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer"
              onClick={() => onProjectClick(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="project-overlay absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold">View Project</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
