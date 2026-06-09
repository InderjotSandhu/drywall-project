'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f5f2ed', fontFamily: 'Arial, sans-serif', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 40, maxWidth: 400, width: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, color: '#1a1a1a' }}>Sign In</h1>
        <p style={{ margin: '0 0 24px', color: '#888', fontSize: 14 }}>
          Sign in to submit a quote or job application
        </p>

        {error && (
          <p style={{ color: '#e74c3c', fontSize: 13, marginBottom: 16 }}>
            {error === 'AccessDenied' ? 'Access denied.' : 'Something went wrong. Please try again.'}
          </p>
        )}

        <button onClick={() => signIn('google', { callbackUrl })}
          style={{
            width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8,
            background: '#fff', cursor: 'pointer', fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16,
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
          <span style={{ color: '#888', fontSize: 13 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
        </div>

        {!sent ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            signIn('resend', { email, callbackUrl });
            setSent(true);
          }}>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8,
                fontSize: 15, boxSizing: 'border-box', marginBottom: 12,
              }} />
            <button type="submit"
              style={{
                width: '100%', padding: '12px 16px', border: 'none', borderRadius: 8,
                background: '#c9973a', color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600,
              }}>
              Send Magic Link
            </button>
          </form>
        ) : (
          <p style={{ color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 1.6 }}>
            Check your inbox. If the email does not arrive, check your spam folder.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f2ed' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
