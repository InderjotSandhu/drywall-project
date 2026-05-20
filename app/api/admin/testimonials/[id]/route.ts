import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id: Number(id) } });
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const testimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        quote: body.quote,
        order: typeof body.order === 'number' ? body.order : 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
