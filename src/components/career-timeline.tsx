import { motion } from "framer-motion";
import { Code, Trophy, Briefcase, Award, Zap } from "lucide-react";

const careerMilestones = [
  {
    date: "Aug 2023",
    title: "The Beginning",
    story: "Started my college journey with a burning curiosity about how things work. Dived into the fundamentals—HTML, CSS, and the core building blocks of web development. It was humbling, challenging, but absolutely essential.",
    type: "learning",
  },
  {
    date: "May 2024",
    title: "Building My Foundation",
    story: "Mastered C programming and started seeing patterns in code. Built my first client website with JavaScript, turning static HTML into interactive experiences. The moment I saw a user interact with something I built—that changed everything.",
    type: "project",
  },
  {
    date: "Dec 2024",
    title: "Reaching National Stage",
    story: "Competed in Smart India Hackathon, pitching against 500+ teams from across India. Made it to the finals—a validation that my ideas could compete at a national level. This wasn't just about winning; it was about proving I could think differently.",
    type: "achievement",
  },
  {
    date: "Jan 2025",
    title: "Going Backend",
    story: "Mastered Node.js and discovered the power of backend architecture. Built systems that could handle real data, real users, and real complexity. Frontend is beautiful, but backend is where the real logic lives.",
    type: "learning",
  },
  {
    date: "Feb 2025",
    title: "Campus Kart: First Real Impact",
    story: "Built Campus Kart, a peer-to-peer marketplace. For the first time, I wasn't just building features—I was designing systems: real-time chat with Socket.io, payment flows, seller verification, fraud detection. It taught me what production-grade really means.",
    type: "project",
  },
  {
    date: "Mar 2025",
    title: "Wins and Losses",
    story: "Won LogoVation hackathon, then lost at Hackit. The loss was harsh but crucial. It taught me that not every idea works, and that's okay. What matters is learning, iterating, and coming back stronger.",
    type: "achievement",
  },
  {
    date: "Apr 2025",
    title: "Professional Milestone",
    story: "Joined Sikati.in as a Frontend Engineer Intern. Shifted from side projects to working within a real product team. Learned how enterprise apps are built, scaled, and maintained. Built PuffNMore, an e-commerce platform handling thousands of transactions.",
    type: "career",
  },
  {
    date: "June 2025",
    title: "Internnexus: Career Bridge",
    story: "Started my professional journey at Internnexus as a Software Engineer Intern. Engineered Career Bridge, a real-time job-matching platform that intelligently connected job seekers with perfect-fit positions. Learned the importance of scalable architecture, algorithmic thinking, and how technology bridges human connections.",
    type: "career",
  },
  {
    date: "May 2025",
    title: "Mobile Frontier",
    story: "Learned Flutter and discovered mobile development's unique challenges. Building apps for constrained devices, offline-first architecture, and native performance became my new obsession. Started Tuku Go—a ride-sharing app exploring real-time location and payments.",
    type: "learning",
  },
  {
    date: "Jan 2026",
    title: "Fullstack Freelancer & Continuous Learner",
    story: "Today, I'm working as a fullstack freelancer, building end-to-end solutions for diverse clients. Constantly learning new technologies, architectural patterns, and business domains. Specialized in mobile + data engineering, I take ownership of projects from ideation to deployment. From learning HTML to architecting systems at scale—every day is a lesson in becoming a better engineer.",
    type: "career",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "learning":
      return <Code className="w-5 h-5" />;
    case "achievement":
      return <Trophy className="w-5 h-5" />;
    case "career":
      return <Briefcase className="w-5 h-5" />;
    case "project":
      return <Award className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case "learning":
      return "from-primary to-primary";
    case "achievement":
      return "from-primary to-primary";
    case "career":
      return "from-primary to-primary";
    case "project":
      return "from-primary to-primary";
    default:
      return "from-primary to-primary";
  }
};

export default function CareerTimeline() {
  return (
    <section id="career" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            My Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From curious student to production-grade engineer. Every milestone shaped who I am today.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-transparent transform md:-translate-x-1/2"></div>

          {/* Timeline items */}
          <div className="space-y-8 md:space-y-12">
            {careerMilestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`relative flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-1 h-1 transform -translate-x-1/3 md:-translate-x-1/2 bg-background">
                  <div className={`w-5 h-5 rounded-full border-4 border-background bg-gradient-to-br ${getColor(milestone.type)} flex items-center justify-center text-white transform -translate-x-1 md:translate-x-0`}>
                    {getIcon(milestone.type)}
                  </div>
                </div>

                {/* Content */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-primary mb-1">
                          {milestone.date}
                        </p>
                        <h3 className="text-lg font-bold text-foreground">
                          {milestone.title}
                        </h3>
                      </div>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${getColor(milestone.type)} flex items-center justify-center text-white`}>
                        {getIcon(milestone.type)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {milestone.story}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
