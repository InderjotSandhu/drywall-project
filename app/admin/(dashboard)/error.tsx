'use client';

import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Admin dashboard error:', error);

  const isDatabaseError = error.message?.includes('Can\'t reach database')
    || error.message?.includes('prisma')
    || error.message?.includes('connection')
    || error.message?.includes('database');

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
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,82,82,0.15)', color: '#ff5252',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', margin: '0 auto 24px',
        }}>!</div>

        <h1 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Something went wrong</h1>

        <p style={{ color: 'rgba(240,220,190,0.6)', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
          {isDatabaseError
            ? 'The admin panel could not connect to the database. Please check that your database credentials are correctly configured in the Vercel project settings.'
            : 'An unexpected error occurred while loading this page. Please try again.'}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={reset}
            style={{
              background: '#c9973a', color: '#0a0907', border: 'none',
              padding: '10px 24px', borderRadius: 6, fontWeight: 600,
              cursor: 'pointer', fontSize: '0.85rem',
            }}>
            Try Again
          </button>
          <Link href="/admin/login"
            style={{
              background: 'rgba(255,255,255,0.05)', color: '#f0e6d3',
              border: '1px solid rgba(210,180,140,0.15)', textDecoration: 'none',
              padding: '10px 24px', borderRadius: 6, fontWeight: 500,
              fontSize: '0.85rem',
            }}>
            Back to Login
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: 32, textAlign: 'left' }}>
            <summary style={{ color: 'rgba(240,220,190,0.4)', cursor: 'pointer', fontSize: '0.8rem' }}>
              Error Details
            </summary>
            <pre style={{
              marginTop: 8, padding: 16, borderRadius: 8, fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.03)', overflow: 'auto',
              color: '#ff5252', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
