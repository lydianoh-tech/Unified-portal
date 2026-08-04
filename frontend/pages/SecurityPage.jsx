import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import SeverityBadge from '../components/SeverityBadge';

export default function SecurityPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    Promise.all([api.securityDashboard(), api.securityLogs()]).then(([dash, logData]) => {
      setStats(dash.stats);
      setLogs(logData.logs);
    });
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageHeader
        title="Security Dashboard"
        description="SIEM-style log analysis and platform threat overview."
      />
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
                  <SeverityBadge severity={log.severity} />
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
