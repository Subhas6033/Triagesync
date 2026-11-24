import { useState } from "react";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import { useBookingMutations } from "../hooks/useBookings";
import { toLocalDateTime } from "../../../utils/date";
import { validateBooking } from "../../../utils/validation";
export default function BookingForm({ resource, slots }) {
  const { create } = useBookingMutations();
  const [error, setError] = useState("");
  const [openedAt] = useState(() => new Date());
  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const validationError = validateBooking(data, slots);
    setError(validationError);
    if (validationError) return;
    create.mutate({
      resourceId: String(resource.id),
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      purpose: data.purpose,
      ticketId: data.ticketId || undefined,
    });
  }
  return (
    <Card
      title="Request a booking"
      description="Submit a reservation for administrator review."
      className="booking-form-panel"
    >
      <form className="detail-form" onSubmit={submit}>
        <Input
          label="Start date and time"
          name="startTime"
          type="datetime-local"
          min={toLocalDateTime(openedAt)}
          max={toLocalDateTime(new Date(openedAt.getTime() + 30 * 86400000))}
          required
          hint="Start within 30 days, on a 30-minute boundary."
        />
        <Input
          label="End date and time"
          name="endTime"
          type="datetime-local"
          required
          hint="Reserve 30 minutes to 4 hours, on a 30-minute boundary."
        />
        <Input
          multiline
          label="Purpose"
          name="purpose"
          rows={4}
          minLength={5}
          maxLength={200}
          required
          placeholder="What will this resource be used for?"
        />
        <Input
          label="Related ticket ID (optional)"
          name="ticketId"
          placeholder="Enter a ticket ID"
        />
        {error && <ErrorState title={error} />}
        {create.isError && (
          <ErrorState title="Could not submit booking" error={create.error} />
        )}
        {create.isSuccess && !error && (
          <p className="success-message" role="status">
            Booking request sent. Track its status in My bookings.
          </p>
        )}
        {resource.isActive === false && (
          <p className="availability-note">
            This resource is inactive and cannot be booked.
          </p>
        )}
        <Button
          type="submit"
          loading={create.isPending}
          disabled={resource.isActive === false}
        >
          {create.isPending ? "Submitting…" : "Request booking"}
        </Button>
      </form>
    </Card>
  );
}
