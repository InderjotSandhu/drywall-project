import { NextResponse } from 'next/server';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { requireAdminAPI } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const uploadsDir = join(process.cwd(), 'public', 'uploads');

function scanFiles(dir: string, prefix: string): { name: string; url: string; size: number; modified: string }[] {
  const results: { name: string; url: string; size: number; modified: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanFiles(fullPath, join(prefix, entry)));
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

export async function GET() {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  try {
    const [projects, projectImages, projectVideos] = await Promise.all([
      prisma.project.findMany({ select: { id: true, title: true, image: true } }),
      prisma.projectImage.findMany({ select: { url: true, project: { select: { title: true } } } }),
      prisma.projectVideo.findMany({ select: { url: true, project: { select: { title: true } } } }),
    ]);

    const files = scanFiles(uploadsDir, '').map(f => {
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

    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminAPI();
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  try {
    unlinkSync(join(uploadsDir, name));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
