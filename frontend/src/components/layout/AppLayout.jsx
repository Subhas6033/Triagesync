import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Modal from "../common/Modal";
import useMediaQuery from "../../hooks/useMediaQuery";
export default function AppLayout() {
  const mobile = useMediaQuery("(max-width: 720px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`app-shell ${!mobile && collapsed ? "sidebar-collapsed" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobile ? (
        <Modal
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          title="Navigation"
        >
          <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
        </Modal>
      ) : (
        <Sidebar collapsed={collapsed} />
      )}
      <div className="app-main">
        <Navbar
          expanded={mobile ? menuOpen : !collapsed}
          mobile={mobile}
          onMenu={() =>
            mobile
              ? setMenuOpen((open) => !open)
              : setCollapsed((value) => !value)
          }
        />
        <div className="page-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
