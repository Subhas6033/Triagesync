import { CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";
import BookingStatus from "./BookingStatus";
import BookingActions from "./BookingActions";
import { formatDateRange } from "../../../utils/date";
export default function BookingCard({ booking, admin = false }) {
  return (
    <article className="panel booking-card">
      <div className="booking-card-main">
        <span className="booking-resource-icon">
          <CalendarDays size={20} />
        </span>
        <div className="booking-card-info">
          <div className="booking-title-row">
            <h2>
              {booking.resource?.name || `Resource ${booking.resourceId}`}
            </h2>
            <BookingStatus status={booking.status} />
          </div>
          <p>{booking.purpose || "No purpose provided."}</p>
          <div className="booking-meta">
            {admin && (
              <span>
                <UserRound size={16} />
                {booking.user?.name ||
                  booking.user?.email ||
                  "Workspace member"}
              </span>
            )}
            <span>
              <Clock3 size={16} />
              {formatDateRange(booking.startTime, booking.endTime)}
            </span>
            {booking.resource?.location && (
              <span>
                <MapPin size={16} />
                {booking.resource.location}
              </span>
            )}
          </div>
          {(booking.decisionNote || booking.note) && (
            <p className="booking-note">
              {booking.decisionNote || booking.note}
            </p>
          )}
        </div>
      </div>
      <BookingActions booking={booking} admin={admin} />
    </article>
  );
}
