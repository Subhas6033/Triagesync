import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  CalendarDays,
  Package,
  ShieldCheck,
  Layers3,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
export default function Sidebar({
  mobile = false,
  collapsed = false,
  onNavigate,
}) {
  const { isAdmin } = useAuth();
  const links = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/tickets", label: "Tickets", icon: Ticket },
    { to: "/resources", label: "Resources", icon: Package },
    { to: "/bookings", label: "My bookings", icon: CalendarDays },
    ...(isAdmin
      ? [
          {
            to: "/admin/resources",
            label: "Manage resources",
            icon: ShieldCheck,
          },
          {
            to: "/admin/bookings",
            label: "Manage bookings",
            icon: CalendarDays,
          },
        ]
      : []),
  ];
  return (
    <aside
      id="workspace-navigation"
      className={`app-sidebar ${mobile ? "mobile-sidebar" : ""}`}
    >
      <Link
        to="/dashboard"
        className="sidebar-brand"
        aria-label="TriageSync overview"
        onClick={onNavigate}
      >
        <span className="brand-mark">
          <Layers3 size={20} />
        </span>
        <span className="sidebar-brand-name">
          Triage<span className="brand-accent">Sync</span>
        </span>
      </Link>
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="sidebar-nav" aria-label="Workspace">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} aria-hidden="true" />
            <span className={collapsed ? "sr-only" : ""}>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <p className="sidebar-version">
          {isAdmin ? "Administrator" : "Member"} workspace
        </p>
      </div>
    </aside>
  );
}
