import { NavLink } from "react-router-dom";
import { LayoutDashboard, Ticket, CalendarDays, Package, ShieldCheck, X, Layers3, CircleHelp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { isAdmin } = useAuth();
  const links = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/tickets", label: "Tickets", icon: Ticket },
    { to: "/resources", label: "Resources", icon: Package },
    { to: "/bookings", label: "My bookings", icon: CalendarDays },
    ...(isAdmin ? [{ to: "/admin/resources", label: "Manage resources", icon: ShieldCheck }, { to: "/admin/bookings", label: "Manage bookings", icon: CalendarDays }] : []),
  ];
  return <>
    {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-brand"><span className="brand-mark"><Layers3 size={19} /></span><span>Triage<span className="brand-accent">Sync</span></span><button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={18}/></button></div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="sidebar-nav">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-icon"><CircleHelp size={16}/></span><div><strong>Need a hand?</strong><span>Visit the help center</span></div></div><div className="sidebar-version">TriageSync workspace</div></div>
    </aside>
  </>;
}
