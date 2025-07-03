const certificates = [
  { src: "cirtificates/Hackit.jpg", event: "Hackit" },
  { src: "cirtificates/logovatio0n.jpg", event: "LogoVation" },
  { src: "cirtificates/SIH2024.jpg", event: "SIH 2024" },
  { src: "cirtificates/Techphilia.jpg", event: "Techphilia" },
];

const photographs = [
  { src: "images/LogoVationPrizeREcieving.jpg", event: "Logovation" },
  { src: "images/Sih1.jpg", event: "Smart India Hackathon" },
  { src: "images/Sih2.jpg", event: "Smart India Hackathon" },
  { src: "images/Sih3.jpg", event: "Smart India Hackathon" },
  { src: "images/techphiliaPrizeReciving.jpg", event: "Techphilia" },
  { src: "images/TechphiliaSoloWithCheck.jpg", event: "Techphilia" },
];

export function GallerySection() {
  return (
    <div className="py-16 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Certificates Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {certificates.map((item) => (
          <div
            key={item.src}
            className="bg-background rounded-lg shadow-lg p-4 flex flex-col items-center border border-border hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.src}
              alt={item.event}
              className="w-full h-48 object-contain mb-2 rounded-md bg-white"
            />
            <span className="font-semibold text-lg text-center text-foreground mt-2">
              {item.event}
            </span>
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Hackathon Photographs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photographs.map((item) => (
          <div
            key={item.src}
            className="bg-background rounded-lg shadow-lg p-4 flex flex-col items-center border border-border hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.src}
              alt={item.event}
              className="w-full h-48 object-cover mb-2 rounded-md bg-white"
            />
            <span className="font-semibold text-lg text-center text-foreground mt-2">
              {item.event}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add a default export for compatibility with App.tsx route
const Gallery = GallerySection;
export default Gallery;
