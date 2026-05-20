'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Service {
  id: string; title: string; description: string; detail: string;
  order: number; isActive: boolean;
  tags: { label: string }[]; features: { title: string; description: string }[];
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(d => { setServices(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    setServices(prev => prev.filter(s => s.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Services</h1>
        <Link href="/admin/services/new"
          style={{ background: '#c9973a', color: '#0a0907', padding: '8px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          + New Service
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(210,180,140,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Title</th>
            <th style={{ padding: '12px 8px' }}>Order</th>
            <th style={{ padding: '12px 8px' }}>Active</th>
            <th style={{ padding: '12px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid rgba(210,180,140,0.06)' }}>
              <td style={{ padding: '12px 8px' }}>{s.title}</td>
              <td style={{ padding: '12px 8px' }}>{s.order}</td>
              <td style={{ padding: '12px 8px' }}>{s.isActive ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px 8px', display: 'flex', gap: 8 }}>
                <Link href={`/admin/services/${s.id}/edit`}
                  style={{ color: '#4a9eff', textDecoration: 'none', fontSize: '0.85rem' }}>Edit</Link>
                <button onClick={() => handleDelete(s.id)}
                  style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
