import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/media', label: 'Media' },
  { to: '/chat', label: 'Chat' },
  { to: '/tickets', label: 'Help Desk' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/security', label: 'Security', adminOnly: true },
  { to: '/monitoring', label: 'Monitoring', adminOnly: true },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          Unified <span>Portal</span>
        </div>
        <nav className="nav-list">
          {navItems
            .filter((item) => !item.adminOnly || user.role === 'ADMIN')
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
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
