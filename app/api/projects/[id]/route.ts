import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 60;

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        location: true,
        image: true,
        imageAlt: true,
        images: { orderBy: { order: 'asc' }, select: { url: true } },
        videos: { orderBy: { order: 'asc' }, select: { url: true } },
        stats: { orderBy: { order: 'asc' }, select: { label: true, value: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
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

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    logger.error('Error fetching project', error as Error);
    return handleApiError(error);
  }
}
