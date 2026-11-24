import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import BookingTable from "./BookingTable";
import Skeleton from "../../../components/common/Skeleton";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";
export default function BookingList({ query, bookings, admin = false }) {
  if (query.isPending)
    return <Skeleton count={2} className="booking-skeleton" />;
  if (query.isError)
    return (
      <ErrorState
        title="Bookings could not be loaded"
        error={query.error}
        onRetry={query.refetch}
      />
    );
  if (!bookings.length)
    return (
      <EmptyState
        icon={CalendarDays}
        title={admin ? "No matching booking requests" : "No bookings yet"}
        description={
          admin
            ? "Requests matching this view will appear here."
            : "Browse resources to request your first booking."
        }
      >
        {!admin && (
          <Link className="btn-primary" to="/resources">
            Explore resources
          </Link>
        )}
      </EmptyState>
    );
  return <BookingTable bookings={bookings} admin={admin} />;
}
