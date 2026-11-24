import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import EmptyState from "../components/common/EmptyState";
export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="error-page">
      <section className="error-panel">
        <span className="error-code">404</span>
        <p className="eyebrow">Wrong turn</p>
        <h1>Page not found</h1>
        <p className="muted-text">This address doesn’t match a page in TriageSync.</p>
        <EmptyState title="Your workspace is still here" description="Return to a familiar starting point.">
          <Link
            className="btn-primary"
            to={isAuthenticated ? "/dashboard" : "/"}
          >
            {isAuthenticated ? "Go to overview" : "Back to home"}
          </Link>
        </EmptyState>
      </section>
    </main>
  );
}
