import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { tags: { orderBy: { order: 'asc' } }, features: { orderBy: { order: 'asc' } } },
  });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, detail, order, isActive, id: newId } = body;

    const data: Record<string, unknown> = { title, description, detail };
    if (typeof order === 'number') data.order = order;
    if (typeof isActive === 'boolean') data.isActive = isActive;
    if (newId && newId !== id) data.id = newId;

    if (body.tags) {
      await prisma.serviceTag.deleteMany({ where: { serviceId: id } });
      data.tags = { create: body.tags.map((t: string, i: number) => ({ label: t, order: i })) };
    }
    if (body.features) {
      await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
      data.features = { create: body.features.map((f: { title: string; description: string }, i: number) => ({ ...f, order: i })) };
    }

    await prisma.service.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
