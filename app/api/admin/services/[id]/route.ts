import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const updateServiceSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().min(1).max(10000).optional(),
  detail: z.string().min(1).max(10000).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  id: z.string().max(200).optional(),
  tags: z.array(z.string().max(200)).optional(),
  features: z.array(z.object({
    title: z.string().min(1).max(300),
    description: z.string().min(1).max(5000),
  })).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: { tags: { orderBy: { order: 'asc' } }, features: { orderBy: { order: 'asc' } } },
    });
    if (!service) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    logger.error('Error fetching service', error as Error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateServiceSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.detail !== undefined) updateData.detail = data.detail;
      if (data.order !== undefined) updateData.order = data.order;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.id && data.id !== id) updateData.id = data.id;

      if (data.tags !== undefined) {
        await tx.serviceTag.deleteMany({ where: { serviceId: id } });
        updateData.tags = { create: data.tags.map((t, i) => ({ label: t, order: i })) };
      }
      if (data.features !== undefined) {
        await tx.serviceFeature.deleteMany({ where: { serviceId: id } });
        updateData.features = { create: data.features.map((f, i) => ({ title: f.title, description: f.description, order: i })) };
      }

      await tx.service.update({ where: { id }, data: updateData });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error updating service', error as Error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting service', error as Error);
    return handleApiError(error);
  }
}
