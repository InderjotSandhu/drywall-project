import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        stats: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formatted = {
      id: project.id,
      image: project.image,
      imageAlt: project.imageAlt ?? undefined,
      images: project.images.map((img) => img.url),
      videos: project.videos.map((vid) => vid.url),
      category: project.category,
      title: project.title,
      location: project.location ?? undefined,
      description: project.description,
      stats: project.stats.map((s) => ({ label: s.label, value: s.value })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
