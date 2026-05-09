'use client'

import { OpsEvent, OpsEventKind } from '@/lib/sample-data'

const KIND_LABEL: Record<OpsEventKind, string> = {
  pickup_scheduled: 'Pickup',
  crew_dispatched: 'Crew',
  custody_transfer: 'Custody',
  storage_logged: 'Storage',
  packing_evidence: 'Packing',
  channel_published: 'Listings',
  exception: 'Exception',
  return_requested: 'Return',
  dispute_opened: 'Dispute',
  reconciliation: 'Recon',
  authentication_started: 'Auth',
  stop_sell: 'Stop-Sell',
}

const KIND_COLOR: Record<OpsEventKind, string> = {
  pickup_scheduled: '#826DEE',
  crew_dispatched: '#826DEE',
  custody_transfer: '#FFDB15',
  storage_logged: '#FF99DC',
  packing_evidence: '#FFDB15',
  channel_published: '#0E9F6E',
  exception: '#F94500',
  return_requested: '#F94500',
  dispute_opened: '#F94500',
  reconciliation: '#0E9F6E',
  authentication_started: '#826DEE',
  stop_sell: '#0A0A0A',
}

const STATUS_DOT: Record<string, string> = {
  ok: '#0E9F6E',
  attention: '#FFDB15',
  blocked: '#F94500',
}

export function OpsTimeline({ events, title = 'Operations timeline' }: { events: OpsEvent[]; title?: string }) {
  return (
    <div className="border border-[#E0E0E0] bg-white" data-testid="ops-timeline">
      <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
        <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● Command Center</span>
        <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{title}</h3>
      </div>
      <ol className="">
        {events.map(e => (
          <li
            key={e.id}
            className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0] last:border-b-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
            data-testid={`ops-event-${e.id}`}
          >
            <div className="md:col-span-2 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[e.status] }} />
              <span className="label" style={{ color: KIND_COLOR[e.kind] }}>● {KIND_LABEL[e.kind]}</span>
            </div>
            <div className="md:col-span-7">
              <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{e.title}</span>
              <span className="body-light block mt-0.5" style={{ fontSize: 13 }}>{e.detail}</span>
              {e.evidence && e.evidence.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {e.evidence.map((ev, i) => (
                    <li key={i} className="label px-2 py-1" style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
                      {ev}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="md:col-span-3 flex md:flex-col md:items-end gap-3 md:gap-1">
              <span className="label tabular">{e.ts}</span>
              {e.owner && <span className="label">→ {e.owner}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
