import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import BookingList from "../features/bookings/components/BookingList";
import { useBookingList } from "../features/bookings/hooks/useBookings";
export default function MyBookingsPage() {
  const { query, setPage } = useBookingList();
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="RESERVATIONS"
        title="My bookings"
        description="Review and manage your resource reservations."
      />
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
