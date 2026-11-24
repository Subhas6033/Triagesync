import { getErrorMessage } from "../../utils/formatters";
import Button from "./Button";
export default function ErrorState({
  error,
  title = "Unable to complete this request",
  onRetry,
  onDismiss,
}) {
  return (
    <div className="inline-alert" role="alert">
      <strong>{title}</strong>
      {error && <p>{getErrorMessage(error)}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
      {onDismiss && <Button variant="ghost" size="sm" onClick={onDismiss} aria-label="Dismiss error">Dismiss</Button>}
    </div>
  );
}
