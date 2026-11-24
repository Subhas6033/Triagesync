import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormField from "../../../components/common/FormField";
export default function PasswordInput({ hint, error, ...props }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <FormField id={id} label="Password" hint={hint} error={error}>
      <div className="password-control">
        <input
          {...props}
          id={id}
          className="input-field"
          type={visible ? "text" : "password"}
          aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FormField>
  );
}
