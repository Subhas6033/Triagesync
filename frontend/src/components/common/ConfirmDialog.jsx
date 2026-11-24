import Modal from "./Modal";
import Button from "./Button";
import ErrorState from "./ErrorState";
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  loading,
  error,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      busy={loading}
    >
      {error && <ErrorState error={error} />}
      <div className="dialog-actions">
        <Button variant="secondary" disabled={loading} onClick={onClose}>
          Keep unchanged
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
