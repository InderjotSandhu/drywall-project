import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_KEY = 'admin_token';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const SELF = `'self'`;

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const cspNonce = `'nonce-${nonce}'`;
  return [
    `default-src ${SELF}`,
    `script-src ${SELF} ${cspNonce}`,
    `style-src ${SELF} 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src ${SELF} data: https: https://public.blob.vercel-storage.com`,
    `font-src ${SELF} https://fonts.gstatic.com`,
    `connect-src ${SELF} https://vercel.live ws: wss:`,
    `base-uri ${SELF}`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
  ].join('; ');
}

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
  const nonce = generateNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', buildCsp(nonce));
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

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

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
