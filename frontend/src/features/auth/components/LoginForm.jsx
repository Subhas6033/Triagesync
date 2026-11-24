import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import PasswordInput from "./PasswordInput";
import { authErrorField, validateEmail, validatePassword } from "../../../utils/validation";
import { getErrorMessage } from "../../../utils/formatters";
export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(event.currentTarget));
    const errors = {
      email: validateEmail(credentials.email),
      password: validatePassword(credentials.password),
    };
    setFieldErrors(Object.fromEntries(Object.entries(errors).filter(([, message]) => message)));
    if (Object.values(errors).some(Boolean)) return;
    setFormError(null);
    setLoading(true);
    try {
      await login(credentials);
      navigate(state?.from || "/dashboard", { replace: true });
    } catch (error) {
      const field = authErrorField(error);
      if (field === "form") setFormError(error);
      else setFieldErrors({ [field]: getErrorMessage(error) });
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
      {formError && <ErrorState title="Unable to sign in" error={formError} />}
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        error={fieldErrors.email}
        onChange={() => setFieldErrors((current) => ({ ...current, email: undefined }))}
        placeholder="you@example.com"
      />
      <PasswordInput
        name="password"
        autoComplete="current-password"
        required
        error={fieldErrors.password}
        onChange={() => setFieldErrors((current) => ({ ...current, password: undefined }))}
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
