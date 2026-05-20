'use client';

import { useEffect, useRef, useState } from 'react';

export default function PushNotificationSetup() {
  const [visible, setVisible] = useState(false);
  const notifiedRef = useRef(new Set<number>());

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') return;
    if (Notification.permission === 'denied') return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const interval = setInterval(async () => {
      try {
        const [quotes, careers] = await Promise.all([
          fetch('/api/admin/submissions?type=quote').then(r => r.ok ? r.json() : []),
          fetch('/api/admin/submissions?type=career').then(r => r.ok ? r.json() : []),
        ]);

        for (const q of quotes) {
          if (!notifiedRef.current.has(q.id) && q.status === 'new') {
            notifiedRef.current.add(q.id);
            new Notification('New Quote Request', { body: `${q.name} — ${q.projectType}\n${q.email}` });
          }
        }
        for (const c of careers) {
          if (!notifiedRef.current.has(c.id) && c.status === 'new') {
            notifiedRef.current.add(c.id);
            new Notification('New Career Application', { body: `${c.name} — ${c.role}\n${c.email}` });
          }
        }
      } catch { /* ignore */ }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      padding: '10px 16px', borderRadius: 8, marginBottom: 16,
      background: 'rgba(201,151,58,0.1)', border: '1px solid rgba(201,151,58,0.2)',
      display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem',
    }}>
      <span>Get notified of new submissions while this tab is open.</span>
      <button onClick={async () => {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') setVisible(false);
      }}
        style={{
          background: '#c9973a', color: '#0a0907', border: 'none',
          padding: '6px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem',
          whiteSpace: 'nowrap',
        }}>
        Enable Notifications
      </button>
    </div>
  );
}
