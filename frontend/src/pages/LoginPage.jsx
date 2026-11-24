import LoginForm from "../features/auth/components/LoginForm";
export default function LoginPage() {
  return (
    <>
      <h1>Welcome back</h1>
      <p className="page-subtitle">Sign in to access your workspace.</p>
      <LoginForm />
    </>
  );
}
