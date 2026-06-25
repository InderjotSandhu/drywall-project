import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const updateCollaborationSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  logo: z.string().min(1).max(2000).optional(),
  description: z.string().max(1000).optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const collaboration = await prisma.collaboration.findUnique({ where: { id: Number(id) } });
    if (!collaboration) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: collaboration });
  } catch (error) {
    logger.error('Error fetching collaboration', error as Error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateCollaborationSchema.parse(body);

    const collaboration = await prisma.collaboration.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ success: true, data: collaboration });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error updating collaboration', error as Error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.collaboration.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting collaboration', error as Error);
    return handleApiError(error);
  }
}
