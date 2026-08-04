import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';

export default function MonitoringPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.monitoring().then(setData);
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageHeader
        title="Network Monitoring"
        description="Platform health metrics and activity signals."
      />
      {data && (
        <div className="card-grid">
          <article className="card">
            <h3>Status</h3>
            <p className="value" style={{ color: '#34d399' }}>{data.status}</p>
          </article>
          <article className="card">
            <h3>Uptime (seconds)</h3>
            <p className="value">{Math.round(data.uptime)}</p>
          </article>
          <article className="card">
            <h3>Memory (MB)</h3>
            <p className="value">{data.memoryMb}</p>
          </article>
          <article className="card">
            <h3>Security events (1h)</h3>
            <p className="value">{data.eventsLastHour}</p>
          </article>
        </div>
      )}
    </>
  );
}
