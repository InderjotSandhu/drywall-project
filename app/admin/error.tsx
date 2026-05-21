'use client';

export default function AdminRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Admin error:', error);

  const missingVars: string[] = [];
  if (error.message?.includes('DATABASE_URL')) missingVars.push('DATABASE_URL');
  if (error.message?.includes('DIRECT_URL')) missingVars.push('DIRECT_URL');
  if (error.message?.includes('AUTH_SECRET')) missingVars.push('AUTH_SECRET');
  if (error.message?.includes('ADMIN_PASSWORD')) missingVars.push('ADMIN_PASSWORD');

  const isEnvError = missingVars.length > 0 || 
    error.message?.includes('Missing environment variables') ||
    error.message?.includes('environment');

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
          {isEnvError 
            ? `Missing required environment variables: ${missingVars.join(', ') || 'Check Vercel project settings'}`
            : 'Make sure all required environment variables are set in your Vercel project settings:'}
        </p>
        {!isEnvError && (
          <ul style={{
            textAlign: 'left', color: 'rgba(240,220,190,0.6)', fontSize: '0.85rem',
            lineHeight: 2, listStyle: 'none', padding: 0, marginBottom: 24,
          }}>
            <li><code style={{ color: '#c9973a' }}>DATABASE_URL</code> — PostgreSQL connection string</li>
            <li><code style={{ color: '#c9973a' }}>DIRECT_URL</code> — Direct DB connection (bypasses pgBouncer)</li>
            <li><code style={{ color: '#c9973a' }}>AUTH_SECRET</code> — Session signing secret</li>
            <li><code style={{ color: '#c9973a' }}>ADMIN_PASSWORD</code> — Initial admin password</li>
          </ul>
        )}
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
