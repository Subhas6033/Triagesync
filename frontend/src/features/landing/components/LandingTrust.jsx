import { landingStats } from "../landingContent";

export default function LandingTrust() {
  return (
    <section className="landing-trust" aria-label="TriageSync workflow details">
      <div className="container-app trust-grid">
        {landingStats.map((stat) => (
          <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
        ))}
      </div>
    </section>
  );
}
