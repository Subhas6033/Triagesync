import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import PasswordInput from "./PasswordInput";
export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(event.currentTarget));
    setError(null);
    setLoading(true);
    try {
      await login(credentials);
      navigate(state?.from || "/dashboard", { replace: true });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="auth-form">
      {state?.message && (
        <p className="success-banner" role="status">
          {state.message}
        </p>
      )}
      {error && <ErrorState title="Unable to sign in" error={error} />}
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <PasswordInput
        name="password"
        autoComplete="current-password"
        required
        placeholder="Enter your password"
      />
      <Button type="submit" loading={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <p>
        Don’t have an account? <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}
