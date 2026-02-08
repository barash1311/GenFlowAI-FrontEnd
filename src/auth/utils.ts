/**
 * Extract JWT from login/register response. Handles common backend shapes.
 */

export function getTokenFromResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const raw =
    d.token ??
    d.accessToken ??
    d.jwt ??
    d.access_token ??
    (d as Record<string, unknown>).token;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Store raw token only (no "Bearer " prefix)
  return trimmed.startsWith('Bearer ') ? trimmed.slice(7) : trimmed;
}

export function getUserFromResponse(data: unknown): { id: number; email: string; name?: string; role: string } | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const user = d.user ?? d.userResponse;
  if (!user || typeof user !== 'object') return null;
  const u = user as Record<string, unknown>;
  const id = u.id;
  const email = u.email;
  if (id == null || typeof email !== 'string') return null;
  const role = (u.role as string) ?? 'USER';
  return {
    id: Number(id),
    email,
    name: typeof u.name === 'string' ? u.name : undefined,
    role: role === 'ADMIN' ? 'ADMIN' : 'USER',
  };
}
