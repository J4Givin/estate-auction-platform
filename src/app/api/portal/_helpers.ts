import { NextResponse } from 'next/server'

import {
  authorize,
  getActorContext,
  type ActorContext,
  type AuthzDecision,
} from '@/lib/data/auth'

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonErr(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function readJsonBody<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

/**
 * Resolve actor context for a portal API route.
 * In demo mode, falls back gracefully so seed flows work.
 */
export async function resolveActor(): Promise<ActorContext> {
  return getActorContext()
}

/**
 * Reject a request with the right HTTP code and a clean JSON envelope.
 * Use this in route handlers to surface 401/403 to clients without leaking
 * RLS error strings.
 */
export function rejectAuthz(decision: Extract<AuthzDecision, { ok: false }>) {
  return NextResponse.json(
    {
      ok: false,
      mode: decision.ctx.mode,
      error: decision.reason,
      authenticated: decision.ctx.authenticated,
    },
    { status: decision.status },
  )
}

export { authorize }
