/**
 * Lightweight client-side helpers for portal write actions.
 *
 * - `newIdempotencyKey()`: generates a per-click UUID that the UI attaches
 *   to write requests as the `Idempotency-Key` header. The same key on the
 *   wire means the same logical action; the server replays the cached
 *   response on duplicates. Must be created at the moment of action (e.g.
 *   inside an `onClick` handler) so retries from a single user intent
 *   share a key, but distinct user clicks do not.
 *
 * - `portalWrite()`: thin `fetch` wrapper that always sends JSON and the
 *   `Idempotency-Key` header. Returns the parsed body and HTTP status so
 *   callers can react to 409 replays/conflicts.
 *
 * IMPORTANT — by spec, this module MUST NOT use `localStorage`,
 * `sessionStorage`, `indexedDB`, or cookies. Idempotency keys are
 * ephemeral, generated per click, and live only in component state/refs.
 */

export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for very old browsers — still sufficient entropy for our use.
  const rnd = () => Math.random().toString(16).slice(2).padStart(13, '0')
  return `${rnd()}-${rnd().slice(0, 4)}-4${rnd().slice(0, 3)}-a${rnd().slice(0, 3)}-${rnd()}${rnd().slice(0, 4)}`
}

export interface PortalWriteResult<T = unknown> {
  ok: boolean
  status: number
  data: T | null
  replayed: boolean
}

export async function portalWrite<T = unknown>(
  path: string,
  body: unknown,
  opts: { idempotencyKey: string; signal?: AbortSignal } = { idempotencyKey: newIdempotencyKey() },
): Promise<PortalWriteResult<T>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': opts.idempotencyKey,
    },
    body: JSON.stringify(body),
    signal: opts.signal,
  })
  let data: T | null = null
  try {
    data = (await res.json()) as T
  } catch {
    /* ignore — empty body */
  }
  return {
    ok: res.ok,
    status: res.status,
    data,
    replayed: res.headers.get('idempotent-replay') === 'true',
  }
}
