import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_KEY = 'admin_token';

function getSecret(): string {
  return process.env.AUTH_SECRET || 'fallback-dev-secret';
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verify = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
}

export async function createSession(): Promise<void> {
  const token = crypto
    .createHmac('sha256', getSecret())
    .update('admin-authenticated')
    .digest('hex');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_KEY)?.value;
  if (!token) return false;

  const expected = crypto
    .createHmac('sha256', getSecret())
    .update('admin-authenticated')
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function requireAdmin(): Promise<void> {
  const authenticated = await getSession();
  if (!authenticated) redirect('/admin/login');
}

export async function requireAdminAPI(): Promise<NextResponse | null> {
  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function safeCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length);
  const bufA = Buffer.alloc(maxLen, a);
  const bufB = Buffer.alloc(maxLen, b);
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}
