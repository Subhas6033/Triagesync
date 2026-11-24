import RegisterForm from "../features/auth/components/RegisterForm";
export default function RegisterPage() {
  return (
    <>
      <h1>Create your account</h1>
      <p className="page-subtitle">
        Get started with your TriageSync workspace.
      </p>
      <RegisterForm />
    </>
  );
}
