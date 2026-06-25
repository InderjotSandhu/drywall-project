import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 120;

export async function GET() {
  try {
    const testimonials = await withDbRetry(() => prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }));

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    logger.error('Error fetching testimonials', error as Error);
    return handleApiError(error);
  }
}
