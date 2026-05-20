import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: 'No admin account found' }, { status: 500 });
    }

    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
