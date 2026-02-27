import type { Metadata } from "next";
import ClientRoot from "./client-root";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Shubham Kr. Mishra - Full Stack Developer",
  description:
    "Full-Stack Engineer crafting scalable products. E-commerce platforms, mobile apps, AI-powered systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var savedTheme=localStorage.getItem("theme");var useDark=savedTheme?savedTheme==="dark":true;if(useDark)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(_){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
