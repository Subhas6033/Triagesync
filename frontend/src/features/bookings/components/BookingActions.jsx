import { useState } from "react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Input from "../../../components/common/Input";
import ErrorState from "../../../components/common/ErrorState";
import { useBookingMutations } from "../hooks/useBookings";
export default function BookingActions({ booking, admin = false }) {
  const [dialog, setDialog] = useState(null);
  const [note, setNote] = useState("");
  const { approve, reject, cancel } = useBookingMutations();
  const future = new Date(booking.startTime) > new Date();
  const busy = approve.isPending || reject.isPending || cancel.isPending;
  async function confirmCancel() {
    try {
      await cancel.mutateAsync(booking.id);
      setDialog(null);
    } catch {
      /* Keep dialog open to show error. */
    }
  }
  async function confirmReject(event) {
    event.preventDefault();
    if (note.trim().length < 5) return;
    try {
      await reject.mutateAsync({ id: booking.id, note: note.trim() });
      setDialog(null);
    } catch {
      /* Keep dialog open to show error. */
    }
  }
  return (
    <div className="booking-action-group">
      {admin && future && booking.status === "PENDING" && (
        <div className="booking-admin-actions">
          <Button
            variant="secondary"
            size="sm"
            loading={approve.isPending}
            disabled={busy}
            onClick={() => approve.mutate(booking.id)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={busy}
            onClick={() => {
              reject.reset();
              setNote("");
              setDialog("reject");
            }}
          >
            Reject
          </Button>
        </div>
      )}
      {!admin && future && ["PENDING", "APPROVED"].includes(booking.status) && (
        <Button
          variant="danger"
          size="sm"
          disabled={busy}
          onClick={() => {
            cancel.reset();
            setDialog("cancel");
          }}
        >
          Cancel booking
        </Button>
      )}
      {approve.isError && (
        <ErrorState title="Approval failed" error={approve.error} />
      )}
      <ConfirmDialog
        open={dialog === "cancel"}
        onClose={() => setDialog(null)}
        title="Cancel this booking?"
        description={`Your reservation for ${booking.resource?.name || "this resource"} will be cancelled.`}
        confirmLabel="Cancel booking"
        loading={cancel.isPending}
        error={cancel.error}
        onConfirm={confirmCancel}
      />
      <Modal
        open={dialog === "reject"}
        onClose={() => setDialog(null)}
        title="Reject booking request"
        description="Give the requester a reason for the decision."
        busy={reject.isPending}
      >
        <form className="detail-form" onSubmit={confirmReject}>
          <Input
            multiline
            label="Reason"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            required
            minLength={5}
            maxLength={200}
          />
          {reject.isError && (
            <ErrorState title="Rejection failed" error={reject.error} />
          )}
          <div className="dialog-actions">
            <Button
              variant="secondary"
              disabled={reject.isPending}
              onClick={() => setDialog(null)}
            >
              Keep request
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={reject.isPending}
              disabled={note.trim().length < 5}
            >
              Reject request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
