import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword, hashPassword, safeCompare } from '@/lib/auth';
import { getClientIp, checkLoginRateLimit } from '@/lib/rate-limit';
import { checkBodySize } from '@/lib/body-limit';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const bodyLimitError = await checkBodySize(request);
    if (bodyLimitError) return bodyLimitError;

    const ip = getClientIp(request);
    const { allowed, resetInMs } = checkLoginRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `Too many attempts. Try again in ${Math.ceil(resetInMs / 1000 / 60)} minutes.`,
      }, { status: 429 });
    }

    const { password } = await request.json();
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst();

    if (admin) {
      if (!verifyPassword(password, admin.passwordHash)) {
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
    } else {
      const envPassword = process.env.ADMIN_PASSWORD;
      if (!envPassword || !safeCompare(password, envPassword)) {
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
      await prisma.admin.create({ data: { passwordHash: hashPassword(password) } });
    }

    await createSession();
    logger.info('Admin login successful', { ip });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Login failed', error as Error);
    return handleApiError(error);
  }
}
