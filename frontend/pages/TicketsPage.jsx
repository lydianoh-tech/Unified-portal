import { useEffect, useState } from 'react';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.tickets().then((data) => setTickets(data.tickets));
  }, []);

  return (
    <>
      <PageHeader
        title="Help Desk"
        description="Submit support tickets and track resolution status."
      />
      <div className="card">
        <h3>Open tickets</h3>
        <p className="value">{tickets.length}</p>
      </div>
    </>
  );
}
