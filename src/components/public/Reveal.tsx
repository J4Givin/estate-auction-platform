import type { ReactNode } from 'react'

/**
 * Pass-through wrapper. Previously animated entrance via IntersectionObserver,
 * but a missed observation could leave entire sections invisible on real
 * browsers and on screenshot capture. The animation is purely cosmetic and
 * not worth the correctness risk on a landing page.
 *
 * Kept as a component so existing call sites (and the `delay` / `className`
 * props) work unchanged. If we later want a fade-up, do it with a CSS-only
 * approach scoped to elements that are guaranteed to be in the initial
 * viewport.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  if (!className) return <>{children}</>
  return <div className={className}>{children}</div>
}
