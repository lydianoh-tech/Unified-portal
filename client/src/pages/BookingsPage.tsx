import { useEffect, useState } from 'react';
import { api, type Booking } from '../lib/api';

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export default function BookingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([api.services(), api.bookings()])
      .then(([s, b]) => {
        setServices(s.services);
        setBookings(b.bookings);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load bookings';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Service Bookings</h1>
        <p>Browse available services and view your reservations.</p>
      </header>
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        {services.map((service) => (
          <article key={service.id} className="card">
            <h3>{service.name}</h3>
            <p style={{ color: '#cbd5e1' }}>{service.description}</p>
            <p className="value">${Number(service.price).toFixed(2)}</p>
          </article>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={3}>No reservations yet.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.service?.name ?? 'Unknown service'}</td>
                  <td>{new Date(booking.scheduledAt).toLocaleString()}</td>
                  <td>{booking.status.replace('_', ' ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
