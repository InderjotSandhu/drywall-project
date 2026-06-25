import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_KEY = 'admin_token';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }
  return secret;
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
  const issuedAt = Date.now();
  const payload = `admin-authenticated:${issuedAt}`;

  const token = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  const cookieValue = `${issuedAt}:${token}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_KEY)?.value;
  if (!cookieValue) return false;

  const parts = cookieValue.split(':');
  if (parts.length < 2) return false;

  const issuedAt = parts[0];
  const token = parts.slice(1).join(':');

  const now = Date.now();
  if (now - Number(issuedAt) > SESSION_DURATION_MS) return false;

  const expected = crypto
    .createHmac('sha256', getSecret())
    .update(`admin-authenticated:${issuedAt}`)
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
