import Loader from "./Loader";
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={`btn-${variant} button button-${size} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <Loader inline label="Working" />}
      {children}
    </button>
  );
}
