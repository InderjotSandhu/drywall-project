import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quote: z.string().min(10, 'Please write at least a few more words'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name.trim(),
        quote: data.quote.trim(),
        isActive: false,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Review submitted successfully! It will be visible after review.', id: testimonial.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: error.issues[0]?.message || 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error submitting testimonial', error as Error);
    return handleApiError(error);
  }
}
