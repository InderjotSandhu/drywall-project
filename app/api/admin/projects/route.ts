import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const projectStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().optional().nullable(),
  image: z.string().min(1, 'Image is required'),
  imageAlt: z.string().optional().nullable(),
  order: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  stats: z.array(projectStatSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location || null,
        image: data.image,
        imageAlt: data.imageAlt || null,
        order: data.order,
        isActive: data.isActive,
        stats: data.stats?.length
          ? { create: data.stats.map((s, i) => ({ label: s.label, value: s.value, order: i })) }
          : undefined,
      },
      include: { stats: true },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error creating project', error as Error);
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { images: true, videos: true, stats: true },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    logger.error('Error fetching projects', error as Error);
    return handleApiError(error);
  }
}
