import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_KEY = 'admin_token';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

async function hmacSha256(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length);
  const bufA = new Uint8Array(maxLen);
  const bufB = new Uint8Array(maxLen);
  for (let i = 0; i < a.length; i++) bufA[i] = a.charCodeAt(i);
  for (let i = 0; i < b.length; i++) bufB[i] = b.charCodeAt(i);
  let result = 0;
  for (let i = 0; i < maxLen; i++) result |= bufA[i] ^ bufB[i];
  return result === 0;
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  const cookieValue = request.cookies.get(SESSION_KEY)?.value;
  if (!cookieValue) return false;

  const parts = cookieValue.split(':');
  if (parts.length < 2) return false;

  const issuedAt = parts[0];
  const token = parts.slice(1).join(':');

  const now = Date.now();
  if (now - Number(issuedAt) > SESSION_DURATION_MS) return false;

  const expected = await hmacSha256(secret, `admin-authenticated:${issuedAt}`);
  return timingSafeEqual(token, expected);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin') || (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login'))) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const method = request.method;
    if (pathname.startsWith('/api/admin') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
          }
        } catch {
          return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
        }
      }
    }
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
};
