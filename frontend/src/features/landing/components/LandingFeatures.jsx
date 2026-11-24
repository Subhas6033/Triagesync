import { features } from "../landingContent";
import { motion } from "motion/react";
import { fadeUp } from "../../../lib/motion";
export default function LandingFeatures() {
  return (
    <section id="features" className="landing-features section-shell">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">One connected workflow</span>
          <h2 className="section-heading">
            Tools that work better together.
          </h2>
          <p className="muted-text">
            Bring ticket management, resource scheduling, and operational
            insights into one connected platform.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article key={feature.title} className="feature-card surface card-hover" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
                <div className={`feature-icon ${feature.color}`}>
                  <Icon size={23} />
                </div>
                <h3>
                  {feature.title}
                </h3>
                <p>
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
