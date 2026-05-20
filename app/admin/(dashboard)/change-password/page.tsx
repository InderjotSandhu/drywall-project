'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPass !== confirm) {
      setError('New passwords do not match');
      return;
    }
    if (newPass.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to change password');
        return;
      }

      setSuccess(true);
      setCurrent('');
      setNewPass('');
      setConfirm('');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(210,180,140,0.15)', borderRadius: 6, color: '#f0e6d3' };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: '0.85rem', color: 'rgba(240,220,190,0.6)' };

  return (
    <div style={{ maxWidth: 400 }}>
      <h1 style={{ marginBottom: 24 }}>Change Password</h1>
      <Link href="/admin" style={{ color: 'rgba(240,220,190,0.5)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: 16 }} onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.7'} onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>← Back</Link>

      {success && (
        <p style={{ color: '#4caf50', marginBottom: 16, padding: '10px 14px', background: 'rgba(76,175,80,0.1)', borderRadius: 6, border: '1px solid rgba(76,175,80,0.2)' }}>
          Password changed successfully.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Current Password</label>
          <input type="password" style={inputStyle} value={current} onChange={e => setCurrent(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>New Password</label>
          <input type="password" style={inputStyle} value={newPass} onChange={e => setNewPass(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Confirm New Password</label>
          <input type="password" style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>

        {error && <p style={{ color: '#ff5252', marginBottom: 16 }}>{error}</p>}

        <button type="submit" disabled={saving} style={{ background: '#c9973a', color: '#0a0907', padding: '10px 28px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
