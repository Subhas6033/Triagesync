import { useId } from "react";
import FormField from "./FormField";
export default function Select({
  id,
  label,
  error,
  children,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <FormField id={selectId} label={label} error={error}>
      <select
        {...props}
        id={selectId}
        className={`input-field ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${selectId}-error` : props["aria-describedby"]
        }
      >
        {children}
      </select>
    </FormField>
  );
}
