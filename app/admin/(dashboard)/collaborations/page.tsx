'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Collaboration {
  id: number; name: string; logo: string; description?: string;
  order: number; isActive: boolean;
}

export default function AdminCollaborations() {
  const [items, setItems] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/collaborations')
      .then(r => r.json())
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this partner?')) return;
    await fetch(`/api/admin/collaborations/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Partners / Collaborations</h1>
        <Link href="/admin/collaborations/new"
          style={{ background: '#c9973a', color: '#0a0907', padding: '8px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          + New Partner
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(210,180,140,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Name</th>
            <th style={{ padding: '12px 8px' }}>Order</th>
            <th style={{ padding: '12px 8px' }}>Active</th>
            <th style={{ padding: '12px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(210,180,140,0.06)' }}>
              <td style={{ padding: '12px 8px' }}>{p.name}</td>
              <td style={{ padding: '12px 8px' }}>{p.order}</td>
              <td style={{ padding: '12px 8px' }}>{p.isActive ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px 8px', display: 'flex', gap: 8 }}>
                <Link href={`/admin/collaborations/${p.id}/edit`}
                  style={{ color: '#4a9eff', textDecoration: 'none', fontSize: '0.85rem' }}>Edit</Link>
                <button onClick={() => handleDelete(p.id)}
                  style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
