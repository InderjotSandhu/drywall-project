import { NextResponse } from 'next/server';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { list, del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { isBlobConfigured } from '@/lib/media';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const uploadsDir = join(process.cwd(), 'public', 'uploads');

function scanLocalFiles(dir: string, prefix: string): { name: string; url: string; size: number; modified: string }[] {
  const results: { name: string; url: string; size: number; modified: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanLocalFiles(fullPath, join(prefix, entry)));
    } else {
      results.push({
        name: entry,
        url: `/uploads/${join(prefix, entry).replace(/\\/g, '/')}`,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      });
    }
  }
  return results;
}

async function scanBlobFiles(): Promise<{ name: string; url: string; size: number; modified: string }[]> {
  const { blobs } = await list({ prefix: 'uploads/' });
  return blobs.map(b => ({
    name: b.pathname.replace(/^uploads[/\\]/, ''),
    url: b.url,
    size: b.size,
    modified: b.uploadedAt.toISOString(),
  }));
}

export async function GET() {
  try {
    const [projects, projectImages, projectVideos] = await Promise.all([
      prisma.project.findMany({ select: { id: true, title: true, image: true } }),
      prisma.projectImage.findMany({ select: { url: true, project: { select: { title: true } } } }),
      prisma.projectVideo.findMany({ select: { url: true, project: { select: { title: true } } } }),
    ]);

    const rawFiles = isBlobConfigured()
      ? await scanBlobFiles()
      : scanLocalFiles(uploadsDir, '');

    const files = rawFiles.map(f => {
      const usedIn: string[] = [];
      for (const p of projects) {
        if (p.image && (p.image.endsWith(f.name) || p.image === f.url)) {
          usedIn.push(p.title);
        }
      }
      for (const pi of projectImages) {
        if (pi.url.endsWith(f.name) || pi.url === f.url) {
          if (!usedIn.includes(pi.project.title)) usedIn.push(pi.project.title);
        }
      }
      for (const pv of projectVideos) {
        if (pv.url.endsWith(f.name) || pv.url === f.url) {
          if (!usedIn.includes(pv.project.title)) usedIn.push(pv.project.title);
        }
      }
      return { ...f, usedIn };
    }).sort((a, b) => b.modified.localeCompare(a.modified));

    return NextResponse.json({ success: true, data: files });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || searchParams.get('url');
  if (!name) {
    return NextResponse.json({ success: false, error: 'Name or URL required' }, { status: 400 });
  }

  try {
    if (name.startsWith('http')) {
      if (isBlobConfigured()) {
        await del(name);
      }
    } else {
      unlinkSync(join(uploadsDir, name));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting file', error as Error);
    return handleApiError(error);
  }
}
