import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quote';
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { message: { contains: search } },
      ];
    }
    let submissions;
    if (type === 'career') {
      submissions = await prisma.careerSubmission.findMany({ where, orderBy: { createdAt: 'desc' } });
    } else {
      submissions = await prisma.quoteSubmission.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id, type, status, markAllAsRead } = body;

    if (markAllAsRead) {
      if (type === 'career') {
        await prisma.careerSubmission.updateMany({ where: { status: 'new' }, data: { status: 'read' } });
      } else {
        await prisma.quoteSubmission.updateMany({ where: { status: 'new' }, data: { status: 'read' } });
      }
    } else if (type === 'career') {
      await prisma.careerSubmission.update({ where: { id: Number(id) }, data: { status } });
    } else {
      await prisma.quoteSubmission.update({ where: { id: Number(id) }, data: { status } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'quote';
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      if (type === 'career') {
        await prisma.careerSubmission.delete({ where: { id: Number(id) } });
      } else {
        await prisma.quoteSubmission.delete({ where: { id: Number(id) } });
      }
    } else if (status) {
      if (type === 'career') {
        await prisma.careerSubmission.deleteMany({ where: { status } });
      } else {
        await prisma.quoteSubmission.deleteMany({ where: { status } });
      }
    } else {
      return NextResponse.json({ error: 'Provide id or status' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
