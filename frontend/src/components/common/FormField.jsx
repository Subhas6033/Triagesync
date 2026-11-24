export default function FormField({
  id,
  label,
  error,
  hint,
  children,
  className = "",
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
