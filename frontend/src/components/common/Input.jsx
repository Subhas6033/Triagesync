import { useId } from "react";
import FormField from "./FormField";
export default function Input({
  id,
  label,
  error,
  hint,
  multiline = false,
  className = "",
  fieldClassName,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const Control = multiline ? "textarea" : "input";
  const description = [
    hint && `${inputId}-hint`,
    error && `${inputId}-error`,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <FormField
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      className={fieldClassName}
    >
      <Control
        {...props}
        id={inputId}
        className={`input-field ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={description || undefined}
      />
    </FormField>
  );
}
