import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAPI } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const { projectId, url, type } = await request.json();
    if (!projectId || !url) {
      return NextResponse.json({ error: 'projectId and url required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const nextOrder = type === 'video'
      ? (await prisma.projectVideo.findFirst({ where: { projectId: Number(projectId) }, orderBy: { order: 'desc' } }))?.order ?? 0
      : (await prisma.projectImage.findFirst({ where: { projectId: Number(projectId) }, orderBy: { order: 'desc' } }))?.order ?? 0;

    if (type === 'video') {
      await prisma.projectVideo.create({
        data: { url, projectId: Number(projectId), order: nextOrder + 1 },
      });
    } else {
      await prisma.projectImage.create({
        data: { url, projectId: Number(projectId), order: nextOrder + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error associating media:', error);
    return NextResponse.json({ error: 'Failed to associate media' }, { status: 500 });
  }
}
