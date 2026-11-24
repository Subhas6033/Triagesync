import { ArrowDown, Check, CircleDot, ScrollText, UserRoundCheck } from "lucide-react";

export default function LandingDemo() {
  return (
    <section className="landing-demo section-shell" aria-labelledby="triage-demo-title">
      <div className="container-app demo-layout">
        <div>
          <p className="eyebrow">A human-readable history</p>
          <h2 id="triage-demo-title" className="section-heading">A decision is more useful when you can see how it changed.</h2>
          <p className="muted-text">Follow the ticket from its first category through an agent correction and into the audit trail.</p>
        </div>
        <div className="demo-card">
          <div className="demo-label"><span>Preview</span><span>Illustrative ticket activity</span></div>
          <article className="demo-ticket"><CircleDot size={17} /><div><b>Cannot sign in after password reset</b><small>Ticket · TS-1042</small></div></article>
          <div className="demo-event"><ArrowDown size={16} /><span>Automatic category</span><strong>Login</strong></div>
          <div className="demo-event demo-event-human"><UserRoundCheck size={16} /><span>Agent review</span><strong>Billing</strong><Check size={15} /></div>
          <div className="demo-audit"><ScrollText size={17} /><div><b>Change recorded</b><small>Category · Login → Billing · Agent review</small></div><span>Audit trail</span></div>
        </div>
      </div>
    </section>
  );
}
