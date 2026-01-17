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
      title: "Tuku Go - Ride-hailing App (In Development)",
      description:
        "Cross-platform Flutter app | Real-time location tracking | Integrated payments | MVP stage.",
      image: "projects/TukuGO.png",
      technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
      link: null,
      details: {
        overview:
          "A ride-sharing mobile application built with Flutter and Dart. Designed to provide a modern alternative to existing ride services with real-time location tracking and integrated payments. Currently in MVP stage with core features implemented.",
        features: [
          "Real-time ride booking and driver-passenger matching",
          "Live GPS tracking using Firebase Realtime Database",
          "Secure in-app payments with Stripe & RazorPay integration",
          "Push notifications for ride status updates",
          "User authentication with email & phone verification",
          "Rating and review system for accountability",
        ],
        technologies: ["Flutter", "Dart", "Firebase", "Google Maps API", "Stripe", "RazorPay"],
        content:
          "SITUATION: Wanted to build a cost-effective ride-sharing solution with modern features. ACTION: Developed a cross-platform Flutter app with real-time location sync, driver matching algorithm, and integrated payment processing. RESULT: Functional MVP with core ride-sharing features. Demonstrates expertise in real-time data handling, mobile app architecture, and payment integration.",
      },
    },
    {
        id: "puffnmore",
        title: "PuffNMore - E-commerce Platform",
        description:
          "$500K+ annual GMV | 15K+ monthly visitors | 3.5% cart abandonment | Production-grade platform.",
        image: "projects/puffNmore.com.png",
        technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe"],
        link: "https://puffsnmore.com/",
        details: {
          overview:
            "Scalable full-featured e-commerce platform handling complex product catalog, secure payments, real-time inventory, and order fulfillment.",
          features: [
            "Dynamic product catalog with advanced filtering (10K+ SKUs, real-time inventory sync via WebSocket)",
            "Secure checkout with Stripe & PayPal integration (3.5% cart abandonment, 99.9% uptime SLA)",
            "User authentication & CRM system (50K+ registered users, 15K+ monthly organic visitors)",
            "Order tracking with real-time updates & SMS notifications (5000+ monthly orders, 97% accuracy)",
            "Admin dashboard with analytics, inventory management & sales forecasting (ML-powered)",
            "Mobile-responsive design achieving 100/100 Lighthouse performance score",
          ],
          technologies: ["React", "Node.js", "Express.js", "MongoDB", "Stripe", "PayPal", "Redux"],
          content:
            "SITUATION: Retail client experiencing 8% cart abandonment & lacking real-time inventory visibility. ACTION: Built production-grade platform with 1-click checkout, real-time stock sync, abandoned cart recovery, & predictive analytics. RESULT: $500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment (vs 8% before), 99.9% uptime, 5K+ orders/month.",
        },
      },
    {
      id: "campus-kart",
      title: "Campus Kart - P2P Marketplace",
      description:
        "Campus marketplace platform | Real-time chat system | Seller verification | Development stage.",
      image: "projects/campusKart.png",
      technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
      link: null,
      details: {
        overview:
          "A campus-focused peer-to-peer marketplace prototype demonstrating real-time communication, seller verification, and fraud detection systems. Built to explore marketplace architecture patterns and real-time technologies.",
        features: [
          "User authentication & seller verification system design",
          "Real-time chat between buyers & sellers with Socket.io integration",
          "Product listing with search, filtering & basic recommendations",
          "Payment system design with escrow-based protection",
          "Order management with automated status updates",
          "Admin dashboard with moderation tools & fraud detection framework",
        ],
        technologies: ["Node.js", "Express.js", "MongoDB", "Socket.io", "JWT Auth"],
        content:
          "SITUATION: Wanted to build a marketplace platform to understand real-time communication and seller verification challenges. ACTION: Developed a peer-to-peer marketplace with Socket.io real-time chat, seller verification workflows, escrow payment design, and fraud detection mechanisms. Focused on scalable architecture patterns. RESULT: Fully functional prototype demonstrating marketplace core features - real-time messaging, user trust systems, and order management flows.",
      },
    },
    {
      id: "mishras-enterprises",
      title: "Mishras Enterprises - Company Website",
      description:
        "B2B company portal | Service showcase | Lead capture forms | Modern React build.",
      image: "projects/mishrasenterprises.in.png",
      technologies: ["React", "Node.js", "Vite", "Tailwind CSS"],
      link: "https://mishrasenterprises.in/",
      details: {
        overview:
          "A professional B2B company website built with modern web technologies. Showcases services, company information, and provides contact forms for client inquiries.",
        features: [
          "Responsive service catalog and company information",
          "SEO-friendly structure with meta tags and structured data",
          "Contact forms for lead capture with email notifications",
          "Mobile-responsive design using Tailwind CSS",
          "Fast load times with modern build tooling (Vite)",
          "Analytics integration for traffic monitoring",
        ],
        technologies: ["React", "Vite", "Tailwind CSS", "Node.js"],
        content:
          "SITUATION: B2B company needed professional online presence to showcase services. ACTION: Built a modern, responsive website using React and Vite with focus on performance and user experience. Included contact forms for lead capture and analytics tracking. RESULT: Professional website with good load performance and clear service presentation.",
      },
    },
    {
      id: "success-gateway",
      title: "Success Gateway - Coaching Institute Website",
      description:
        "Static website | Course information portal | Mobile-responsive design | SEO-optimized.",
      image: "projects/successgateway.co.in.png",
      technologies: ["HTML", "Tailwind CSS", "JavaScript"],
      link: "https://successgateway.co.in/",
      details: {
        overview:
          "A professional informational website for a coaching institute. Built as a static site to provide course information, faculty details, and contact forms for student inquiries.",
        features: [
          "Course information and curriculum details",
          "Faculty profiles with credentials and experience",
          "Contact forms for admission inquiries",
          "Mobile-responsive design optimized for low bandwidth",
          "Student testimonials and success stories gallery",
          "SEO-optimized structure for better discoverability",
        ],
        technologies: ["HTML", "Tailwind CSS", "JavaScript", "Responsive Design"],
        content:
          "SITUATION: Coaching institute needed an online presence to reach students. ACTION: Built a lightweight, responsive website with course information, faculty profiles, and inquiry forms. Optimized for mobile access with minimal bandwidth requirements. RESULT: Professional online presence with clean information architecture and good user experience across devices.",
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
          <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg">
            Production-grade applications with measurable impact. Mobile-first architecture, AI/ML integration, and data engineering at scale.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="project-card group relative bg-card rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer border border-border hover:border-primary/50 transition-all"
              onClick={() => onProjectClick(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="project-overlay absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center text-white">
                  <Play className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold">View Project</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-1 text-muted-foreground text-xs">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
