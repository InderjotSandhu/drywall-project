import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const projectStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().optional().nullable(),
  image: z.string().optional(),
  imageAlt: z.string().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  stats: z.array(projectStatSchema).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { stats: { orderBy: { order: 'asc' } } },
    });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    logger.error('Error fetching project', error as Error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateProjectSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: Number(id) },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.location !== undefined && { location: data.location || null }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.imageAlt !== undefined && { imageAlt: data.imageAlt || null }),
          ...(data.order !== undefined && { order: data.order }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      if (data.stats !== undefined) {
        await tx.projectStat.deleteMany({ where: { projectId: project.id } });
        if (data.stats.length > 0) {
          await tx.projectStat.createMany({
            data: data.stats.map((s, i) => ({
              label: s.label, value: s.value, order: i, projectId: project.id,
            })),
          });
        }
      }

      return tx.project.findUnique({
        where: { id: project.id },
        include: { stats: true },
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error updating project', error as Error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting project', error as Error);
    return handleApiError(error);
  }
}
