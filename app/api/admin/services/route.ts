import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    include: { tags: { orderBy: { order: 'asc' } }, features: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id, title, description, detail, order, isActive, tags, features } = body;

    const service = await prisma.service.create({
      data: {
        id: id || title.toLowerCase().replace(/\s+/g, '-'),
        title, description, detail,
        order: typeof order === 'number' ? order : 0,
        isActive: isActive !== false,
        tags: tags?.length
          ? { create: tags.map((t: string, i: number) => ({ label: t, order: i })) }
          : undefined,
        features: features?.length
          ? { create: features.map((f: { title: string; description: string }, i: number) => ({ ...f, order: i })) }
          : undefined,
      },
      include: { tags: true, features: true },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
