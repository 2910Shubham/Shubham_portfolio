import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function AboutSection() {
  const achievements = [
    {
      title: "Software Engineer intern at Internnexus",
      description: "Working on Career Bridge platform, enhancing user experience and functionality",
    },
    {
      title: "Frontend Intern at Sikati.in",
      description: "Contributed to the development of a dynamic e-commerce platform and gained hands-on experience in frontend technologies",
    },
    // {
    //   title: "Techfilia Winner",
    //   description: "Winner of prestigious technology competition",
    // },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm{" "}
                <span className="font-semibold text-foreground">
                  Shubham Kumar Mishra
                </span>
                , a passionate developer with hands-on experience in{" "}
                <span className="font-semibold text-primary">MERN Stack</span>{" "}
                and{" "}
                <span className="font-semibold text-primary">
                  Flutter app development
                </span>
                . I've worked as a frontend intern at{" "}
                <span className="font-semibold text-foreground">Sikati.in</span>{" "}
                and built production-grade apps and platforms.
              </p>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {achievement.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <img
              src="images/me.png"
              alt="Shubham Kumar Mishra - Professional Developer Portrait"
              className="w-80 h-80 rounded-2xl shadow-2xl object-cover hover-lift"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
