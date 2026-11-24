import { Link, useParams } from "react-router-dom";
import { useTicket } from "../features/tickets/hooks/useTickets";
import TicketDetails from "../features/tickets/components/TicketDetails";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";
export default function TicketDetailsPage() {
  const { id } = useParams();
  const query = useTicket(id);
  const ticket = query.data?.ticket;
  return (
    <main className="workspace-page">
      <Link to="/tickets" className="back-link">
        All tickets
      </Link>
      {query.isPending ? (
        <Skeleton count={2} className="detail-skeleton" />
      ) : query.isError ? (
        <ErrorState
          title="Ticket could not be loaded"
          error={query.error}
          onRetry={query.refetch}
        />
      ) : ticket ? (
        <TicketDetails
          key={id}
          ticket={ticket}
          events={query.data.events || []}
        />
      ) : (
        <EmptyState
          title="Ticket not found"
          description="This ticket is no longer available."
        />
      )}
    </main>
  );
}
