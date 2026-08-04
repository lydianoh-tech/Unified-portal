import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const modules = [
    { title: 'Service Booking', desc: 'Schedule and manage service appointments' },
    { title: 'Marketplace', desc: 'Buy and sell items with other users' },
    { title: 'Media Library', desc: 'Upload and share photos and videos' },
    { title: 'Real-time Chat', desc: 'Message other users instantly' },
    { title: 'Help Desk', desc: 'Submit and track support tickets' },
    { title: 'Task Manager', desc: 'Organize personal and team tasks' },
    { title: 'Security Center', desc: 'SIEM-style logs and threat monitoring', admin: true },
    { title: 'Network Monitor', desc: 'Platform health and activity metrics', admin: true },
  ];

  return (
    <>
      <header className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Your secure hub for services, commerce, communication, and security.</p>
      </header>
      <div className="card-grid">
        {modules
          .filter((m) => !m.admin || user?.role === 'ADMIN')
          .map((mod) => (
            <article key={mod.title} className="card">
              <h3>{mod.title}</h3>
              <p style={{ margin: 0, color: '#cbd5e1' }}>{mod.desc}</p>
            </article>
          ))}
      </div>
    </>
  );
}
