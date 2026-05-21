import { cookies } from 'next/headers';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; resetInMs: number }> {
  const now = Date.now();
  
  try {
    const cookieStore = await cookies();
    const rateLimitCookie = cookieStore.get('rate_limit_' + ip.replace(/[^a-zA-Z0-9]/g, '_'));
    
    if (rateLimitCookie) {
      const data = JSON.parse(rateLimitCookie.value);
      if (now < data.resetAt) {
        if (data.count >= MAX_ATTEMPTS) {
          return { allowed: false, remaining: 0, resetInMs: data.resetAt - now };
        }
        data.count++;
        cookieStore.set('rate_limit_' + ip.replace(/[^a-zA-Z0-9]/g, '_'), JSON.stringify(data), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: Math.ceil((data.resetAt - now) / 1000),
        });
        return { allowed: true, remaining: MAX_ATTEMPTS - data.count, resetInMs: data.resetAt - now };
      }
    }
    
    const newData = { count: 1, resetAt: now + WINDOW_MS };
    cookieStore.set('rate_limit_' + ip.replace(/[^a-zA-Z0-9]/g, '_'), JSON.stringify(newData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.ceil(WINDOW_MS / 1000),
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetInMs: WINDOW_MS };
  } catch {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetInMs: WINDOW_MS };
  }
}
