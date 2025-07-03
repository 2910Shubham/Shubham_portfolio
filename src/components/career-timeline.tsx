import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Code,
  Trophy,
  Briefcase,
  Award,
  X,
} from "lucide-react";

const timeline = [
  {
    date: "Aug 2023",
    label: "Started college",
    value: 100,
    type: "learning",
    trend: "up",
  },
  {
    date: "Dec 2023",
    label: "Learned HTML & CSS",
    value: 150,
    type: "learning",
    trend: "up",
  },
  {
    date: "May 2024",
    label: "Completed C programming",
    value: 200,
    type: "learning",
    trend: "up",
  },
  {
    date: "Aug 2024",
    label: "JavaScript + Client Website",
    value: 300,
    type: "project",
    trend: "up",
  },
  {
    date: "Dec 2024",
    label: "Smart India Hackathon Finalist",
    value: 450,
    type: "achievement",
    trend: "up",
  },
  {
    date: "Jan 2025",
    label: "Backend Stack Mastery",
    value: 500,
    type: "learning",
    trend: "up",
  },
  {
    date: "Feb 2025",
    label: "Built CampusKart",
    value: 600,
    type: "project",
    trend: "up",
  },
  {
    date: "Mar 2025",
    label: "Won LogoVation",
    value: 700,
    type: "achievement",
    trend: "up",
  },
  {
    date: "Mar 2025",
    label: "Lost Hackit Hackathon",
    value: 650,
    type: "setback",
    trend: "down",
  },
  {
    date: "Apr 2025",
    label: "Techphilia Runner-up",
    value: 750,
    type: "achievement",
    trend: "up",
  },
  {
    date: "Apr 2025",
    label: "Joined Sikati.in",
    value: 850,
    type: "career",
    trend: "up",
  },
  {
    date: "Apr 2025",
    label: "PuffsNMore E-commerce",
    value: 900,
    type: "project",
    trend: "up",
  },
  {
    date: "May 2025",
    label: "Learned Flutter",
    value: 950,
    type: "learning",
    trend: "up",
  },
  {
    date: "June 2025",
    label: "Building Tuku Go",
    value: 1000,
    type: "project",
    trend: "up",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "learning":
      return <Code className="w-4 h-4" />;
    case "achievement":
      return <Trophy className="w-4 h-4" />;
    case "career":
      return <Briefcase className="w-4 h-4" />;
    case "project":
      return <Award className="w-4 h-4" />;
    case "setback":
      return <X className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case "learning":
      return "text-blue-600 border-blue-600";
    case "achievement":
      return "text-blue-800 border-blue-800";
    case "career":
      return "text-blue-700 border-blue-700";
    case "project":
      return "text-blue-500 border-blue-500";
    case "setback":
      return "text-red-600 border-red-600";
    default:
      return "text-blue-600 border-blue-600";
  }
};

export default function StockMarketTimeline() {
  const [animatedValues, setAnimatedValues] = useState(timeline.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(timeline.map((item) => item.value));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...timeline.map((item) => item.value));
  const minValue = Math.min(...timeline.map((item) => item.value));

  const currentValue = timeline[timeline.length - 1].value;

  const overallGrowth = (
    ((currentValue - timeline[0].value) / timeline[0].value) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-2xl max-w-6xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Career Portfolio</h1>
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="w-6 h-6" />
            <span className="text-2xl font-bold">+{overallGrowth}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-600 text-sm">Current Level</p>
            <p className="text-2xl font-bold text-blue-600">{currentValue}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-600 text-sm">Starting Point</p>
            <p className="text-2xl font-bold text-gray-800">
              {timeline[0].value}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-600 text-sm">Peak Value</p>
            <p className="text-2xl font-bold text-blue-800">{maxValue}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-600 text-sm">Total Milestones</p>
            <p className="text-2xl font-bold text-blue-700">
              {timeline.length}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-96 mb-8">
        <svg className="w-full h-full" viewBox="0 0 1200 400">
          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="50"
              y1={50 + i * 75}
              x2="1150"
              y2={50 + i * 75}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="30"
              y={60 + i * 75}
              fill="#6B7280"
              fontSize="12"
              textAnchor="end"
            >
              {Math.round(maxValue - (i * (maxValue - minValue)) / 4)}
            </text>
          ))}

          {/* Chart Line */}
          <path
            d={`M ${timeline
              .map(
                (_, index) =>
                  `${70 + index * (1080 / (timeline.length - 1))},${
                    350 -
                    ((animatedValues[index] - minValue) /
                      (maxValue - minValue)) *
                      280
                  }`
              )
              .join(" L ")}`}
            stroke="#1D4ED8"
            strokeWidth="3"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />

          {/* Gradient Fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`M ${timeline
              .map(
                (_, index) =>
                  `${70 + index * (1080 / (timeline.length - 1))},${
                    350 -
                    ((animatedValues[index] - minValue) /
                      (maxValue - minValue)) *
                      280
                  }`
              )
              .join(" L ")} L ${
              70 + (timeline.length - 1) * (1080 / (timeline.length - 1))
            },350 L 70,350 Z`}
            fill="url(#areaGradient)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Data Points */}
          {timeline.map((item, index) => {
            const x = 70 + index * (1080 / (timeline.length - 1));
            const y =
              350 -
              ((animatedValues[index] - minValue) / (maxValue - minValue)) *
                280;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredIndex === index ? "8" : "6"}
                  fill={item.trend === "down" ? "#DC2626" : "#1D4ED8"}
                  stroke="#F9FAFB"
                  strokeWidth="2"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Trend Arrow */}
                {item.trend === "up" ? (
                  <polygon
                    points={`${x - 3},${y - 12} ${x + 3},${y - 12} ${x},${
                      y - 18
                    }`}
                    fill="#1D4ED8"
                    className="transition-all duration-200"
                  />
                ) : (
                  <polygon
                    points={`${x - 3},${y + 12} ${x + 3},${y + 12} ${x},${
                      y + 18
                    }`}
                    fill="#DC2626"
                    className="transition-all duration-200"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-300 pointer-events-none z-10"
            style={{
              left: `${70 + hoveredIndex * (1080 / (timeline.length - 1))}px`,
              top: `${
                350 -
                ((animatedValues[hoveredIndex] - minValue) /
                  (maxValue - minValue)) *
                  280 -
                80
              }px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-sm font-semibold text-gray-800">
              {timeline[hoveredIndex].date}
            </div>
            <div className="text-xs text-gray-600 mb-1">
              {timeline[hoveredIndex].label}
            </div>
            <div className="text-lg font-bold text-blue-600">
              Level: {timeline[hoveredIndex].value}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Events */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-4">Career Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`bg-gray-50 p-4 rounded-lg border-l-4 hover:bg-blue-50 transition-colors cursor-pointer ${getColor(
                item.type
              )}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full bg-white border-2 ${getColor(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">
                      {item.date}
                    </span>
                    <div className="flex items-center space-x-1">
                      {item.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          item.trend === "up" ? "text-blue-600" : "text-red-600"
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">Learning</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-blue-800" />
            <span className="text-sm text-gray-700">Achievement</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-700" />
            <span className="text-sm text-gray-700">Career</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Project</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-700">Setback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
