'use client'

import { useState } from 'react'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { useCaptureState, useEstateCase } from '@/lib/data/hooks'
import { newIdempotencyKey, portalWrite } from '@/lib/portal-client'

const STATE_LABEL: Record<string, string> = {
  incomplete: 'Needs more photos',
  ready_for_ai: 'Ready for AI appraisal',
  ai_review: 'AI is reviewing',
  human_review_required: 'Human review needed',
}
const STATE_COLOR: Record<string, string> = {
  incomplete: '#F94500',
  ready_for_ai: '#0E9F6E',
  ai_review: '#826DEE',
  human_review_required: '#FFDB15',
}

export default function CapturePage() {
  const captureQuery = useCaptureState()
  const estate = useEstateCase()
  const ROOM_CAPTURE = captureQuery.data.rooms
  const CAPTURE_CHECKLIST = captureQuery.data.checklist
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  const [activeRoom, setActiveRoom] = useState<string | undefined>(ROOM_CAPTURE[0]?.id)
  const room = ROOM_CAPTURE.find(r => r.id === activeRoom) ?? ROOM_CAPTURE[0]

  const totalCaptured = ROOM_CAPTURE.reduce((s, r) => s + r.itemsCaptured, 0)
  const totalExpected = ROOM_CAPTURE.reduce((s, r) => s + r.itemsExpected, 0)
  const overall = totalExpected ? totalCaptured / totalExpected : 0

  const onChecklistToggle = async (checklistItemId: string, done: boolean) => {
    if (!room) return
    try {
      await portalWrite(
        '/api/portal/capture/checklist',
        { roomId: room.id, checklistItemId, done, actor: 'Sample User' },
        { idempotencyKey: newIdempotencyKey() },
      )
    } catch {}
  }

  return (
    <AppShell
      role="customer"
      userName="Sample User"
      orgName="Sample Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Capture Now" primaryHref="/portal/capture" />}
    >
      <PageHeader
        eyebrow="Mobile Capture"
        title="Catalog the estate."
        subtitle="Guided room-by-room capture. We highlight missing angles, blur PII, score photo quality, and tell you when each room is ready for AI appraisal."
        actions={
          <button className="btn btn-yellow hidden md:inline-flex" data-testid="capture-launch-camera">
            Launch Camera →
          </button>
        }
      />

      {/* Coverage summary */}
      <div className="border border-[#0A0A0A] bg-white mb-10" data-testid="coverage-summary">
        <div className="px-5 sm:px-7 py-5 bg-[#0A0A0A] text-white">
          <span className="label-dark block mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>● Coverage Score</span>
          <div className="flex items-end gap-4">
            <span
              className="tabular"
              style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(2.4rem, 8vw, 4rem)', lineHeight: 1 }}
            >
              {Math.round(overall * 100)}%
            </span>
            <span className="label-dark mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>{totalCaptured} / {totalExpected} items captured</span>
          </div>
          <div className="h-2 bg-white/10 mt-4 relative">
            <span className="absolute top-0 bottom-0 left-0 bg-[#FFDB15]" style={{ width: `${overall * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Room picker — mobile first cards */}
      <SectionCard title="Rooms" description="Open a room to capture, review missing angles, and confirm coverage." className="!mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROOM_CAPTURE.map(r => {
            const pct = r.itemsExpected ? r.itemsCaptured / r.itemsExpected : 0
            const stateColor = STATE_COLOR[r.status]
            const active = activeRoom === r.id
            return (
              <button
                key={r.id}
                onClick={() => setActiveRoom(r.id)}
                className="text-left border bg-white px-4 py-4 transition-colors"
                style={{ borderColor: active ? '#0A0A0A' : '#E0E0E0' }}
                data-testid={`room-card-${r.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{r.name}</span>
                  <span className="label tabular">{r.itemsCaptured}/{r.itemsExpected}</span>
                </div>
                <div className="h-1.5 bg-[#F0F0F0] mb-3 relative">
                  <span className="absolute top-0 bottom-0 left-0" style={{ width: `${pct * 100}%`, background: stateColor }} />
                </div>
                <span className="label" style={{ color: stateColor }}>● {STATE_LABEL[r.status]}</span>
                {r.lastCapturedAt && <span className="label block mt-1">Last: {r.lastCapturedAt}</span>}
              </button>
            )
          })}
        </div>
      </SectionCard>

      {/* Active room detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="border border-[#E0E0E0] bg-white" data-testid="room-detail">
          <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0] flex items-start justify-between">
            <div>
              <span className="label block mb-1.5" style={{ color: STATE_COLOR[room.status] }}>● {STATE_LABEL[room.status]}</span>
              <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 16 }}>{room.name}</h3>
            </div>
            <span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>
              {Math.round(room.coverageScore * 100)}%
            </span>
          </div>
          <div className="px-4 sm:px-6 py-4 grid grid-cols-3 gap-4 border-b border-[#F0F0F0]">
            <Stat label="Items" value={`${room.itemsCaptured}/${room.itemsExpected}`} />
            <Stat label="PII Redacted" value={room.piiRedacted.toString()} color="#0E9F6E" />
            <Stat label="Coverage" value={`${Math.round(room.coverageScore * 100)}%`} color={STATE_COLOR[room.status]} />
          </div>
          {room.missingAngles.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
              <span className="label block mb-2" style={{ color: '#F94500' }}>● Missing angles</span>
              <ul className="flex flex-col gap-1">
                {room.missingAngles.map((m, i) => (
                  <li key={i} className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>· {m}</li>
                ))}
              </ul>
            </div>
          )}
          {room.qualityIssues.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
              <span className="label block mb-2" style={{ color: '#FFDB15' }}>● Quality issues</span>
              <ul className="flex flex-col gap-1">
                {room.qualityIssues.map((m, i) => (
                  <li key={i} className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>· {m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2">
            <button className="btn btn-yellow flex-1" style={{ justifyContent: 'center' }} data-testid="room-capture">
              Capture next photo →
            </button>
            <button className="btn btn-outline flex-1" style={{ justifyContent: 'center' }} data-testid="room-mark-done">
              Mark room ready
            </button>
          </div>
        </div>

        {/* Capture checklist */}
        <div className="border border-[#E0E0E0] bg-white" data-testid="capture-checklist">
          <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
            <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● Per-item checklist</span>
            <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 16 }}>Six photos = a clean appraisal.</h3>
          </div>
          <ol className="">
            {CAPTURE_CHECKLIST.map((c, i) => (
              <li key={c.id} className="px-4 sm:px-6 py-3 border-b border-[#F0F0F0] last:border-b-0 flex items-start gap-3" data-testid={`checklist-${c.id}`}>
                <button
                  onClick={() => onChecklistToggle(c.id, true)}
                  className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white"
                  style={{ background: '#0A0A0A', fontSize: 12 }}
                  aria-label={`mark ${c.label} done`}
                  data-testid={`checklist-toggle-${c.id}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
                <div className="min-w-0">
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{c.label}</span>
                  <span className="body-light block" style={{ fontSize: 12 }}>{c.tip}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="px-4 sm:px-6 py-4 border-t border-[#F0F0F0] bg-[#F5F5F5]">
            <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● PII Redaction</span>
            <p className="body-light" style={{ fontSize: 12 }}>
              Faces, addresses, and account numbers in any photo are auto-blurred before AI analysis or human review.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span className="label block mb-1">{label}</span>
      <span className="tabular text-[#0A0A0A]" style={{ fontSize: 14, color: color ?? '#0A0A0A' }}>{value}</span>
    </div>
  )
}
