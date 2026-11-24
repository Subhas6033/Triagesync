import { LogOut, Menu, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import Button from "../common/Button";
const titles = {
  "/dashboard": "Overview",
  "/tickets": "Tickets",
  "/resources": "Resources",
  "/bookings": "My bookings",
  "/admin/resources": "Manage resources",
  "/admin/bookings": "Manage bookings",
};
export default function Navbar({ onMenu, expanded, mobile }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const name = user?.name || user?.email || "Workspace member";
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenu}
          aria-label={
            mobile
              ? "Open navigation"
              : expanded
                ? "Collapse navigation"
                : "Expand navigation"
          }
          aria-expanded={expanded}
          aria-controls={
            !mobile || expanded ? "workspace-navigation" : undefined
          }
        >
          <Menu size={21} />
        </Button>
        <div className="breadcrumb">
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
          <strong>{titles[pathname] || "Details"}</strong>
        </div>
      </div>
      <div className="topbar-actions">
        <Link to="/tickets" className="quick-search">
          <Search size={18} />
          <span>Search tickets</span>
        </Link>
        <div className="user-chip">
          <span className="avatar" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="user-name">{name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="logout-button"
          onClick={logout}
          aria-label="Sign out"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </Button>
      </div>
    </header>
  );
}
