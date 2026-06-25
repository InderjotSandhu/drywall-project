import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 300;

export async function GET() {
  try {
    const collaborations = await withDbRetry(() => prisma.collaboration.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }));

    return NextResponse.json({ success: true, data: collaborations });
  } catch (error) {
    logger.error('Error fetching collaborations', error as Error);
    return handleApiError(error);
  }
}
