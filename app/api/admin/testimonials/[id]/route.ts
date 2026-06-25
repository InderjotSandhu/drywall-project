import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const updateTestimonialSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  quote: z.string().min(1).max(5000).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id: Number(id) } });
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    logger.error('Error fetching testimonial', error as Error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateTestimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error updating testimonial', error as Error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting testimonial', error as Error);
    return handleApiError(error);
  }
}
