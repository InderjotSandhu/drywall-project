import { NextResponse } from 'next/server';

export async function GET() {
  const missingVars: string[] = [];
  
  if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
  if (!process.env.DIRECT_URL) missingVars.push('DIRECT_URL');
  if (!process.env.AUTH_SECRET) missingVars.push('AUTH_SECRET');
  if (!process.env.ADMIN_PASSWORD) missingVars.push('ADMIN_PASSWORD');
  
  let dbStatus = 'unknown';
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = `error: ${(error as Error).message}`;
  }
  
  return NextResponse.json({
    status: missingVars.length === 0 && dbStatus === 'connected' ? 'healthy' : 'unhealthy',
    environment: {
      missingVariables: missingVars,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    },
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
