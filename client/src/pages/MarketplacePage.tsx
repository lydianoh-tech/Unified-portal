import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function MarketplacePage() {
  const [listings, setListings] = useState<Array<{ id: string; title: string; description: string; price: string }>>([]);

  useEffect(() => {
    void api.listings().then((data) => setListings(data.listings as typeof listings));
  }, []);

  return (
    <>
      <header className="page-header">
        <h1>Marketplace</h1>
        <p>Purchase items listed by other users on the platform.</p>
      </header>
      {listings.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: '#94a3b8' }}>No listings yet. Create one via the API to get started.</p>
        </div>
      ) : (
        <div className="card-grid">
          {listings.map((item) => (
            <article key={item.id} className="card">
              <h3>{item.title}</h3>
              <p style={{ color: '#cbd5e1' }}>{item.description}</p>
              <p className="value">${Number(item.price).toFixed(2)}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
