import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const collaborations = await prisma.collaboration.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(collaborations);
}

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const body = await request.json();
    const { name, logo, description, order, isActive } = body;

    const collaboration = await prisma.collaboration.create({
      data: {
        name, logo,
        description: description || null,
        order: typeof order === 'number' ? order : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(collaboration, { status: 201 });
  } catch (error) {
    console.error('Error creating collaboration:', error);
    return NextResponse.json({ error: 'Failed to create collaboration' }, { status: 500 });
  }
}
