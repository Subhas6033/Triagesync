import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import BookingList from "../features/bookings/components/BookingList";
import { useBookingList } from "../features/bookings/hooks/useBookings";
import Button from "../components/common/Button";
import { BOOKING_STATUSES } from "../utils/constants";
export default function MyBookingsPage() {
  const { query, filter, setFilter, setPage } = useBookingList();
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="RESERVATIONS"
        title="My bookings"
        description="Review and manage your resource reservations."
      />
      <nav className="booking-filter-tabs" aria-label="Filter my bookings">
        {["ALL", ...BOOKING_STATUSES].map((value) => (
          <Button key={value} variant="ghost" aria-pressed={filter === value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>
            {value === "ALL" ? "All bookings" : value.charAt(0) + value.slice(1).toLowerCase()}
          </Button>
        ))}
      </nav>
      <BookingList query={query} bookings={query.data || []} />
      <Pagination
        page={query.page}
        total={query.total}
        pageSize={query.pageSize}
        onChange={setPage}
      />
    </main>
  );
}
