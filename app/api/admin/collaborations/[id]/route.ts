import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const { id } = await params;
  const collaboration = await prisma.collaboration.findUnique({ where: { id: Number(id) } });
  if (!collaboration) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(collaboration);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const collaboration = await prisma.collaboration.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        logo: body.logo,
        description: body.description || null,
        order: typeof body.order === 'number' ? body.order : 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(collaboration);
  } catch (error) {
    console.error('Error updating collaboration:', error);
    return NextResponse.json({ error: 'Failed to update collaboration' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    await prisma.collaboration.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collaboration:', error);
    return NextResponse.json({ error: 'Failed to delete collaboration' }, { status: 500 });
  }
}
