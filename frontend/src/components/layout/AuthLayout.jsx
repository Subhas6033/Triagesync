import { Link, Outlet } from "react-router-dom";
import { Layers3 } from "lucide-react";
export default function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="auth-container">
        <Link to="/" className="auth-brand">
          <Layers3 />
          Triage<span>Sync</span>
        </Link>
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
