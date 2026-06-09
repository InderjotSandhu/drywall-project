import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await withDbRetry(() => prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
