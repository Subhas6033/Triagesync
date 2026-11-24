import { ArrowRight, Bell, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const titles = { "/dashboard": "Overview", "/tickets": "Tickets", "/resources": "Resources", "/bookings": "My bookings", "/admin/resources": "Manage resources", "/admin/bookings": "Manage bookings" };
export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth(); const { pathname } = useLocation();
  const name = user?.name || user?.email || "Workspace member";
  return <header className="app-topbar"><div className="topbar-left"><button onClick={onMenu} className="menu-toggle" aria-label="Open navigation"><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-sep"><span className="sr-only">/</span><ArrowRight size={13}/></span><strong>{titles[pathname] || "Details"}</strong></div></div><div className="topbar-actions"><button className="quick-search" type="button" aria-label="Search workspace"><Search size={17}/><span>Search</span></button><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="user-chip"><span className="avatar">{name.charAt(0).toUpperCase()}</span><span className="user-name">{name}</span></div><button className="logout-button" onClick={logout} aria-label="Sign out"><LogOut size={17}/><span>Sign out</span></button></div></header>;
}
