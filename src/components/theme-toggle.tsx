import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isCyber, setIsCyber] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedCyber = localStorage.getItem("cyber") === "true";
    setIsDark(savedTheme === "dark");
    setIsCyber(savedCyber);
    applyTheme(savedTheme === "dark", savedCyber);
  }, []);

  const applyTheme = (dark: boolean, cyber: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      if (cyber) {
        html.classList.add("cyber");
      } else {
        html.classList.remove("cyber");
      }
    } else {
      html.classList.remove("dark");
      html.classList.remove("cyber");
    }
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    applyTheme(newDark, isCyber);
  };

  const toggleCyberMode = () => {
    if (!isDark) {
      // Require dark mode for cyber theme
      setIsDark(true);
      localStorage.setItem("theme", "dark");
      applyTheme(true, true);
      setIsCyber(true);
    } else {
      const newCyber = !isCyber;
      setIsCyber(newCyber);
      localStorage.setItem("cyber", newCyber ? "true" : "false");
      applyTheme(true, newCyber);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        title="Toggle Dark Mode"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      {isDark && (
        <button
          onClick={toggleCyberMode}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            isCyber
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          title="Toggle Cyber Theme"
        >
          CYBER
        </button>
      )}
    </div>
  );
}
