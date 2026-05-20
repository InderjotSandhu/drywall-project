'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Submission {
  id: number; name: string; email: string; phone?: string;
  message: string; status: string; createdAt: string;
  projectType?: string; budget?: string;
  role?: string; experience?: string; availability?: string; resumeUrl?: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#4caf50',
  read: '#ff9800',
  wip: '#4a9eff',
  completed: '#27ae60',
  rejected: '#e74c3c',
  archived: '#999',
};

const STATUS_BG: Record<string, string> = {
  new: 'rgba(76,175,80,0.15)',
  read: 'rgba(255,152,0,0.15)',
  wip: 'rgba(74,158,255,0.15)',
  completed: 'rgba(39,174,96,0.15)',
  rejected: 'rgba(231,76,60,0.15)',
  archived: 'rgba(100,100,100,0.15)',
};

const NEXT_STATUS: Record<string, string> = {
  new: 'read',
  read: 'wip',
  wip: 'completed',
};

const NEXT_BTN_COLOR: Record<string, string> = {
  read: '#ff9800',
  wip: '#4a9eff',
  completed: '#27ae60',
};

export default function AdminSubmissions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'quote';

  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ type });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    try {
      const res = await fetch(`/api/admin/submissions?${params}`);
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [type, search, statusFilter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => { setSelectedIds(new Set()); }, [type, search, statusFilter]);

  async function updateStatus(id: number, status: string) {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, status }),
    });
    setItems(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  async function deleteSubmission(id: number) {
    if (!confirm('Delete this submission?')) return;
    await fetch(`/api/admin/submissions?type=${type}&id=${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(s => s.id !== id));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected submissions? This cannot be undone.`)) return;
    await Promise.all([...selectedIds].map(id =>
      fetch(`/api/admin/submissions?type=${type}&id=${id}`, { method: 'DELETE' })
    ));
    fetchItems();
  }

  async function bulkDelete(status: string) {
    if (!confirm(`Delete all "${status}" submissions? This cannot be undone.`)) return;
    await fetch(`/api/admin/submissions?type=${type}&status=${status}`, { method: 'DELETE' });
    fetchItems();
  }

  async function markAllAsRead() {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, markAllAsRead: true }),
    });
    setItems(prev => prev.map(s => s.status === 'new' ? { ...s, status: 'read' } : s));
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(s => s.id)));
    }
  }

  const tabs = [
    { key: 'quote', label: 'Quote Requests' },
    { key: 'career', label: 'Career Applications' },
  ];

  const newCount = items.filter(s => s.status === 'new').length;
  const statusCounts: Record<string, number> = {};
  for (const s of items) {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  }

  function statusStyle(status: string) {
    return {
      padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600,
      textTransform: 'capitalize' as const,
      background: STATUS_BG[status] || 'rgba(100,100,100,0.15)',
      color: STATUS_COLORS[status] || '#999',
    };
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Submissions</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => router.push(`/admin/submissions?type=${tab.key}`)}
            style={{
              padding: '8px 20px', borderRadius: 6, border: '1px solid rgba(210,180,140,0.15)',
              background: type === tab.key ? '#c9973a' : 'transparent',
              color: type === tab.key ? '#0a0907' : '#f0e6d3',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search name, email, message..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(210,180,140,0.15)',
            background: 'rgba(255,255,255,0.03)', color: '#f0e6d3', fontSize: '0.85rem',
            flex: '1 1 200px', minWidth: 160,
          }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(210,180,140,0.15)',
            background: 'rgba(255,255,255,0.03)', color: '#f0e6d3', fontSize: '0.85rem',
          }}>
          <option value="" style={{ color: '#000' }}>All statuses</option>
          <option value="new" style={{ color: '#000' }}>New</option>
          <option value="read" style={{ color: '#000' }}>Read</option>
          <option value="wip" style={{ color: '#000' }}>WIP</option>
          <option value="completed" style={{ color: '#000' }}>Completed</option>
          <option value="rejected" style={{ color: '#000' }}>Rejected</option>
          <option value="archived" style={{ color: '#000' }}>Archived</option>
        </select>

        <button onClick={() => { setDeleteMode(!deleteMode); if (deleteMode) setSelectedIds(new Set()); }}
          style={{
            background: deleteMode ? 'rgba(231,76,60,0.12)' : 'rgba(100,100,100,0.08)',
            border: deleteMode ? '1px solid rgba(231,76,60,0.25)' : '1px solid rgba(100,100,100,0.15)',
            color: deleteMode ? '#e74c3c' : '#999',
            padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
          {deleteMode ? 'Cancel' : 'Delete'}
        </button>

        {deleteMode && selectedIds.size > 0 && (
          <button onClick={deleteSelected}
            style={{
              background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.25)',
              color: '#e74c3c', padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
            Delete Selected ({selectedIds.size})
          </button>
        )}

        {newCount > 0 && (
          <button onClick={markAllAsRead}
            style={{
              background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.25)',
              color: '#ff9800', padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
            Mark All as Read ({newCount})
          </button>
        )}

        {['rejected', 'archived'].map(st => {
          const count = statusCounts[st] || 0;
          if (count === 0) return null;
          return (
            <button key={st} onClick={() => bulkDelete(st)}
              style={{
                background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                color: '#e74c3c', padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
              }}>
              Delete All {st} ({count})
            </button>
          );
        })}
      </div>

      {loading ? <p>Loading...</p> : items.length === 0 ? <p>No submissions found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {deleteMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
              <input type="checkbox"
                checked={items.length > 0 && selectedIds.size === items.length}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer', accentColor: '#c9973a' }}
              />
              <span style={{ color: 'rgba(240,220,190,0.4)', fontSize: '0.8rem' }}>
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
              </span>
            </div>
          )}
          {items.map(s => (
            <div key={s.id}
              style={{
                background: selectedIds.has(s.id) ? 'rgba(201,151,58,0.06)' : 'rgba(255,255,255,0.02)',
                border: selectedIds.has(s.id)
                  ? '1px solid rgba(201,151,58,0.2)'
                  : '1px solid rgba(210,180,140,0.08)',
                borderRadius: 10, overflow: 'hidden',
              }}>
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                {deleteMode && (
                  <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)}
                    style={{ cursor: 'pointer', accentColor: '#c9973a' }}
                  />
                )}
                <div onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                  <div>
                    <strong>{s.name}</strong>
                    <span style={{ color: 'rgba(240,220,190,0.4)', marginLeft: 12, fontSize: '0.85rem' }}>{s.email}</span>
                    {type === 'quote' && s.projectType && (
                      <span style={{ color: '#c9973a', marginLeft: 12, fontSize: '0.85rem' }}>{s.projectType}</span>
                    )}
                    {type === 'career' && s.role && (
                      <span style={{ color: '#4a9eff', marginLeft: 12, fontSize: '0.85rem' }}>{s.role}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={statusStyle(s.status)}>{s.status}</span>
                    <span style={{ color: 'rgba(240,220,190,0.3)', fontSize: '0.8rem' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {expanded === s.id && (
                <div style={{ padding: `0 18px 14px ${deleteMode ? 52 : 18}px`, borderTop: '1px solid rgba(210,180,140,0.06)' }}>
                  <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem' }}>
                    {s.phone && <div><span style={{ color: 'rgba(240,220,190,0.4)' }}>Phone:</span> {s.phone}</div>}
                    {type === 'quote' && s.budget && <div><span style={{ color: 'rgba(240,220,190,0.4)' }}>Budget:</span> {s.budget}</div>}
                    {type === 'career' && s.experience && <div><span style={{ color: 'rgba(240,220,190,0.4)' }}>Experience:</span> {s.experience}</div>}
                    {type === 'career' && s.availability && <div><span style={{ color: 'rgba(240,220,190,0.4)' }}>Availability:</span> {s.availability}</div>}
                    {type === 'career' && s.resumeUrl && <div><span style={{ color: 'rgba(240,220,190,0.4)' }}>Resume:</span> <a href={s.resumeUrl} target="_blank" style={{ color: '#4a9eff' }}>View</a></div>}
                    <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'rgba(240,220,190,0.4)' }}>Message:</span><br />{s.message}</div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {NEXT_STATUS[s.status] && (
                      <button onClick={() => updateStatus(s.id, NEXT_STATUS[s.status])}
                        style={{
                          background: 'none',
                          border: `1px solid ${NEXT_BTN_COLOR[NEXT_STATUS[s.status]]}4d`,
                          color: NEXT_BTN_COLOR[NEXT_STATUS[s.status]],
                          padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem',
                        }}>
                        Mark {NEXT_STATUS[s.status]}
                      </button>
                    )}
                    {s.status !== 'rejected' && s.status !== 'completed' && (
                      <button onClick={() => updateStatus(s.id, 'rejected')}
                        style={{
                          background: 'none', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c',
                          padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem',
                        }}>
                        Reject
                      </button>
                    )}
                    {s.status !== 'archived' && (
                      <button onClick={() => updateStatus(s.id, 'archived')}
                        style={{
                          background: 'none', border: '1px solid rgba(100,100,100,0.3)', color: '#999',
                          padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem',
                        }}>
                        Archive
                      </button>
                    )}
                    <button onClick={() => deleteSubmission(s.id)}
                      style={{
                        background: 'none', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c',
                        padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem',
                      }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
