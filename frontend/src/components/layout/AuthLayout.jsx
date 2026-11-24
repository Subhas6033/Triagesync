import { Link, Outlet } from "react-router-dom";
import { Layers3, TicketCheck, CalendarClock, ShieldCheck } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
export default function AuthLayout() {
  return (
    <main className="auth-layout">
      <ThemeToggle />
      <div className="auth-container">
        <aside className="auth-story">
          <Link to="/" className="auth-brand"><Layers3 />Triage<span>Sync</span></Link>
          <div><p className="eyebrow">Support operations, in sync</p><h2>Bring every next step into view.</h2><p>Keep ticket decisions, team resources, and booking activity connected in one workspace.</p></div>
          <div className="auth-story-items"><span><TicketCheck size={17} /> Human-guided triage</span><span><CalendarClock size={17} /> Shared-resource scheduling</span><span><ShieldCheck size={17} /> Role-aware workspace</span></div>
        </aside>
        <section className="surface auth-panel">
          <Outlet />
        </section>
        <Link to="/" className="auth-home">
          Back to home
        </Link>
      </div>
    </main>
  );
}
