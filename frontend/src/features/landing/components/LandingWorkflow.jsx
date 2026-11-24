import { ArrowRight } from "lucide-react";
import { workflow } from "../landingContent";
import { motion } from "motion/react";
import { fadeUp } from "../../../lib/motion";
export default function LandingWorkflow() {
  return (
    <section id="workflow" className="landing-workflow section-shell">
      <div className="container-app workflow-layout">
        <div>
          <span className="eyebrow">A calmer operating rhythm</span>
          <h2 className="section-heading">
            From incoming request to organized resolution.
          </h2>
          <p className="muted-text">
            Keep the important parts of support operations connected. Triage
            requests, coordinate shared resources, and track activity without
            jumping between disconnected workflows.
          </p>
        </div>

        <div className="workflow-list">
          {workflow.map((item, index) => (
            <motion.div key={item} className="workflow-step surface" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
              <div className="workflow-number">
                {index + 1}
              </div>
              <p>{item}</p>
              <ArrowRight className="workflow-arrow" size={18} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
