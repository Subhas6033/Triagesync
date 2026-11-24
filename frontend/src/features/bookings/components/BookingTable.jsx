import DataTable from "../../../components/common/DataTable";
import BookingCard from "./BookingCard";
import BookingStatus from "./BookingStatus";
import BookingActions from "./BookingActions";
import { formatDateRange } from "../../../utils/date";
export default function BookingTable({ bookings, admin = false }) {
  if (!admin)
    return (
      <div className="booking-list">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    );
  return (
    <>
      <div className="desktop-data">
        <DataTable
          caption="Booking requests"
          columns={["Reservation", "Requester", "Status", "Actions"]}
          rows={bookings}
          renderRow={(booking) => (
            <tr key={booking.id}>
              <td className="booking-table-info">
                <strong>
                  {booking.resource?.name || `Resource ${booking.resourceId}`}
                </strong>
                <p>{booking.purpose || "No purpose provided."}</p>
                <small>
                  {formatDateRange(booking.startTime, booking.endTime)}
                </small>
                {booking.resource?.location && (
                  <p>{booking.resource.location}</p>
                )}
                {(booking.decisionNote || booking.note) && (
                  <p className="booking-note">
                    {booking.decisionNote || booking.note}
                  </p>
                )}
              </td>
              <td>
                {booking.user?.name ||
                  booking.user?.email ||
                  "Workspace member"}
              </td>
              <td>
                <BookingStatus status={booking.status} />
              </td>
              <td>
                <BookingActions booking={booking} admin />
              </td>
            </tr>
          )}
        />
      </div>
      <div className="mobile-data booking-list">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} admin />
        ))}
      </div>
    </>
  );
}
