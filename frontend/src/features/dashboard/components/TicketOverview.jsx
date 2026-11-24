import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import CategoryChart from "../../../components/charts/CategoryChart";
import PriorityChart from "../../../components/charts/PriorityChart";
import { formatDate } from "../../../utils/date";
export default function TicketOverview({ data, admin }) {
  return (
    <>
      {admin && (
        <>
          <div className="analytics-grid">
            <CategoryChart values={data.categories} />
            <PriorityChart values={data.priorities} />
          </div>
          <Card
            title="Human review"
            description="Review coverage across triage outcomes"
            className="reviewed-panel"
          >
            <div className="reviewed-number">
              {data.stats.reviewedCount ?? "—"}
              <span>tickets reviewed</span>
            </div>
            <div className="reviewed-rate">
              <span>Model agreement</span>
              <b>
                {data.stats.modelAgreementRate == null
                  ? "—"
                  : `${data.stats.modelAgreementRate}%`}
              </b>
            </div>
          </Card>
        </>
      )}
      <Card
        title="Recent tickets"
        description="Latest requests available in your workspace"
        className="recent-panel"
        action={
          <Link to="/tickets" className="panel-link">
            All tickets
          </Link>
        }
      >
        {data.recent.length ? (
          <div className="recent-list">
            {data.recent.map((ticket) => (
              <Link to={`/tickets/${ticket.id}`} key={ticket.id}>
                <span className="recent-ticket-icon">
                  <Ticket size={18} />
                </span>
                <span>
                  <b>{ticket.subject || "Untitled ticket"}</b>
                  <small>
                    {ticket.category || "Uncategorized"} ·{" "}
                    {formatDate(ticket.createdAt)}
                  </small>
                </span>
                <Badge value={ticket.status || "OPEN"} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="analytics-empty">No ticket records are available.</p>
        )}
      </Card>
    </>
  );
}
