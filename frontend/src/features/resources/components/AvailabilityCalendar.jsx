import Skeleton from "../../../components/common/Skeleton";
import ErrorState from "../../../components/common/ErrorState";
import { availabilityWindow, formatDate, formatDateRange } from "../../../utils/date";

const timeLabel = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AvailabilityCalendar({ query }) {
  const days = [];
  const start = new Date(availabilityWindow().from);
  start.setHours(0, 0, 0, 0);
  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const dayStart = new Date(start);
    dayStart.setDate(start.getDate() + dayIndex);
    const cells = [];
    for (let slot = 0; slot < 48; slot += 1) {
      const slotStart = new Date(dayStart.getTime() + slot * 30 * 60000);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
      const booking = (query.data || []).find((item) =>
        new Date(item.startTime) < slotEnd && new Date(item.endTime) > slotStart,
      );
      const label = `${slotStart.toLocaleDateString()} ${timeLabel(slotStart)}–${timeLabel(slotEnd)} · ${booking ? `Booked (${booking.status.toLowerCase()})` : "Available"}`;
      cells.push(
        <span
          key={slot}
          className={`availability-slot ${booking ? "is-booked" : "is-open"}`}
          title={label}
          aria-label={label}
        >
          {slot % 2 === 0 && <small aria-hidden="true">{timeLabel(slotStart)}</small>}
          <span className="sr-only">{booking ? "Booked" : "Available"}</span>
        </span>,
      );
    }
    days.push(
      <div className="availability-day" role="group" aria-label={formatDate(dayStart, { weekday: "long", month: "short", day: "numeric" })} key={dayStart.toISOString()}>
        <h3>{formatDate(dayStart, { weekday: "short", month: "numeric", day: "numeric" })}</h3>
        <div className="availability-day-slots">{cells}</div>
      </div>,
    );
  }

  return (
    <section className="availability-section" aria-label="Resource availability">
      <div className="panel-heading">
        <div><h2>Availability</h2><p>30-minute slots · times shown in your local timezone</p></div>
        <div className="availability-key"><span className="open-key" /> Available <span className="booked-key" /> Booked</div>
      </div>
      {query.isPending ? <Skeleton className="availability-skeleton" /> : query.isError ? (
        <ErrorState title="Availability is currently unavailable" error={query.error} onRetry={query.refetch} />
      ) : query.data?.length ? (
        <div className="availability-grid" role="group" aria-label="Seven-day availability grid">{days}</div>
      ) : (
        <div className="availability-grid" role="group" aria-label="Seven-day availability grid">{days}</div>
      )}
      {query.data?.length > 0 && <p className="availability-note">Reservations shown: {query.data.length} · {formatDateRange(query.data[0].startTime, query.data[query.data.length - 1].endTime)}</p>}
    </section>
  );
}
