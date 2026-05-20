import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, isAllowedFileType } from '@/lib/media';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF, MP4, MOV, AVI, WebM' },
        { status: 400 },
      );
    }

    const folder = file.type.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
    const { url, filename } = await uploadFile(file, folder);

    return NextResponse.json({ url, filename }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    const status = message.includes('exceeds maximum') || message.includes('not supported') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
