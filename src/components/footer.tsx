import { Github, Linkedin, Mail, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/2910Shubham",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/shubham-kumar-mishra-/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:2910viwan@gmail.com",
      label: "Email",
    },
  ];

  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Green Island", href: "/green-island" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">
              Shubham Kumar Mishra
            </h3>
            <p className="text-slate-400 mb-4">
              Full Stack Developer & Builder
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Crafting modern web experiences with clean code and creative solutions. Always learning, always building.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 border border-slate-700 hover:border-blue-500 group"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            by Shubham &bull; {currentYear}
          </p>
          <p className="text-slate-600 text-sm">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
    </footer>
  );
}
