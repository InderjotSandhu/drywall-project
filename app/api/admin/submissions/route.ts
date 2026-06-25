import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const patchSchema = z.object({
  id: z.number().optional(),
  type: z.enum(['quote', 'career']).optional(),
  status: z.string().optional(),
  markAllAsRead: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'quote';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

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
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    logger.error('Error fetching submissions', error as Error);
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const data = patchSchema.parse(body);

    if (data.markAllAsRead) {
      if (data.type === 'career') {
        await prisma.careerSubmission.updateMany({ where: { status: 'new' }, data: { status: 'read' } });
      } else {
        await prisma.quoteSubmission.updateMany({ where: { status: 'new' }, data: { status: 'read' } });
      }
    } else if (data.type === 'career') {
      await prisma.careerSubmission.update({ where: { id: Number(data.id) }, data: { status: data.status } });
    } else {
      await prisma.quoteSubmission.update({ where: { id: Number(data.id) }, data: { status: data.status } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error updating submission', error as Error);
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
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
      return NextResponse.json({ success: false, error: 'Provide id or status' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting submission', error as Error);
    return handleApiError(error);
  }
}
