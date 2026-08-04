import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

function severityBadge(severity: string) {
  const map: Record<string, string> = {
    INFO: 'badge-info',
    WARNING: 'badge-warning',
    ERROR: 'badge-error',
    CRITICAL: 'badge-error',
  };
  return map[severity] ?? 'badge-info';
}

export default function SecurityPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [logs, setLogs] = useState<Array<{ id: string; event: string; severity: string; createdAt: string }>>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    void Promise.all([api.securityDashboard(), api.securityLogs()]).then(([dash, logData]) => {
      setStats(dash.stats);
      setLogs(logData.logs);
    });
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <header className="page-header">
        <h1>Security Dashboard</h1>
        <p>SIEM-style log analysis and platform threat overview.</p>
      </header>
      {stats && (
        <div className="card-grid" style={{ marginBottom: '2rem' }}>
          {Object.entries(stats).map(([key, value]) => (
            <article key={key} className="card">
              <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
              <p className="value">{value}</p>
            </article>
          ))}
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.event}</td>
                <td>
                  <span className={`badge ${severityBadge(log.severity)}`}>{log.severity}</span>
                </td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
