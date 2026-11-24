import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import BookingList from "../features/bookings/components/BookingList";
import { useBookingList } from "../features/bookings/hooks/useBookings";
export default function AdminBookingsPage() {
  const { query, filter, setFilter, setPage } = useBookingList({ admin: true });
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Booking requests"
        description="Review shared resource reservations and respond to requests."
      ></PageHeader>
      <section className="panel booking-admin-panel">
        <div className="admin-list-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter bookings"
          >
            {[
              ["PENDING", "Pending"],
              ["APPROVED", "Approved"],
              ["ALL", "All requests"],
            ].map(([value, label]) => (
              <Button
                variant="ghost"
                key={value}
                aria-pressed={filter === value}
                className={filter === value ? "selected" : ""}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <span className="result-count">{query.total} requests</span>
        </div>
        <BookingList query={query} bookings={query.data || []} admin />
        <Pagination
          page={query.page}
          total={query.total}
          pageSize={query.pageSize}
          onChange={setPage}
        />
      </section>
    </main>
  );
}
