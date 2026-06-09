import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await withDbRetry(() => prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        stats: { orderBy: { order: 'asc' } },
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

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}