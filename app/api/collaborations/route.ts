import { NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const collaborations = await withDbRetry(() => prisma.collaboration.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }));

    return NextResponse.json(collaborations);
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
  }
}