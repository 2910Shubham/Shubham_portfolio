import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/shubham-kumar-mishra-",
      label: "LinkedIn Profile",
    },
    {
      icon: Github,
      href: "https://github.com/2910Shubham?tab=repositories",
      label: "GitHub Profile",
    },
    {
      icon: Mail,
      href: "2910viwan@gmail.com",
      label: "Email Contact",
    },
  ];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Shubham Kumar Mishra
            </h3>
            <p className="text-muted">Full Stack Web & App Developer</p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="text-muted hover:text-background transition-colors duration-300"
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="border-t border-muted/20 mt-8 pt-8 text-center">
          <p className="text-muted">
            &copy; 2024 Shubham Kumar Mishra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
