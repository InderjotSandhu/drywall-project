import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').max(256),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(256),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = changePasswordSchema.parse(body);

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'No admin account found' }, { status: 500 });
    }

    if (!verifyPassword(data.currentPassword, admin.passwordHash)) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(data.newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: (error as z.ZodError).issues[0]?.message || 'Validation failed',
      }, { status: 400 });
    }
    logger.error('Error changing password', error as Error);
    return handleApiError(error);
  }
}
