import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const createServiceSchema = z.object({
  id: z.string().max(200).optional(),
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().min(1, 'Description is required').max(10000),
  detail: z.string().min(1, 'Detail is required').max(10000),
  order: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  tags: z.array(z.string().max(200)).optional(),
  features: z.array(z.object({
    title: z.string().min(1).max(300),
    description: z.string().min(1).max(5000),
  })).optional(),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { tags: { orderBy: { order: 'asc' } }, features: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    logger.error('Error fetching services', error as Error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createServiceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        id: data.id || data.title.toLowerCase().replace(/\s+/g, '-'),
        title: data.title,
        description: data.description,
        detail: data.detail,
        order: data.order,
        isActive: data.isActive,
        tags: data.tags?.length
          ? { create: data.tags.map((t, i) => ({ label: t, order: i })) }
          : undefined,
        features: data.features?.length
          ? { create: data.features.map((f, i) => ({ title: f.title, description: f.description, order: i })) }
          : undefined,
      },
      include: { tags: true, features: true },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error creating service', error as Error);
    return handleApiError(error);
  }
}
