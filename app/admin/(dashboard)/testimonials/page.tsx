'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: number; name: string; quote: string; order: number; isActive: boolean;
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(res => res.json())
      .then(d => { setItems(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(t => t.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Testimonials</h1>
        <Link href="/admin/testimonials/new"
          style={{ background: '#c9973a', color: '#0a0907', padding: '8px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          + New Testimonial
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(210,180,140,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Name</th>
            <th style={{ padding: '12px 8px' }}>Quote</th>
            <th style={{ padding: '12px 8px' }}>Order</th>
            <th style={{ padding: '12px 8px' }}>Active</th>
            <th style={{ padding: '12px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid rgba(210,180,140,0.06)' }}>
              <td style={{ padding: '12px 8px' }}>{t.name}</td>
              <td style={{ padding: '12px 8px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.quote}</td>
              <td style={{ padding: '12px 8px' }}>{t.order}</td>
              <td style={{ padding: '12px 8px' }}>{t.isActive ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px 8px', display: 'flex', gap: 8 }}>
                <Link href={`/admin/testimonials/${t.id}/edit`}
                  style={{ color: '#4a9eff', textDecoration: 'none', fontSize: '0.85rem' }}>Edit</Link>
                <button onClick={() => handleDelete(t.id)}
                  style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
