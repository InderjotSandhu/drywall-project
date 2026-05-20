import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword, hashPassword, safeCompare } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const { allowed, resetInMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({
      error: `Too many attempts. Try again in ${Math.ceil(resetInMs / 1000 / 60)} minutes.`,
    }, { status: 429 });
  }

  const { password } = await request.json();
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const admin = await prisma.admin.findFirst();

  if (admin) {
    if (!verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } else {
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envPassword || !safeCompare(password, envPassword)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    await prisma.admin.create({ data: { passwordHash: hashPassword(password) } });
  }

  await createSession();
  return NextResponse.json({ success: true });
}
