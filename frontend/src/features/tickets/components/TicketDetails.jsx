import { Bot, CheckCircle2 } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import TicketEditForm from "./TicketEditForm";
import TicketTimeline from "./TicketTimeline";
import { formatDateTime } from "../../../utils/date";
export default function TicketDetails({ ticket, events }) {
  const reviewed = Boolean(
    ticket.isReviewed ||
    ticket.reviewedAt ||
    ticket.humanReviewed ||
    ticket.reviewedBy,
  );
  return (
    <>
      <PageHeader
        eyebrow={`TICKET · ${ticket.id}`}
        title={ticket.subject || "Untitled ticket"}
        description={`Created ${formatDateTime(ticket.createdAt)}`}
      >
        <span className="review-indicator">
          {reviewed ? <CheckCircle2 size={18} /> : <Bot size={18} />}
          {reviewed ? "Human reviewed" : "Awaiting human review"}
        </span>
      </PageHeader>
      <div className="ticket-detail-grid">
        <Card
          title="Request details"
          action={<Badge value={ticket.status || "OPEN"} />}
          className="ticket-body-panel"
        >
          <div className="ticket-content">
            {ticket.body || "No description was provided."}
          </div>
          <dl className="ticket-meta-grid">
            {[
              ["Category", ticket.category || "Uncategorized"],
              ["Priority", ticket.priority || "Not set"],
              [
                "Assignee",
                ticket.assignee?.name ||
                  ticket.assignee?.email ||
                  ticket.assigneeId ||
                  "Unassigned",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {reviewed && (
            <p className="review-meta">
              <CheckCircle2 size={16} />
              {ticket.reviewedAt
                ? `Reviewed ${formatDateTime(ticket.reviewedAt)}`
                : "Human review recorded"}
              {ticket.reviewer?.name ? ` by ${ticket.reviewer.name}` : ""}
            </p>
          )}
        </Card>
        <TicketEditForm key={ticket.id} ticket={ticket} />
      </div>
      <TicketTimeline events={events} />
    </>
  );
}
