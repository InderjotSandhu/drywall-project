'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: '', category: '', description: '', location: '',
    image: '', imageAlt: '', order: 0, isActive: true,
  });
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        const d = data?.data;
        if (d) {
          setForm({
            title: d.title, category: d.category, description: d.description,
            location: d.location || '', image: d.image, imageAlt: d.imageAlt || '',
            order: d.order ?? 0, isActive: d.isActive !== false,
          });
          setStats(d.stats || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  function addStat() { setStats(prev => [...prev, { label: '', value: '' }]); }
  function updateStat(i: number, field: 'label' | 'value', val: string) {
    setStats(prev => { const next = [...prev]; next[i] = { ...next[i], [field]: val }; return next; });
  }
  function removeStat(i: number) { setStats(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order), stats: stats.filter(s => s.label && s.value) }),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/projects');
  }

  if (loading) return <p>Loading...</p>;

  const inputStyle = { width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(210,180,140,0.15)', borderRadius: 6, color: '#f0e6d3' };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: '0.85rem', color: 'rgba(240,220,190,0.6)' };

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ marginBottom: 24 }}>Edit Project</h1>
      <Link href="/admin/projects" style={{ color: 'rgba(240,220,190,0.5)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: 16 }} onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.7'} onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>← Back</Link>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 100 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required />
          </div>
          <div>
            <label style={labelStyle}>Image Alt</label>
            <input style={inputStyle} value={form.imageAlt} onChange={e => setForm(f => ({ ...f, imageAlt: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Order</label>
            <input type="number" style={inputStyle} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Active</label>
          <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={labelStyle}>Stats (optional)</span>
            <button type="button" onClick={addStat} style={{ background: 'none', border: '1px solid rgba(210,180,140,0.3)', color: '#c9973a', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem' }}>+ Add Stat</button>
          </div>
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <input placeholder="Label" style={{ ...inputStyle, width: 200 }} value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} />
              <input placeholder="Value" style={{ ...inputStyle, width: 120 }} value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} />
              <button type="button" onClick={() => removeStat(i)} style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer' }}>X</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} style={{ background: '#c9973a', color: '#0a0907', padding: '10px 28px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}
