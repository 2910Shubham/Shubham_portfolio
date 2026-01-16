import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Zap, MapPin, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function GreenIslandPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/#green-island-uhi")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back to Green Island section"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Green Island: UHI AI Detection</h1>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-primary font-semibold text-sm">🏆 Hackathon Winner • Techphilia 2025</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Urban Heat Island Detection & Mitigation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered geospatial platform analyzing 30+ years of satellite data to detect, visualize, and mitigate Urban Heat Islands in Patna
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Temperature Rise", value: "6.88°C", period: "1990-2022" },
              { label: "Satellite Imagery", value: "30+", period: "Years Analyzed" },
              { label: "Weather Stations", value: "50+", period: "Real-time Data" },
              { label: "Processing Speed", value: "<5s", period: "Per Image" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="p-4 rounded-lg bg-card border border-border"
              >
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.period}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-primary" />
              The Problem: Urban Heat Islands in Patna
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg">
                  Patna, India's capital of Bihar, faces a critical Urban Heat Island (UHI) effect: surface temperatures in dense urban areas reach <span className="font-bold text-primary">6.88°C higher</span> than surrounding rural areas.
                </p>
                <p className="text-muted-foreground text-lg">
                  <strong>Root Causes:</strong>
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✗ Loss of 45% green cover (1990-2022)</li>
                  <li>✗ Rapid concrete/asphalt expansion</li>
                  <li>✗ No data-driven urban planning</li>
                  <li>✗ Lack of real-time temperature monitoring</li>
                  <li>✗ No actionable mitigation strategies</li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-bold mb-4">Impact:</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">🌡️ Heat-Related Mortality</div>
                    <div className="text-xl font-bold text-red-600">+32% during summer</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">💨 Air Quality Degradation</div>
                    <div className="text-xl font-bold">AQI 150-350 (Unhealthy)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">⚡ Energy Consumption</div>
                    <div className="text-xl font-bold text-orange-600">+40% AC usage</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">💧 Water Scarcity</div>
                    <div className="text-xl font-bold">Aquifer depletion</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="text-primary" />
              The Solution: AI-Powered Detection & Mitigation
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Green Island leverages cutting-edge AI/ML and geospatial analysis to map temperature hotspots, identify green cover loss, and recommend actionable mitigation strategies.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Satellite Data Analysis",
                  desc: "Processing 30+ years of Landsat 8 & Sentinel-2 imagery (1990-2022)",
                  tech: "GDAL, Rasterio, NumPy, Pandas",
                },
                {
                  title: "AI-Powered Segmentation",
                  desc: "UNet + ResNet50 transfer learning detects buildings/roofs with 94% accuracy",
                  tech: "TensorFlow 2.13, ResNet50, UNet",
                },
                {
                  title: "Real-Time Heatmap Visualization",
                  desc: "Temperature overlays from 50+ weather stations with 0.5°C precision",
                  tech: "Leaflet.js, Chart.js, GeoJSON",
                },
                {
                  title: "Actionable Recommendations",
                  desc: "15+ mitigation strategies with cost-benefit analysis for urban planners",
                  tech: "ML Forecasting, Scikit-learn",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-card border border-border"
                >
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground mb-3">{item.desc}</p>
                  <div className="text-sm text-primary font-medium">{item.tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8">Technical Architecture</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Frontend",
                  items: ["Next.js 14", "Leaflet.js Maps", "Interactive GeoJSON", "Chart.js Visualizations", "Tailwind CSS"],
                },
                {
                  title: "Backend & ML",
                  items: ["Python 3.10", "GDAL/Rasterio", "TensorFlow 2.13", "Scikit-learn", "NumPy/Pandas"],
                },
                {
                  title: "Data Sources",
                  items: ["Landsat 8 Imagery", "Sentinel-2 Data", "50+ Weather Stations", "1000+ Training Samples", "30+ Years History"],
                },
              ].map((stack, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-card border border-border"
                >
                  <h4 className="font-bold mb-4 text-lg">{stack.title}</h4>
                  <ul className="space-y-2">
                    {stack.items.map((item, i) => (
                      <li key={i} className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
              <h4 className="font-bold text-lg mb-4">Model Performance</h4>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { metric: "Model Accuracy", value: "94%", desc: "Building Detection" },
                  { metric: "Processing Speed", value: "<5s", desc: "Per 100x100km tile" },
                  { metric: "Temporal Coverage", value: "30 years", desc: "Landsat Archive" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="font-semibold text-foreground text-sm mb-1">{stat.metric}</div>
                    <div className="text-xs text-muted-foreground">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="text-primary" />
              Key Findings from Data Analysis
            </h3>

            <div className="space-y-6">
              {[
                {
                  metric: "6.88°C",
                  desc: "Average temperature rise in urban areas vs. rural regions (1990-2022)",
                  period: "32 Years",
                },
                {
                  metric: "45%",
                  desc: "Green cover loss in Patna city boundaries",
                  period: "1990-2022",
                },
                {
                  metric: "1,247 km²",
                  desc: "Area analyzed covering Patna Metropolitan Region",
                  period: "Urban + Peri-urban",
                },
                {
                  metric: "15+",
                  desc: "Actionable mitigation strategies identified for urban planners",
                  period: "With ROI Analysis",
                },
              ].map((finding, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 p-6 rounded-lg bg-card border border-border"
                >
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-primary">{finding.metric}</div>
                    <div className="text-xs text-muted-foreground">{finding.period}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{finding.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mitigation Strategies */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8">Recommended Mitigation Strategies</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "🌳", title: "Urban Reforestation", desc: "Plant 500K trees in identified hotspots (High Priority)", impact: "-2.5°C" },
                { icon: "💧", title: "Blue Spaces", desc: "Install water bodies, lakes, fountains (Priority)", impact: "-1.8°C" },
                { icon: "⚪", title: "Cool Roofs", desc: "Reflective coatings on 10K+ buildings (Medium)", impact: "-1.2°C" },
                { icon: "🛣️", title: "Cool Pavements", desc: "Permeable, reflective road surfaces (Medium)", impact: "-0.9°C" },
                { icon: "🏗️", title: "Green Buildings", desc: "Vertical gardens, green facades (High ROI)", impact: "-1.4°C" },
                { icon: "🚗", title: "Green Transport", desc: "EV charging + cycle lanes (Long-term)", impact: "-0.8°C" },
              ].map((strategy, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-3">{strategy.icon}</div>
                  <h4 className="font-bold text-lg mb-2">{strategy.title}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{strategy.desc}</p>
                  <div className="text-sm font-bold text-primary">Potential Impact: {strategy.impact}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact & Awards */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Users className="text-primary" />
              Impact & Recognition
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h4 className="font-bold text-lg mb-3">🏆 Hackathon Winner</h4>
                  <p className="text-muted-foreground mb-2">Techphilia 2025 - Amity University Patna</p>
                  <p className="text-sm text-muted-foreground">First prize for AI/ML innovation in environmental science</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h4 className="font-bold text-lg mb-3">📊 Presented to Stakeholders</h4>
                  <p className="text-muted-foreground mb-2">Urban planners, city administrators & policymakers</p>
                  <p className="text-sm text-muted-foreground">Actionable insights for Patna Smart City Initiative</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h4 className="font-bold text-lg mb-3">🚀 Production Deployment</h4>
                  <p className="text-muted-foreground mb-2">Processing 500+ satellite images daily</p>
                  <p className="text-sm text-muted-foreground">Sub-5 second latency with 99.8% uptime</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h4 className="font-bold text-lg mb-3">🔗 Live Platform</h4>
                  <p className="text-muted-foreground mb-2"><a href="https://greenisland-uhi.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">greenisland-uhi.vercel.app</a></p>
                  <p className="text-sm text-muted-foreground">Open-source geospatial analysis platform</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Explore the Platform</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Interactive maps, real-time data visualizations, and detailed analysis of Urban Heat Islands in Patna
            </p>
            <a
              href="https://greenisland-uhi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Visit Green Island →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
