import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import { formatDate, formatDateTime } from "../../../utils/date";
export default function TicketCard({ ticket }) {
  return (
    <article className="panel ticket-card">
      <Link to={`/tickets/${ticket.id}`}>
        <h2>{ticket.subject || "Untitled ticket"}</h2>
        <p>{ticket.body || "No description provided."}</p>
      </Link>
      <div className="ticket-card-badges">
        <Badge value={ticket.status || "OPEN"} />
        <Badge value={ticket.priority} />
      </div>
      <div className="ticket-card-meta">
        <span>{ticket.category || "Uncategorized"}</span>
        <time
          dateTime={ticket.createdAt}
          title={formatDateTime(ticket.createdAt)}
        >
          {formatDate(ticket.createdAt)}
        </time>
      </div>
    </article>
  );
}
