import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { stats: { orderBy: { order: 'asc' } } },
    });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, description, location, image, imageAlt, order, isActive, stats } = body;

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        category,
        description,
        location: location || null,
        image,
        imageAlt: imageAlt || null,
        order: typeof order === 'number' ? order : 0,
        isActive: isActive !== false,
      },
    });

    if (stats) {
      await prisma.projectStat.deleteMany({ where: { projectId: project.id } });
      if (stats.length > 0) {
        await prisma.projectStat.createMany({
          data: stats.map((s: { label: string; value: string }, i: number) => ({
            label: s.label, value: s.value, order: i, projectId: project.id,
          })),
        });
      }
    }

    const updated = await prisma.project.findUnique({
      where: { id: project.id },
      include: { stats: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
