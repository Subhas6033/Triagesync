import { Clock3 } from "lucide-react";
import Card from "../../../components/common/Card";
import { formatDateTime } from "../../../utils/date";
export default function TicketTimeline({ events = [] }) {
  return (
    <Card
      title="Ticket history"
      description="Changes made to this request"
      action={<Clock3 size={20} />}
      className="timeline-panel"
    >
      {events.length ? (
        <ol className="audit-timeline">
          {events.map((event, index) => (
            <li key={event.id || index}>
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <strong>{event.field || "Ticket updated"}</strong>
                <p>
                  {event.oldValue || "—"} → {event.newValue || "—"}
                </p>
                <small>
                  {event.actor || "Workspace member"} ·{" "}
                  {formatDateTime(event.createdAt)}
                </small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="timeline-empty">No changes have been recorded yet.</p>
      )}
    </Card>
  );
}
