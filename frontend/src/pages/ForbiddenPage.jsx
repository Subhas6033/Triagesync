import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function ForbiddenPage() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="error-page">
      <section className="error-panel">
        <span className="error-symbol"><ShieldX size={22} /></span>
        <p className="eyebrow">Access restricted</p>
        <h1>You don’t have access to this area.</h1>
        <p className="muted-text">This workspace section is available to administrators.</p>
        <Link className="btn-primary" to={isAuthenticated ? "/dashboard" : "/login"}>
          {isAuthenticated ? "Return to overview" : "Log in"}
        </Link>
      </section>
    </main>
  );
}
