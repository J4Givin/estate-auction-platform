import { NextResponse } from 'next/server'

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
