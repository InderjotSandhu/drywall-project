import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const associateSchema = z.object({
  projectId: z.union([z.string(), z.number()]).transform(Number),
  url: z.string().url('Valid URL is required'),
  type: z.enum(['image', 'video']).optional().default('image'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = associateSchema.parse(body);

    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const nextOrder = data.type === 'video'
      ? (await prisma.projectVideo.findFirst({ where: { projectId: data.projectId }, orderBy: { order: 'desc' } }))?.order ?? 0
      : (await prisma.projectImage.findFirst({ where: { projectId: data.projectId }, orderBy: { order: 'desc' } }))?.order ?? 0;

    if (data.type === 'video') {
      await prisma.projectVideo.create({
        data: { url: data.url, projectId: data.projectId, order: nextOrder + 1 },
      });
    } else {
      await prisma.projectImage.create({
        data: { url: data.url, projectId: data.projectId, order: nextOrder + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error associating media', error as Error);
    return handleApiError(error);
  }
}
