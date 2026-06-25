import { NextResponse } from 'next/server';

const MAX_BODY_SIZE = 100_000; // 100 KB

export async function checkBodySize(request: Request): Promise<NextResponse | null> {
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json({ success: false, error: 'Request body too large' }, { status: 413 });
  }
  return null;
}
