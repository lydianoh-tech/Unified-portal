import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<unknown[]>([]);

  useEffect(() => {
    void api.tickets().then((data) => setTickets(data.tickets));
  }, []);

  return (
    <>
      <header className="page-header">
        <h1>Help Desk</h1>
        <p>Submit support tickets and track resolution status.</p>
      </header>
      <div className="card">
        <h3>Open tickets</h3>
        <p className="value">{tickets.length}</p>
      </div>
    </>
  );
}
