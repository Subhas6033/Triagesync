import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false); const { logout } = useAuth();
  return <div className="app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/><div className="app-main"><Navbar onMenu={() => setMenuOpen(true)}/><div className="page-content"><Outlet/></div><button className="mobile-logout" onClick={logout}><LogOut size={16}/> Sign out</button></div></div>;
}
