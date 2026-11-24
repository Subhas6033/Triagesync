import Badge from "../../../components/common/Badge";
import Skeleton from "../../../components/common/Skeleton";
import ErrorState from "../../../components/common/ErrorState";
import { formatDateRange } from "../../../utils/date";
export default function AvailabilityCalendar({ query }) {
  return (
    <section
      className="availability-section"
      aria-label="Resource availability"
    >
      <div className="panel-heading">
        <div>
          <h2>Availability</h2>
          <p>Existing reservations in the next 7 days</p>
        </div>
      </div>
      {query.isPending ? (
        <Skeleton className="availability-skeleton" />
      ) : query.isError ? (
        <ErrorState
          title="Availability is currently unavailable"
          error={query.error}
          onRetry={query.refetch}
        />
      ) : query.data?.length ? (
        <ul className="availability-list">
          {query.data.map((slot, index) => (
            <li key={slot.id || index}>
              <span>
                {formatDateRange(
                  slot.startTime || slot.start,
                  slot.endTime || slot.end,
                )}
              </span>
              <Badge
                value={
                  slot.status || (slot.isAvailable ? "Available" : "Reserved")
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="availability-note">
          No existing reservations were returned for this period.
        </p>
      )}
    </section>
  );
}
