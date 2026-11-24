import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import EmptyState from "../components/common/EmptyState";
export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="auth-layout">
      <section className="surface auth-panel">
        <h1>Page not found</h1>
        <EmptyState
          title="This address does not exist"
          description="Check the URL or return to your workspace."
        >
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
