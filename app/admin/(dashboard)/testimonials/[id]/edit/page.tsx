'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTestimonial() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ name: '', quote: '', order: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/testimonials/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setForm({ name: data.name, quote: data.quote, order: data.order ?? 0, isActive: data.isActive !== false });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/testimonials/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) }),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/testimonials');
  }

  if (loading) return <p>Loading...</p>;

  const inputStyle = { width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(210,180,140,0.15)', borderRadius: 6, color: '#f0e6d3' };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: '0.85rem', color: 'rgba(240,220,190,0.6)' };

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: 24 }}>Edit Testimonial</h1>
      <Link href="/admin/testimonials" style={{ color: 'rgba(240,220,190,0.5)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: 16 }} onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.7'} onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>← Back</Link>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Quote</label>
          <textarea style={{ ...inputStyle, minHeight: 120 }} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Order</label>
            <input type="number" style={inputStyle} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
          </div>
          <div>
            <label style={labelStyle}>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
          </div>
        </div>
        <button type="submit" disabled={saving} style={{ background: '#c9973a', color: '#0a0907', padding: '10px 28px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Update Testimonial'}
        </button>
      </form>
    </div>
  );
}
