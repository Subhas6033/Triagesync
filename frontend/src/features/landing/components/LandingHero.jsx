import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Check, Clock3, Layers3, Ticket } from "lucide-react";
import Badge from "../../../components/common/Badge";
import { hero } from "../landingContent";
import { fadeUp, scaleIn, stagger } from "../../../lib/motion";

const previewTickets = [
  { subject: "Unable to access account", category: "LOGIN", priority: "HIGH" },
  { subject: "Invoice total looks incorrect", category: "BILLING", priority: "MEDIUM" },
  { subject: "Shipment tracking is out of date", category: "DELIVERY", priority: "LOW" },
];
const slots = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30"];

export default function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container-app hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={stagger}>
          <motion.p className="eyebrow" variants={fadeUp}>{hero.eyebrow}</motion.p>
          <motion.h1 variants={fadeUp}>{hero.title}</motion.h1>
          <motion.p className="hero-description" variants={fadeUp}>{hero.description}</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <Link to="/register" className="btn-primary">Get started <ArrowRight size={16} /></Link>
            <a href="#features" className="btn-secondary">Explore the workflow</a>
          </motion.div>
          <motion.p className="hero-footnote" variants={fadeUp}><Check size={16} /> Human decisions stay visible and in control</motion.p>
        </motion.div>
        <motion.div className="product-preview" aria-label="Illustrative TriageSync workspace preview" initial="hidden" animate="visible" variants={scaleIn}>
          <div className="preview-topline">
            <span className="preview-mark"><Layers3 size={16} /></span>
            <span>Workspace preview</span>
            <span className="preview-live"><i /> Illustrative</span>
          </div>
          <div className="preview-columns">
            <section className="preview-queue" aria-label="Illustrative ticket queue">
              <div className="preview-section-head"><span><Ticket size={15} /> Ticket queue</span><span>03</span></div>
              {previewTickets.map((ticket) => (
                <article className="preview-ticket" key={ticket.subject}>
                  <b>{ticket.subject}</b>
                  <div><Badge value={ticket.category} icon /><Badge value={ticket.priority} /></div>
                </article>
              ))}
            </section>
            <section className="preview-calendar" aria-label="Illustrative thirty minute availability grid">
              <div className="preview-section-head"><span><Clock3 size={15} /> Resource slots</span><span>Today</span></div>
              <div className="slot-grid">
                {slots.map((slot, index) => <div key={slot} className={index === 2 ? "slot-taken" : index === 4 ? "slot-selected" : ""}><small>{slot}</small><span>{index === 2 ? "Booked" : index === 4 ? "Selected" : "Available"}</span></div>)}
              </div>
              <div className="preview-caption">30-minute increments · local time</div>
            </section>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
