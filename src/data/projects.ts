export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  link?: string | null;
  details: {
    overview: string;
    features: string[];
    technologies: string[];
    content: string;
  };
};

export const PROJECTS: Project[] = [
  {
    id: "tuku-go",
    title: "Tuku Go - Ride-hailing App",
    category: "Mobile App",
    description:
      "Cross-platform Flutter app with real-time location tracking, integrated payments, and MVP architecture.",
    image: "/projects/TukuGO.png",
    technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    link: null,
    details: {
      overview:
        "A ride-sharing mobile application built with Flutter and Dart. Designed to provide a modern alternative to existing ride services with real-time location tracking and integrated payments.",
      features: [
        "Real-time ride booking and driver-passenger matching",
        "Live GPS tracking using Firebase Realtime Database",
        "Secure in-app payments with Stripe and RazorPay integration",
        "Push notifications for ride status updates",
        "User authentication with email and phone verification",
        "Rating and review system for accountability",
      ],
      technologies: ["Flutter", "Dart", "Firebase", "Google Maps API", "Stripe", "RazorPay"],
      content:
        "SITUATION: Wanted to build a cost-effective ride-sharing solution. ACTION: Developed a cross-platform Flutter app with real-time location sync, driver matching, and payment processing. RESULT: Functional MVP demonstrating expertise in real-time data handling and payment integration.",
    },
  },
  {
    id: "puffnmore",
    title: "PuffNMore - E-Commerce Platform",
    category: "E-Commerce",
    description:
      "$500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment. Production-grade storefront.",
    image: "/projects/puffNmore.com.png",
    technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe"],
    link: "https://puffsnmore.com/",
    details: {
      overview:
        "Scalable full-featured e-commerce platform handling complex product catalog, secure payments, real-time inventory, and order fulfillment.",
      features: [
        "Dynamic product catalog with advanced filtering (10K+ SKUs)",
        "Secure checkout with Stripe and PayPal integration",
        "User authentication and CRM system (50K+ registered users)",
        "Order tracking with real-time updates and SMS notifications",
        "Admin dashboard with analytics and sales forecasting",
        "Mobile-responsive design with 100/100 Lighthouse score",
      ],
      technologies: ["React", "Node.js", "Express.js", "MongoDB", "Stripe", "PayPal", "Redux"],
      content:
        "Built production-grade platform with 1-click checkout, real-time stock sync, abandoned cart recovery. RESULT: $500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment.",
    },
  },
  {
    id: "campus-kart",
    title: "Campus Kart - P2P Marketplace",
    category: "Marketplace",
    description:
      "Campus marketplace with real-time chat, seller verification, and full development lifecycle ownership.",
    image: "/projects/campusKart.png",
    technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
    link: "https://campuskart.meetshubham.site/",
    details: {
      overview:
        "A campus-focused peer-to-peer marketplace with real-time communication, seller verification, and fraud detection systems.",
      features: [
        "User authentication and seller verification system",
        "Real-time chat between buyers and sellers with Socket.io",
        "Product listing with search, filtering and recommendations",
        "Payment system with escrow-based protection",
        "Order management with automated status updates",
        "Admin dashboard with moderation tools and fraud detection",
      ],
      technologies: ["Node.js", "Express.js", "MongoDB", "Socket.io", "JWT Auth"],
      content:
        "Built a peer-to-peer marketplace with Socket.io real-time chat, seller verification workflows, escrow payment design, and fraud detection.",
    },
  },
  {
    id: "mishras-enterprises",
    title: "Mishras Enterprises - Company Website",
    category: "Business Site",
    description:
      "B2B company portal with service showcase, lead capture forms, and modern React build.",
    image: "/projects/mishrasenterprises.in.png",
    technologies: ["React", "Node.js", "Vite", "Tailwind CSS"],
    link: "https://mishrasenterprises.in/",
    details: {
      overview:
        "A professional B2B company website built with modern web technologies with services, company info, and contact forms.",
      features: [
        "Responsive service catalog and company information",
        "SEO-friendly structure with meta tags",
        "Contact forms for lead capture with email notifications",
        "Mobile-responsive design using Tailwind CSS",
        "Fast load times with Vite build tooling",
        "Analytics integration for traffic monitoring",
      ],
      technologies: ["React", "Vite", "Tailwind CSS", "Node.js"],
      content:
        "Built a modern, responsive business website with React and Vite focusing on performance and lead capture.",
    },
  },
  {
    id: "success-gateway",
    title: "Success Gateway - Coaching Institute",
    category: "Education",
    description:
      "Static website with course portal, mobile-responsive design, and SEO optimization.",
    image: "/projects/successgateway.co.in.png",
    technologies: ["HTML", "Tailwind CSS", "JavaScript"],
    link: "https://successgateway.co.in/",
    details: {
      overview:
        "Professional informational website for a coaching institute with course information, faculty details, and contact forms.",
      features: [
        "Course information and curriculum details",
        "Faculty profiles with credentials",
        "Contact forms for admission inquiries",
        "Mobile-responsive optimized for low bandwidth",
        "Student testimonials gallery",
        "SEO-optimized structure",
      ],
      technologies: ["HTML", "Tailwind CSS", "JavaScript", "Responsive Design"],
      content:
        "Built a lightweight, responsive website with course information, faculty profiles, and inquiry forms optimized for mobile.",
    },
  },
  {
    id: "green-island-uhi",
    title: "Green Island - Urban Heat Visualizer",
    category: "AI / Research",
    description:
      "Data-driven platform to detect, visualize, and mitigate Urban Heat Islands using satellite data and AI.",
    image: "/projects/UHI.png",
    technologies: ["Next.js", "Streamlit", "Leaflet.js", "Python", "TensorFlow", "GDAL"],
    link: "https://greenisland-uhi.vercel.app/",
    details: {
      overview:
        "Full-stack web platform leveraging satellite imagery, semantic segmentation, and real-time sensor data to map temperature hotspots in Patna.",
      features: [
        "Real-time temperature monitoring",
        "Roof detection using UNet + ResNet50",
        "Heatmap visualization from satellite data",
        "Vegetation density analysis",
        "GeoJSON-based area segmentation with Leaflet.js",
        "Green intervention recommendations",
      ],
      technologies: ["Next.js", "Streamlit", "Leaflet.js", "Python", "GDAL", "TensorFlow", "Scikit-learn"],
      content:
        "Revealed 6.88 C rise in Patna's surface temperature (1990-2022) and demonstrated AI-powered UHI mapping for urban planners.",
    },
  },
];

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((p) => [p.id, p])) as Record<string, Project>;
