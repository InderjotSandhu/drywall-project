import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, isAllowedFileType } from '@/lib/media';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF, MP4, MOV, AVI, WebM' },
        { status: 400 },
      );
    }

    const folder = file.type.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
    const { url, filename } = await uploadFile(file, folder);

    logger.info('File uploaded', { filename, folder, size: file.size });
    return NextResponse.json({ success: true, url, filename }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    if (message.includes('exceeds maximum') || message.includes('not supported')) {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    logger.error('Upload failed', error as Error);
    return handleApiError(error);
  }
}
