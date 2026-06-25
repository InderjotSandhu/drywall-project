import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 60;

const cacheHeaders = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' };

export async function GET() {
  try {
    const projects = await withDbRetry(() => prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
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
    }));

    const formatted = projects.map((p) => ({
      id: p.id,
      image: p.image,
      imageAlt: p.imageAlt ?? undefined,
      images: p.images.map((img) => img.url),
      videos: p.videos.map((vid) => vid.url),
      category: p.category,
      title: p.title,
      location: p.location ?? undefined,
      description: p.description,
      stats: p.stats.map((s) => ({ label: s.label, value: s.value })),
    }));

    return NextResponse.json({ success: true, data: formatted }, { headers: cacheHeaders });
  } catch (error) {
    logger.error('Error fetching projects', error as Error);
    return handleApiError(error);
  }
}
