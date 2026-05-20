'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditService() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    id: '', title: '', description: '', detail: '', order: 0, isActive: true,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<{ title: string; description: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetch(`/api/admin/services/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setForm({ id: d.id, title: d.title, description: d.description, detail: d.detail, order: d.order, isActive: d.isActive });
        setTags(d.tags.map((t: { label: string }) => t.label));
        setFeatures(d.features.map((f: { title: string; description: string }) => ({ title: f.title, description: f.description })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags(prev => [...prev, trimmed]);
    setTagInput('');
  }
  function removeTag(i: number) { setTags(prev => prev.filter((_, idx) => idx !== i)); }
  function addFeature() { setFeatures(prev => [...prev, { title: '', description: '' }]); }
  function updateFeature(i: number, field: 'title' | 'description', val: string) {
    setFeatures(prev => { const next = [...prev]; next[i] = { ...next[i], [field]: val }; return next; });
  }
  function removeFeature(i: number) { setFeatures(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/services/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form, order: Number(form.order),
        tags: tags.filter(Boolean),
        features: features.filter(f => f.title && f.description),
      }),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/services');
  }

  const inputStyle = { width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(210,180,140,0.15)', borderRadius: 6, color: '#f0e6d3' };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: '0.85rem', color: 'rgba(240,220,190,0.6)' };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ marginBottom: 24 }}>Edit Service</h1>
      <Link href="/admin/services" style={{ color: 'rgba(240,220,190,0.5)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: 16 }} onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.7'} onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>← Back</Link>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input style={inputStyle} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Short Description</label>
          <input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Detail</label>
          <textarea style={{ ...inputStyle, minHeight: 100 }} value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} required />
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

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={labelStyle}>Tags</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Type and press Enter" />
            <button type="button" onClick={addTag} style={{ background: 'none', border: '1px solid rgba(210,180,140,0.3)', color: '#c9973a', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>Add</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map((t, i) => (
              <span key={i} style={{ background: 'rgba(201,151,58,0.12)', padding: '2px 10px', borderRadius: 50, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                {t}
                <button type="button" onClick={() => removeTag(i)} style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}>X</button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={labelStyle}>Features</span>
            <button type="button" onClick={addFeature} style={{ background: 'none', border: '1px solid rgba(210,180,140,0.3)', color: '#c9973a', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem' }}>+ Add Feature</button>
          </div>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <input placeholder="Title" style={{ ...inputStyle, width: 200 }} value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)} />
              <input placeholder="Description" style={{ ...inputStyle, flex: 1 }} value={f.description} onChange={e => updateFeature(i, 'description', e.target.value)} />
              <button type="button" onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer' }}>X</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} style={{ background: '#c9973a', color: '#0a0907', padding: '10px 28px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Update Service'}
        </button>
      </form>
    </div>
  );
}
