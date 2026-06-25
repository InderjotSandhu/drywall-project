import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 300;

const cacheHeaders = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

export async function GET() {
  try {
    const projectCount = await prisma.project.count({ where: { isActive: true } });

    const stats = [
      { count: 15, suffix: '+', label: 'Years Experience' },
      { count: projectCount, suffix: '+', label: 'Projects Completed' },
      { count: 98, suffix: '%', label: 'Client Satisfaction' },
      { count: 12, suffix: '',  label: 'Trade Awards Won' },
    ];

    return NextResponse.json({ success: true, data: stats }, { headers: cacheHeaders });
  } catch (error) {
    logger.error('Error fetching stats', error as Error);
    return handleApiError(error);
  }
}
