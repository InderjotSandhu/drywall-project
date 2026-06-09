import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await withDbRetry(() => prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        tags: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
      },
    }));

    const formatted = services.map((s) => ({
      id: s.id,
      title: s.title,
      desc: s.description,
      detail: s.detail,
      tags: s.tags.map((t) => t.label),
      features: s.features.map((f) => ({ title: f.title, desc: f.description })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}