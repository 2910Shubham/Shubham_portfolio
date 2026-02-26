import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { useRef, useEffect, useCallback, useState } from "react";

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

/* ────── holographic canvas shimmer ────── */
function HoloCanvas({ active, mouseX, mouseY }: { active: boolean; mouseX: number; mouseY: number }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const pgRef = useRef<WebGLProgram | null>(null);
  const uRef = useRef<{ time: WebGLUniformLocation | null; mouse: WebGLUniformLocation | null; res: WebGLUniformLocation | null }>({ time: null, mouse: null, res: null });
  const frameRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;
    glRef.current = gl;

    const vsSrc = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;
    const fsSrc = `precision mediump float;
uniform float u_time;uniform vec2 u_mouse;uniform vec2 u_res;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
vec3 hsl(float h,float s,float l){vec3 r=clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);return l+s*(r-0.5)*(1.0-abs(2.0*l-1.0));}
void main(){vec2 uv=gl_FragCoord.xy/u_res;uv+=(u_mouse-0.5)*0.12;
float n=(noise(uv*3.0+u_time*0.3)+noise(uv*7.0-u_time*0.2)*0.5+noise(uv*13.0+u_time*0.5)*0.25)/1.75;
vec3 c=hsl(n+u_time*0.08,0.75,0.55);
float st=sin((uv.x+uv.y)*25.0+u_time*1.5)*0.5+0.5;
c=mix(c,c*1.3,smoothstep(0.3,0.7,st)*0.35);
c*=clamp(1.0-length((uv-0.5)*1.5),0.0,1.0);
gl_FragColor=vec4(c,1.0);}`;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSrc); gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSrc); gl.compileShader(fs);
    const pg = gl.createProgram()!;
    gl.attachShader(pg, vs); gl.attachShader(pg, fs); gl.linkProgram(pg);
    pgRef.current = pg;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pg, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uRef.current = {
      time: gl.getUniformLocation(pg, "u_time"),
      mouse: gl.getUniformLocation(pg, "u_mouse"),
      res: gl.getUniformLocation(pg, "u_res"),
    };

    const r = cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, 2);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    gl.viewport(0, 0, cv.width, cv.height);
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const pg = pgRef.current;
    const cv = cvRef.current;
    if (!gl || !pg || !cv) return;

    if (active) {
      const render = () => {
        const t = (performance.now() - startRef.current) * 0.001;
        gl.useProgram(pg);
        gl.uniform1f(uRef.current.time, t);
        gl.uniform2f(uRef.current.mouse, mouseX, 1 - mouseY);
        gl.uniform2f(uRef.current.res, cv.width, cv.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frameRef.current = requestAnimationFrame(render);
      };
      render();
    } else {
      cancelAnimationFrame(frameRef.current);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, mouseX, mouseY]);

  return (
    <canvas
      ref={cvRef}
      className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none transition-opacity duration-500"
      style={{
        zIndex: 2,
        mixBlendMode: "color-dodge",
        opacity: active ? 0.3 : 0,
      }}
    />
  );
}

/* ────── accent colors per project ────── */
const ACCENT_COLORS = [
  "#00e5cc", // tuku go
  "#7c5cfc", // puffnmore
  "#ff5e87", // campus kart
  "#ffd97d", // mishras
  "#ff9f43", // success gateway
  "#2ecc71", // green island
];

const STATUS_LABELS: Record<string, { text: string; class: string }> = {
  "tuku-go": { text: "In Development", class: "text-[#00e5cc] border-[#00e5cc]/30" },
  "puffnmore": { text: "Live", class: "text-[#2ecc71] border-[#2ecc71]/30" },
  "campus-kart": { text: "Live", class: "text-[#2ecc71] border-[#2ecc71]/30" },
  "mishras-enterprises": { text: "Live", class: "text-[#2ecc71] border-[#2ecc71]/30" },
  "success-gateway": { text: "Live", class: "text-[#2ecc71] border-[#2ecc71]/30" },
  "green-island-uhi": { text: "Research", class: "text-[#7c5cfc] border-[#7c5cfc]/30" },
};

/* ────── single project card ────── */
function ProjectCard({
  project,
  index,
  onProjectClick,
}: {
  project: Project;
  index: number;
  onProjectClick: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const accent = ACCENT_COLORS[index] || "#7c5cfc";
  const status = STATUS_LABELS[project.id];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
      setTilt({
        rx: -(y - 0.5) * 20,
        ry: (x - 0.5) * 20,
      });
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, rotateY: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative cursor-pointer"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onProjectClick(project)}
    >
      <div
        className="relative rounded-2xl overflow-hidden border transition-all duration-500"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          background: "var(--card)",
          borderColor: hovered ? `${accent}55` : "var(--border)",
          boxShadow: hovered
            ? `0 0 0 1px ${accent}44, 0 25px 60px ${accent}18, 0 8px 24px rgba(0,0,0,0.3)`
            : "0 4px 24px rgba(0,0,0,0.08)",
          transition: "transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Holographic shader overlay */}
        {!isMobile && <HoloCanvas active={hovered} mouseX={mousePos.x} mouseY={mousePos.y} />}

        {/* Specular light glint */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            zIndex: 3,
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 200px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
          }}
        />

        {/* Card content */}
        <div className="relative z-[1] p-5">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-4">
            {status && (
              <span
                className={`text-[10px] font-mono font-medium uppercase tracking-widest px-3 py-1 rounded-full border ${status.class}`}
              >
                {status.text}
              </span>
            )}
            <span className="text-[11px] font-mono text-muted-foreground/50">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Thumbnail */}
          <div
            className="relative w-full aspect-video rounded-xl overflow-hidden mb-5"
            style={{
              transform: hovered ? "translateZ(30px) scale(1.02)" : "translateZ(0) scale(0.98)",
              transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
            />
            {/* Gradient tint overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${accent}18, transparent 60%), linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)`,
              }}
            />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 leading-tight line-clamp-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags — stagger in on hover */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 4).map((tech, ti) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all duration-300"
                style={{
                  borderColor: hovered ? `${accent}40` : "var(--border)",
                  color: hovered ? accent : "var(--muted-foreground)",
                  opacity: hovered ? 1 : 0.6,
                  transform: hovered ? "translateY(0)" : "translateY(4px)",
                  transitionDelay: hovered ? `${ti * 50}ms` : "0ms",
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] font-mono px-2 py-1 text-muted-foreground/40">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between">
            <span
              className="flex items-center gap-2 text-xs font-medium transition-all duration-300"
              style={{ color: hovered ? accent : "var(--muted-foreground)" }}
            >
              <span
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: accent, boxShadow: hovered ? `0 0 8px ${accent}` : "none" }}
              />
              View Project
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
              />
            </span>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="h-[2px] transition-all duration-500"
          style={{
            background: hovered
              ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
              : "transparent",
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ────── main section ────── */
export default function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const projects: Project[] = [
    {
      id: "tuku-go",
      title: "Tuku Go — Ride-hailing App",
      description:
        "Cross-platform Flutter app with real-time location tracking, integrated payments, and MVP architecture.",
      image: "projects/TukuGO.png",
      technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
      link: null,
      details: {
        overview:
          "A ride-sharing mobile application built with Flutter and Dart. Designed to provide a modern alternative to existing ride services with real-time location tracking and integrated payments.",
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
          "SITUATION: Wanted to build a cost-effective ride-sharing solution. ACTION: Developed a cross-platform Flutter app with real-time location sync, driver matching, and payment processing. RESULT: Functional MVP demonstrating expertise in real-time data handling and payment integration.",
      },
    },
    {
      id: "puffnmore",
      title: "PuffNMore — E-Commerce Platform",
      description:
        "$500K+ annual GMV, 15K+ monthly visitors, 3.5% cart abandonment. Production-grade storefront.",
      image: "projects/puffNmore.com.png",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe"],
      link: "https://puffsnmore.com/",
      details: {
        overview:
          "Scalable full-featured e-commerce platform handling complex product catalog, secure payments, real-time inventory, and order fulfillment.",
        features: [
          "Dynamic product catalog with advanced filtering (10K+ SKUs)",
          "Secure checkout with Stripe & PayPal integration",
          "User authentication & CRM system (50K+ registered users)",
          "Order tracking with real-time updates & SMS notifications",
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
      title: "Campus Kart — P2P Marketplace",
      description:
        "Campus marketplace with real-time chat, seller verification, and full development lifecycle ownership.",
      image: "projects/campusKart.png",
      technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
      link: "https://campuskart.meetshubham.site/",
      details: {
        overview:
          "A campus-focused peer-to-peer marketplace with real-time communication, seller verification, and fraud detection systems.",
        features: [
          "User authentication & seller verification system",
          "Real-time chat between buyers & sellers with Socket.io",
          "Product listing with search, filtering & recommendations",
          "Payment system with escrow-based protection",
          "Order management with automated status updates",
          "Admin dashboard with moderation tools & fraud detection",
        ],
        technologies: ["Node.js", "Express.js", "MongoDB", "Socket.io", "JWT Auth"],
        content:
          "Built a peer-to-peer marketplace with Socket.io real-time chat, seller verification workflows, escrow payment design, and fraud detection.",
      },
    },
    {
      id: "mishras-enterprises",
      title: "Mishras Enterprises — Company Website",
      description:
        "B2B company portal with service showcase, lead capture forms, and modern React build.",
      image: "projects/mishrasenterprises.in.png",
      technologies: ["React", "Node.js", "Vite", "Tailwind CSS"],
      link: "https://mishrasenterprises.in/",
      details: {
        overview:
          "A professional B2B company website built with modern web technologies — services, company info, and contact forms.",
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
      title: "Success Gateway — Coaching Institute",
      description:
        "Static website with course portal, mobile-responsive design, and SEO optimization.",
      image: "projects/successgateway.co.in.png",
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
      title: "Green Island — Urban Heat Visualizer",
      description:
        "Data-driven platform to detect, visualize, and mitigate Urban Heat Islands using satellite data and AI.",
      image: "projects/UHI.png",
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
        technologies: [
          "Next.js", "Streamlit", "Leaflet.js",
          "Python", "GDAL", "TensorFlow", "Scikit-learn",
        ],
        content:
          "Revealed 6.88°C rise in Patna's surface temperature (1990–2022) and demonstrated AI-powered UHI mapping for urban planners.",
      },
    },
  ];

  return (
    <section ref={sectionRef} id="projects" className="py-24 relative overflow-hidden">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[1]">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="w-24 h-1 bg-primary mx-auto rounded-full origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg"
          >
            Production-grade applications with measurable impact. Mobile-first architecture,
            AI/ML integration, and data engineering at scale.
          </motion.p>
        </motion.div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onProjectClick={onProjectClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
