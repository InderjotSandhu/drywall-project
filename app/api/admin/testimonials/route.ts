import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        quote: body.quote,
        order: typeof body.order === 'number' ? body.order : 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
