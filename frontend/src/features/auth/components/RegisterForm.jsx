import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import PasswordInput from "./PasswordInput";
export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError(null);
    setLoading(true);
    try {
      await register(data);
      navigate("/login", {
        state: { message: "Account created. Please sign in." },
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="auth-form">
      {error && <ErrorState title="Registration failed" error={error} />}
      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        minLength={2}
        maxLength={50}
        required
        placeholder="Your name"
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        required
        placeholder="you@example.com"
      />
      <PasswordInput
        name="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={64}
        pattern="(?=.*[A-Za-z])(?=.*[0-9]).*"
        required
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
