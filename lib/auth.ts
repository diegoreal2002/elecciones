import crypto from 'crypto';

export function generateVoterHash(ip: string, deviceFingerprint: string): string {
  const combined = `${ip}:${deviceFingerprint}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export function generateDeviceFingerprint(userAgent: string): string {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
}
