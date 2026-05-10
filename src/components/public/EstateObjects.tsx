/**
 * EstateObjects — premium SVG silhouettes for the landing-page item gallery.
 *
 * Each object is rendered on a transparent background with a soft drop
 * shadow applied at the card level. Strokes use a single warm-graphite
 * tone with a brass accent so the set reads as a calm catalog rather than
 * generic stock imagery. Designed for crisp scaling across mobile and
 * desktop breakpoints.
 */
import type { SVGProps } from 'react'

const STROKE = '#3A3530'
const BRASS = '#9A7A3C'
const SOFT = '#968F82'

type ObjectProps = SVGProps<SVGSVGElement> & { title?: string }

function Frame({ title, children, ...rest }: ObjectProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      role="img"
      aria-label={title}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function WatchObject(props: ObjectProps) {
  return (
    <Frame title="Vintage gold watch" {...props}>
      {/* lugs */}
      <path d="M44 30 L44 22 L76 22 L76 30" stroke={STROKE} strokeWidth="1.4" />
      <path d="M44 90 L44 98 L76 98 L76 90" stroke={STROKE} strokeWidth="1.4" />
      {/* case */}
      <circle cx="60" cy="60" r="30" stroke={STROKE} strokeWidth="1.6" />
      <circle cx="60" cy="60" r="26" stroke={SOFT} strokeWidth="0.8" />
      {/* dial markers */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 60 + Math.cos(rad) * 22
        const y1 = 60 + Math.sin(rad) * 22
        const x2 = 60 + Math.cos(rad) * 25
        const y2 = 60 + Math.sin(rad) * 25
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth="1.2" />
      })}
      {/* hands */}
      <line x1="60" y1="60" x2="60" y2="44" stroke={BRASS} strokeWidth="1.6" />
      <line x1="60" y1="60" x2="72" y2="60" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="60" cy="60" r="1.4" fill={BRASS} />
      {/* crown */}
      <rect x="89" y="56" width="4" height="8" stroke={STROKE} strokeWidth="1.2" />
    </Frame>
  )
}

export function RingObject(props: ObjectProps) {
  return (
    <Frame title="Heirloom diamond ring" {...props}>
      {/* band */}
      <ellipse cx="60" cy="78" rx="30" ry="10" stroke={STROKE} strokeWidth="1.5" />
      <ellipse cx="60" cy="78" rx="30" ry="10" stroke={SOFT} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />
      {/* prongs */}
      <line x1="50" y1="56" x2="46" y2="42" stroke={STROKE} strokeWidth="1.3" />
      <line x1="60" y1="52" x2="60" y2="36" stroke={STROKE} strokeWidth="1.3" />
      <line x1="70" y1="56" x2="74" y2="42" stroke={STROKE} strokeWidth="1.3" />
      {/* stone */}
      <path d="M46 42 L60 26 L74 42 L60 56 Z" stroke={STROKE} strokeWidth="1.5" fill="rgba(154,122,60,0.06)" />
      <path d="M46 42 L74 42" stroke={BRASS} strokeWidth="1.1" />
      <path d="M52 42 L60 26 M68 42 L60 26 M52 42 L60 56 M68 42 L60 56" stroke={SOFT} strokeWidth="0.8" />
    </Frame>
  )
}

export function ArtObject(props: ObjectProps) {
  return (
    <Frame title="Signed fine-art print" {...props}>
      {/* outer frame */}
      <rect x="22" y="20" width="76" height="80" rx="2" stroke={STROKE} strokeWidth="1.6" />
      {/* inner mat */}
      <rect x="30" y="28" width="60" height="64" stroke={SOFT} strokeWidth="0.8" />
      {/* horizon / artwork */}
      <line x1="34" y1="68" x2="86" y2="68" stroke={STROKE} strokeWidth="1.1" />
      {/* mountain */}
      <path d="M34 68 L46 50 L56 60 L66 44 L78 58 L86 50 L86 68 Z" fill="rgba(154,122,60,0.08)" stroke={STROKE} strokeWidth="1.2" />
      {/* sun */}
      <circle cx="74" cy="40" r="3" fill={BRASS} stroke={BRASS} />
      {/* signature */}
      <path d="M36 86 q3 -2 6 0 t6 0" stroke={STROKE} strokeWidth="0.9" />
    </Frame>
  )
}

export function ChairObject(props: ObjectProps) {
  return (
    <Frame title="Mid-century lounge chair" {...props}>
      {/* back */}
      <path d="M34 28 Q34 22 42 22 L70 22 Q86 22 86 38 L86 64 Q86 70 80 70 L42 70 Q34 70 34 64 Z"
            stroke={STROKE} strokeWidth="1.5" fill="rgba(154,122,60,0.04)" />
      {/* seat cushion line */}
      <path d="M34 56 Q60 60 86 56" stroke={SOFT} strokeWidth="0.9" />
      {/* seat front */}
      <path d="M30 70 L90 70 L86 80 L34 80 Z" stroke={STROKE} strokeWidth="1.4" fill="rgba(154,122,60,0.06)" />
      {/* legs */}
      <line x1="38" y1="80" x2="34" y2="100" stroke={STROKE} strokeWidth="1.4" />
      <line x1="82" y1="80" x2="86" y2="100" stroke={STROKE} strokeWidth="1.4" />
      <line x1="60" y1="80" x2="60" y2="98" stroke={SOFT} strokeWidth="1" />
      {/* brass tack */}
      <circle cx="60" cy="56" r="1.4" fill={BRASS} />
    </Frame>
  )
}

export function SilverObject(props: ObjectProps) {
  return (
    <Frame title="Sterling silver tea service" {...props}>
      {/* base shadow line */}
      <ellipse cx="60" cy="98" rx="36" ry="3" stroke={SOFT} strokeWidth="0.7" />
      {/* body */}
      <path d="M36 88 Q34 64 44 50 Q44 38 60 36 Q76 38 76 50 Q86 64 84 88 Q84 94 60 94 Q36 94 36 88 Z"
            stroke={STROKE} strokeWidth="1.5" fill="rgba(154,122,60,0.05)" />
      {/* lid */}
      <path d="M50 36 Q60 26 70 36" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="60" cy="28" r="2.4" fill={BRASS} stroke={BRASS} />
      {/* spout */}
      <path d="M36 56 Q24 52 26 44" stroke={STROKE} strokeWidth="1.4" />
      {/* handle */}
      <path d="M84 56 Q98 60 92 76" stroke={STROKE} strokeWidth="1.4" />
      {/* hallmark band */}
      <line x1="42" y1="76" x2="78" y2="76" stroke={SOFT} strokeWidth="0.8" />
    </Frame>
  )
}

export function VaseObject(props: ObjectProps) {
  return (
    <Frame title="Antique porcelain vase" {...props}>
      {/* shadow */}
      <ellipse cx="60" cy="106" rx="20" ry="2" stroke={SOFT} strokeWidth="0.7" />
      {/* body */}
      <path d="M50 22 L70 22 L70 30 Q86 44 78 70 Q70 94 70 100 L50 100 Q50 94 42 70 Q34 44 50 30 Z"
            stroke={STROKE} strokeWidth="1.5" fill="rgba(154,122,60,0.05)" />
      {/* lip detail */}
      <line x1="50" y1="26" x2="70" y2="26" stroke={SOFT} strokeWidth="0.8" />
      {/* decoration */}
      <path d="M46 56 Q52 62 58 56 Q64 50 70 56 Q76 62 78 58" stroke={BRASS} strokeWidth="0.9" />
      <circle cx="52" cy="74" r="1.2" fill={BRASS} />
      <circle cx="60" cy="78" r="1.2" fill={BRASS} />
      <circle cx="68" cy="74" r="1.2" fill={BRASS} />
    </Frame>
  )
}

export const ESTATE_OBJECTS = [
  {
    key: 'watch',
    name: 'Vintage timepieces',
    note: 'Reference, movement, service history.',
    Component: WatchObject,
  },
  {
    key: 'ring',
    name: 'Fine jewelry',
    note: 'Metal, stone, hallmark, lab review.',
    Component: RingObject,
  },
  {
    key: 'art',
    name: 'Art & prints',
    note: 'Attribution, edition, provenance.',
    Component: ArtObject,
  },
  {
    key: 'chair',
    name: 'Designer furniture',
    note: 'Maker, period, condition.',
    Component: ChairObject,
  },
  {
    key: 'silver',
    name: 'Silver & service',
    note: 'Hallmark, weight, completeness.',
    Component: SilverObject,
  },
  {
    key: 'vase',
    name: 'Porcelain & ceramics',
    note: 'Mark, period, restoration notes.',
    Component: VaseObject,
  },
] as const
