import 'dotenv/config';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.webm': 'video/webm',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const DIR_MAP: { baseDir: string; blobPrefix: string; urlPrefix: string }[] = [
  { baseDir: 'public/images',           blobPrefix: 'uploads/images',          urlPrefix: '/images' },
  { baseDir: 'public/videos',           blobPrefix: 'uploads/videos',          urlPrefix: '/videos' },
  { baseDir: 'public/collaborations',   blobPrefix: 'uploads/collaborations',  urlPrefix: '/collaborations' },
];

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

interface LocalFile {
  absolutePath: string;
  relativeUrl: string;   // e.g. "/images/Photos Ancaster/IMG_8378.jpeg"
  blobPath: string;      // e.g. "uploads/images/Photos Ancaster/IMG_8378.jpeg"
}

function collectLocalFiles(): LocalFile[] {
  const files: LocalFile[] = [];

  for (const { baseDir, blobPrefix, urlPrefix } of DIR_MAP) {
    const absDir = path.join(process.cwd(), baseDir);
    for (const absPath of walkFiles(absDir)) {
      const relDir = path.relative(absDir, path.dirname(absPath));
      const fileName = path.basename(absPath);
      const subPath = relDir ? `${relDir.replace(/\\/g, '/')}/${fileName}` : fileName;
      const relativeUrl = `${urlPrefix}/${subPath}`;
      const blobPath = `${blobPrefix}/${subPath}`;
      files.push({ absolutePath: absPath, relativeUrl, blobPath });
    }
  }

  return files;
}

async function uploadToBlob(
  filePath: string,
  blobPath: string,
): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_MAP[ext] || 'application/octet-stream';

  const { url } = await put(blobPath, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return url;
}

async function main() {
  console.log('=== Local → Vercel Blob Migration ===\n');

  // ── Collect local files ──────────────────────────────
  const localFiles = collectLocalFiles();
  console.log(`Found ${localFiles.length} local files to migrate:\n`);
  for (const f of localFiles) {
    console.log(`  ${f.relativeUrl}`);
  }

  if (localFiles.length === 0) {
    console.log('No local files found — nothing to migrate.');
    return;
  }

  // ── Upload all files to Blob ─────────────────────────
  console.log('\n── Uploading to Vercel Blob ──\n');

  const urlMap = new Map<string, string>();

  for (const file of localFiles) {
    process.stdout.write(`  ${file.relativeUrl} … `);

    try {
      const blobUrl = await uploadToBlob(file.absolutePath, file.blobPath);
      urlMap.set(file.relativeUrl, blobUrl);
      console.log(`✓`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗  ${msg}`);
    }
  }

  console.log(`\nUploaded ${urlMap.size}/${localFiles.length} files to Blob\n`);

  if (urlMap.size === 0) {
    console.log('No files uploaded — aborting DB update.');
    return;
  }

  // ── Update DB records ────────────────────────────────
  console.log('── Updating database records ──\n');

  const resolve = (dbUrl: string): string | null => {
    // DB stores paths like "/images/Photos Ancaster/IMG_8378.jpeg"
    // urlMap keys are "/images/Photos Ancaster/IMG_8378.jpeg"
    return urlMap.get(dbUrl) ?? null;
  };

  // Projects
  const projects = await prisma.project.findMany();
  let projUpdated = 0;
  for (const p of projects) {
    if (p.image && !p.image.startsWith('http')) {
      const blobUrl = resolve(p.image);
      if (blobUrl) {
        await prisma.project.update({ where: { id: p.id }, data: { image: blobUrl } });
        projUpdated++;
        console.log(`  Project "${p.title}" image  ✓`);
      }
    }
  }
  console.log(`  → ${projUpdated} projects updated`);

  // ProjectImages
  const projectImages = await prisma.projectImage.findMany();
  let piUpdated = 0;
  for (const img of projectImages) {
    if (img.url && !img.url.startsWith('http')) {
      const blobUrl = resolve(img.url);
      if (blobUrl) {
        await prisma.projectImage.update({ where: { id: img.id }, data: { url: blobUrl } });
        piUpdated++;
      }
    }
  }
  console.log(`  → ${piUpdated} project images updated`);

  // ProjectVideos
  const projectVideos = await prisma.projectVideo.findMany();
  let pvUpdated = 0;
  for (const vid of projectVideos) {
    if (vid.url && !vid.url.startsWith('http')) {
      const blobUrl = resolve(vid.url);
      if (blobUrl) {
        await prisma.projectVideo.update({ where: { id: vid.id }, data: { url: blobUrl } });
        pvUpdated++;
      }
    }
  }
  console.log(`  → ${pvUpdated} project videos updated`);

  // Collaborations
  const collaborations = await prisma.collaboration.findMany();
  let collabUpdated = 0;
  for (const c of collaborations) {
    if (c.logo && !c.logo.startsWith('http')) {
      const blobUrl = resolve(c.logo);
      if (blobUrl) {
        await prisma.collaboration.update({ where: { id: c.id }, data: { logo: blobUrl } });
        collabUpdated++;
        console.log(`  Collaboration "${c.name}" logo  ✓`);
      }
    }
  }
  console.log(`  → ${collabUpdated} collaborations updated`);

  console.log('\n✅ Migration complete!');
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
