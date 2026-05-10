/**
 * Unit tests for middleware path-gating logic.
 *
 * Internal consoles (/admin, /ops, /qa) and authed-user surfaces must
 * match the protected-path predicate exactly — no false positives on
 * lookalike public paths like /administrators or /operations.
 */

import { describe, expect, it } from 'vitest'

import {
  AUTHED_PATHS,
  INTERNAL_CONSOLE_PATHS,
  matchesPath,
} from '@/lib/supabase/middleware'

describe('INTERNAL_CONSOLE_PATHS', () => {
  it('covers admin, ops, and qa', () => {
    expect([...INTERNAL_CONSOLE_PATHS].sort()).toEqual(['/admin', '/ops', '/qa'])
  })
})

describe('matchesPath', () => {
  it('matches exact internal-console roots', () => {
    for (const p of INTERNAL_CONSOLE_PATHS) {
      expect(matchesPath(p, INTERNAL_CONSOLE_PATHS)).toBe(true)
    }
  })

  it('matches nested internal-console paths', () => {
    expect(matchesPath('/ops/command', INTERNAL_CONSOLE_PATHS)).toBe(true)
    expect(matchesPath('/ops/insights/foo', INTERNAL_CONSOLE_PATHS)).toBe(true)
    expect(matchesPath('/qa/items/ITM-1', INTERNAL_CONSOLE_PATHS)).toBe(true)
    expect(matchesPath('/admin/users', INTERNAL_CONSOLE_PATHS)).toBe(true)
  })

  it('does not match lookalike public paths', () => {
    expect(matchesPath('/administrators', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/operations', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/quality', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/qaa', INTERNAL_CONSOLE_PATHS)).toBe(false)
  })

  it('does not match unrelated public paths', () => {
    expect(matchesPath('/', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/portal', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/partner', INTERNAL_CONSOLE_PATHS)).toBe(false)
    expect(matchesPath('/auth/login', INTERNAL_CONSOLE_PATHS)).toBe(false)
  })

  it('matches authed-user surfaces', () => {
    for (const p of AUTHED_PATHS) {
      expect(matchesPath(p, AUTHED_PATHS)).toBe(true)
      expect(matchesPath(`${p}/nested`, AUTHED_PATHS)).toBe(true)
    }
  })

  it('keeps internal-console and authed sets disjoint', () => {
    for (const p of INTERNAL_CONSOLE_PATHS) {
      expect(matchesPath(p, AUTHED_PATHS)).toBe(false)
    }
    for (const p of AUTHED_PATHS) {
      expect(matchesPath(p, INTERNAL_CONSOLE_PATHS)).toBe(false)
    }
  })
})
