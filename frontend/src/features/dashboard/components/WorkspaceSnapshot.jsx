import { Link } from "react-router-dom";
import { CalendarDays, Package, Ticket } from "lucide-react";
import Card from "../../../components/common/Card";
export default function WorkspaceSnapshot({ data, admin }) {
  const links = [
    ["/tickets", "Support tickets", "Review and manage requests", Ticket],
    ["/resources", "Shared resources", "Find rooms and equipment", Package],
    [
      admin ? "/admin/bookings" : "/bookings",
      admin ? "Booking requests" : "My bookings",
      "Track resource reservations",
      CalendarDays,
    ],
  ];
  return (
    <Card
      title="Workspace snapshot"
      description="Live records available to you"
      className="quick-panel"
    >
      <div className="snapshot-grid">
        {[
          ["tickets", data.ticketTotal],
          ["bookings", data.bookingsTotal],
          ["shared resources", data.resourceTotal],
        ].map(([label, value]) => (
          <div key={label}>
            <b>{value ?? "—"}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <nav className="quick-links" aria-label="Workspace shortcuts">
        {links.map(([to, label, description, Icon]) => (
          <Link key={to} to={to}>
            <span className="quick-link-icon violet">
              <Icon size={20} />
            </span>
            <span>
              <b>{label}</b>
              <small>{description}</small>
            </span>
          </Link>
        ))}
      </nav>
    </Card>
  );
}
