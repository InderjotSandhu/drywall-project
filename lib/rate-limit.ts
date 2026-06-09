const loginLimits = new Map<string, { count: number; resetAt: number }>();
const formLimits = new Map<string, { count: number; resetAt: number }>();

const LOGIN_MAX = 5;
const LOGIN_WINDOW = 15 * 60 * 1000; // 15 min
const FORM_MAX = 3;
const FORM_WINDOW = 60 * 60 * 1000; // 1 hour

function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function checkMap(map: Map<string, { count: number; resetAt: number }>, key: string, max: number, window: number) {
  const now = Date.now();
  const existing = map.get(key);
  if (existing && now < existing.resetAt) {
    if (existing.count >= max) {
      return { allowed: false, remaining: 0, resetInMs: existing.resetAt - now };
    }
    existing.count++;
    return { allowed: true, remaining: max - existing.count, resetInMs: existing.resetAt - now };
  }
  map.set(key, { count: 1, resetAt: now + window });
  return { allowed: true, remaining: max - 1, resetInMs: window };
}

export function getClientIp(request: Request): string {
  return getIp(request);
}

export function checkLoginRateLimit(ip: string) {
  return checkMap(loginLimits, ip, LOGIN_MAX, LOGIN_WINDOW);
}

export function checkFormRateLimit(request: Request) {
  return checkMap(formLimits, getIp(request), FORM_MAX, FORM_WINDOW);
}
