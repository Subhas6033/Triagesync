import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import PasswordInput from "./PasswordInput";
import { authErrorField, validateEmail, validateName, validatePassword } from "../../../utils/validation";
import { getErrorMessage } from "../../../utils/formatters";
export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const errors = {
      name: validateName(data.name),
      email: validateEmail(data.email),
      password: validatePassword(data.password),
    };
    setFieldErrors(Object.fromEntries(Object.entries(errors).filter(([, message]) => message)));
    if (Object.values(errors).some(Boolean)) return;
    setFormError(null);
    setLoading(true);
    try {
      await register(data);
      navigate("/login", {
        state: { message: "Account created. Please sign in." },
      });
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
      {formError && <ErrorState title="Registration failed" error={formError} />}
      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        minLength={2}
        maxLength={50}
        required
        error={fieldErrors.name}
        onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))}
        placeholder="Your name"
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        required
        error={fieldErrors.email}
        onChange={() => setFieldErrors((current) => ({ ...current, email: undefined }))}
        placeholder="you@example.com"
      />
      <PasswordInput
        name="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={64}
        pattern="(?=.*[A-Za-z])(?=.*[0-9]).*"
        required
        error={fieldErrors.password}
        onChange={() => setFieldErrors((current) => ({ ...current, password: undefined }))}
        placeholder="At least 8 characters"
        hint="Use at least 8 characters, including a letter and a number."
      />
      <Button type="submit" loading={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
