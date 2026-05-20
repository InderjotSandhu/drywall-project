'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  isActive: boolean;
  order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Projects</h1>
        <Link href="/admin/projects/new"
          style={{ background: '#c9973a', color: '#0a0907', padding: '8px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          + New Project
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(210,180,140,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Title</th>
            <th style={{ padding: '12px 8px' }}>Category</th>
            <th style={{ padding: '12px 8px' }}>Order</th>
            <th style={{ padding: '12px 8px' }}>Active</th>
            <th style={{ padding: '12px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(210,180,140,0.06)' }}>
              <td style={{ padding: '12px 8px' }}>{p.title}</td>
              <td style={{ padding: '12px 8px', color: '#c9973a' }}>{p.category}</td>
              <td style={{ padding: '12px 8px' }}>{p.order}</td>
              <td style={{ padding: '12px 8px' }}>{p.isActive ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px 8px', display: 'flex', gap: 8 }}>
                <Link href={`/admin/projects/${p.id}/edit`}
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
