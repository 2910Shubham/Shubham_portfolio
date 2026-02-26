import { Github, Linkedin, Mail, Twitter, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollTop(entry.isIntersecting),
      { threshold: 0.12 },
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkColumns = [
    {
      links: [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      links: [
        { label: "GitHub", href: "https://github.com/2910Shubham", external: true },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", external: true },
        { label: "Email", href: "mailto:2910viwan@gmail.com" },
        { label: "Resume", href: "#" },
      ],
    },
    {
      links: [
        { label: "Green Island", href: "/green-island" },
        { label: "Gallery", href: "#gallery" },
        { label: "PuffNMore", href: "https://puffsnmore.com/", external: true },
        { label: "Campus Kart", href: "https://campuskart.meetshubham.site/", external: true },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/2910Shubham", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/shubham-kumar-mishra-/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:2910viwan@gmail.com", label: "Email" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <>
    <footer ref={footerRef} className="relative bg-background border-t border-border overflow-hidden">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-12 md:gap-8">
          {/* Left — tagline */}
          <div>
            <p className="text-xl sm:text-2xl font-medium text-foreground leading-snug">
              Full Stack Web<br />Developer
            </p>
            <div className="flex gap-3 mt-8">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map((col, ci) => (
            <nav key={ci} className="flex flex-col gap-3">
              {col.links.map((link, li) => (
                <a
                  key={li}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>

      {/* Giant name */}
      <div className="relative px-4 sm:px-6 overflow-hidden select-none">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="text-foreground font-black tracking-tighter leading-[0.85] text-center"
          style={{
            fontSize: "clamp(80px, 18vw, 280px)",
            letterSpacing: "-0.04em",
          }}
        >
          Shubham
        </motion.h2>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} Shubham Kumar Mishra. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
    <motion.button
      initial={{ opacity: 0, x: 12, scale: 0.92 }}
      animate={{
        opacity: showScrollTop ? 1 : 0,
        x: showScrollTop ? 0 : 12,
        scale: showScrollTop ? 1 : 0.92,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed right-5 sm:right-7 bottom-7 sm:bottom-9 z-[1000] w-11 h-11 rounded-full border border-border bg-background/85 backdrop-blur-md text-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      style={{ pointerEvents: showScrollTop ? "auto" : "none" }}
    >
      <ArrowUp className="w-4 h-4 mx-auto" />
    </motion.button>
    </>
  );
}
