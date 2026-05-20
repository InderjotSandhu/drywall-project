import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const body = await request.json();
    const { title, category, description, location, image, imageAlt, order, isActive, stats } = body;

    const project = await prisma.project.create({
      data: {
        title,
        category,
        description,
        location: location || null,
        image,
        imageAlt: imageAlt || null,
        order: typeof order === 'number' ? order : 0,
        isActive: isActive !== false,
        stats: stats?.length
          ? { create: stats.map((s: { label: string; value: string }, i: number) => ({ label: s.label, value: s.value, order: i })) }
          : undefined,
      },
      include: { stats: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { images: true, videos: true, stats: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
