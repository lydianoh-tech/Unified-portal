import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const providerNavItems = [
  { path: "dashboard", label: "Dashboard" },
  { path: "bookings", label: "Bookings" },
  { path: "services", label: "Services" },
  { path: "marketplace", label: "Marketplace" },
  { path: "media", label: "Media" },
  { path: "chat", label: "Chat" },
  { path: "tickets", label: "Help Desk" },
  { path: "tasks", label: "Tasks" },
  { path: "security", label: "Security", adminOnly: true },
  { path: "monitoring", label: "Monitoring", adminOnly: true },
];

const customerNavItems = [
  { path: "dashboard", label: "Dashboard" },
  { path: "bookings", label: "Bookings" },
  { path: "marketplace", label: "Marketplace" },
  { path: "media", label: "Media" },
  { path: "chat", label: "Chat" },
  { path: "tickets", label: "Help Desk" },
];

export default function AppLayout({ roleGroup, allowedRoles, basePath }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const navItems =
    roleGroup === "customer" ? customerNavItems : providerNavItems;
  const portalLabel =
    roleGroup === "customer" ? "Customer Portal" : "Provider Portal";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          Unified <span>{portalLabel}</span>
        </div>
        <nav className="nav-list">
          {navItems
            .filter((item) => !item.adminOnly || user.role === "ADMIN")
            .map((item) => (
              <NavLink
                key={item.path}
                to={`${basePath}/${item.path}`}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div style={{ marginTop: "auto" }}>
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.85rem",
              color: "#94a3b8",
            }}
          >
            {user.name} ({user.role.toLowerCase()})
          </p>
          <button className="btn btn-secondary" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
