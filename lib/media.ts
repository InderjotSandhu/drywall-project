import { put, del } from '@vercel/blob';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export function isImageType(mime: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mime);
}

export function isVideoType(mime: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(mime);
}

export function isAllowedFileType(mime: string): boolean {
  return isImageType(mime) || isVideoType(mime);
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'bin';
}

export function generateFilename(original: string): string {
  const ext = getFileExtension(original);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

export async function uploadFile(
  file: File,
  folder: string = 'uploads',
): Promise<{ url: string; filename: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024} MB`);
  }

  if (!isAllowedFileType(file.type)) {
    throw new Error(`File type "${file.type}" is not supported`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = generateFilename(file.name);

  if (isBlobConfigured()) {
    const { url } = await put(`${folder}/${filename}`, buffer, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });
    return { url, filename };
  }

  const localPath = path.join(process.cwd(), 'public', folder, filename);
  await mkdir(path.dirname(localPath), { recursive: true });
  await writeFile(localPath, buffer);
  return { url: `/${folder}/${filename}`, filename };
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  if (url.startsWith('http')) {
    if (isBlobConfigured()) {
      await del(url);
    }
    return;
  }

  const filePath = path.join(process.cwd(), 'public', url);
  try {
    await unlink(filePath);
  } catch {
    // File may not exist locally — ignore
  }
}
