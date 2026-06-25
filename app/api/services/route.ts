import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 120;

export async function GET() {
  try {
    const services = await withDbRetry(() => prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        detail: true,
        tags: { orderBy: { order: 'asc' }, select: { label: true } },
        features: { orderBy: { order: 'asc' }, select: { title: true, description: true } },
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

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    logger.error('Error fetching services', error as Error);
    return handleApiError(error);
  }
}
