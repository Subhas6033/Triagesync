import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import DataTable from "../../../components/common/DataTable";
import Badge from "../../../components/common/Badge";
import TicketCard from "./TicketCard";
import { formatDate } from "../../../utils/date";
export default function TicketTable({ tickets }) {
  return (
    <>
      <div className="desktop-data">
        <DataTable
          caption="Support tickets"
          columns={["Ticket", "Status", "Priority", "Category", "Created"]}
          rows={tickets}
          renderRow={(ticket) => (
            <tr key={ticket.id}>
              <td>
                <Link to={`/tickets/${ticket.id}`} className="ticket-title">
                  <span className="ticket-mini-icon">
                    <Ticket size={18} />
                  </span>
                  <span>
                    <b>{ticket.subject || "Untitled ticket"}</b>
                    <small>{ticket.body || ticket.id}</small>
                  </span>
                </Link>
              </td>
              <td>
                <Badge value={ticket.status || "OPEN"} />
              </td>
              <td>
                <Badge value={ticket.priority} />
              </td>
              <td>{ticket.category ? <Badge value={ticket.category} icon /> : "—"}</td>
              <td>{formatDate(ticket.createdAt)}</td>
            </tr>
          )}
        />
      </div>
      <div className="mobile-data">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </>
  );
}
