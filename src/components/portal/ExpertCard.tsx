'use client'

import { Expert } from '@/lib/sample-data'

const STATE_DOT: Record<string, string> = {
  available: '#0E9F6E',
  in_review: '#FFDB15',
  unavailable: '#F94500',
}
const STATE_LABEL: Record<string, string> = {
  available: 'Available',
  in_review: 'In a review',
  unavailable: 'Off-shift',
}

export function ExpertCard({ expert, onAssign }: { expert: Expert; onAssign?: () => void }) {
  return (
    <div
      className="border border-[#E0E0E0] bg-white px-4 sm:px-5 py-5 flex flex-col"
      data-testid={`expert-card-${expert.id}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span
          className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
          style={{ background: '#0A0A0A', fontSize: 14 }}
        >
          {expert.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 15 }}>{expert.name}</span>
          <span className="label block mt-0.5">{expert.specialty}</span>
          <span className="label block mt-0.5" style={{ color: '#826DEE' }}>{expert.credential}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATE_DOT[expert.status] }} />
        <span className="label" style={{ color: STATE_DOT[expert.status] }}>{STATE_LABEL[expert.status]} · {expert.responseTime}</span>
      </div>
      <p className="body-light mb-4" style={{ fontSize: 12 }}>{expert.bio}</p>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F0F0F0] mt-auto">
        <Stat label="Reviews" value={expert.reviewsCount.toString()} />
        <Stat label="Accuracy" value={`${Math.round(expert.accuracy * 100)}%`} color="#0E9F6E" />
        <Stat label="Rating" value={expert.rating.toFixed(1)} color="#FFDB15" />
      </div>
      {onAssign && expert.status !== 'unavailable' && (
        <button
          onClick={onAssign}
          className="mt-4 label tap-target border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors w-full"
          data-testid={`expert-assign-${expert.id}`}
        >
          Assign for review →
        </button>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span className="label block mb-0.5">{label}</span>
      <span className="tabular text-[#0A0A0A]" style={{ fontSize: 13, color: color ?? '#0A0A0A' }}>{value}</span>
    </div>
  )
}
