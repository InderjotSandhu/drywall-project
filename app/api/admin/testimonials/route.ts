import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quote: z.string().min(1, 'Quote is required'),
  order: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    logger.error('Error fetching testimonials', error as Error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createTestimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({ data });

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error creating testimonial', error as Error);
    return handleApiError(error);
  }
}
