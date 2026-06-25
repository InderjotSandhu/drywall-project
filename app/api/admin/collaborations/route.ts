import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const createCollaborationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(300),
  logo: z.string().min(1, 'Logo URL is required').max(2000),
  description: z.string().max(1000).optional().nullable(),
  order: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const collaborations = await prisma.collaboration.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: collaborations });
  } catch (error) {
    logger.error('Error fetching collaborations', error as Error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createCollaborationSchema.parse(body);

    const collaboration = await prisma.collaboration.create({ data });

    return NextResponse.json({ success: true, data: collaboration }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error creating collaboration', error as Error);
    return handleApiError(error);
  }
}
