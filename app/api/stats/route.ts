import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projectCount = await prisma.project.count({ where: { isActive: true } });

    const stats = [
      { count: 15, suffix: '+', label: 'Years Experience' },
      { count: projectCount, suffix: '+', label: 'Projects Completed' },
      { count: 98, suffix: '%', label: 'Client Satisfaction' },
      { count: 12, suffix: '',  label: 'Trade Awards Won' },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
