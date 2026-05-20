'use client';

export default function AdminRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Admin error:', error);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0d0b',
      color: '#f0e6d3',
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Unable to load admin panel</h1>
        <p style={{ color: 'rgba(240,220,190,0.6)', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
          Make sure all required environment variables are set in your Vercel project settings:
        </p>
        <ul style={{
          textAlign: 'left', color: 'rgba(240,220,190,0.6)', fontSize: '0.85rem',
          lineHeight: 2, listStyle: 'none', padding: 0, marginBottom: 24,
        }}>
          <li><code style={{ color: '#c9973a' }}>DATABASE_URL</code> — PostgreSQL connection string</li>
          <li><code style={{ color: '#c9973a' }}>DIRECT_URL</code> — Direct DB connection (bypasses pgBouncer)</li>
          <li><code style={{ color: '#c9973a' }}>AUTH_SECRET</code> — Session signing secret</li>
          <li><code style={{ color: '#c9973a' }}>ADMIN_PASSWORD</code> — Initial admin password</li>
        </ul>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={reset}
            style={{
              background: '#c9973a', color: '#0a0907', border: 'none',
              padding: '10px 24px', borderRadius: 6, fontWeight: 600,
              cursor: 'pointer', fontSize: '0.85rem',
            }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
