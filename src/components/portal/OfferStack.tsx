'use client'

import { OFFER_STACK, fmt } from '@/lib/sample-data'

export function OfferStack() {
  return (
    <div className="border border-[#E0E0E0] bg-white" data-testid="offer-stack">
      <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
        <span className="label block mb-1.5" style={{ color: '#FFDB15' }}>● Instant Liquidity Engine</span>
        <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>
          Choose your scope. Cash now is risk-priced and transparent.
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {OFFER_STACK.map((s, idx) => {
          const ratio = s.offerAmount / s.managedNetHigh
          return (
            <div
              key={s.scope + s.scopeLabel}
              className="px-4 sm:px-6 py-5 border-b md:border-b-0 md:border-r last:border-r-0 border-[#F0F0F0] flex flex-col"
              data-testid={`offer-stack-${idx}`}
            >
              <span className="label block mb-1" style={{ color: '#826DEE' }}>● {s.scope.toUpperCase()}</span>
              <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{s.scopeLabel}</span>

              <div className="mt-4 mb-4">
                <span className="label block mb-1.5">Cash Now</span>
                <span
                  className="block tabular"
                  style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1, color: '#0A0A0A' }}
                >
                  {fmt(s.offerAmount)}
                </span>
                <span className="label mt-1.5 block">
                  vs managed {fmt(s.managedNetLow)}–{fmt(s.managedNetHigh)} · {Math.round(ratio * 100)}% of upper
                </span>
              </div>

              {/* Component bars */}
              <div className="flex flex-col gap-2 mt-2 mb-3" data-testid={`offer-components-${idx}`}>
                {s.components.map(c => {
                  const positive = c.value > 0
                  const widthPct = Math.min(Math.abs(c.pct) * 200, 100)
                  return (
                    <div key={c.label} className="grid grid-cols-[110px_1fr_70px] gap-2 items-center">
                      <span className="label" style={{ color: c.color, fontSize: 9 }}>{c.label}</span>
                      <div className="h-1.5 bg-[#F0F0F0] relative">
                        <span
                          className="absolute top-0 bottom-0 left-0"
                          style={{ width: `${widthPct}%`, background: c.color, opacity: positive ? 1 : 0.5 }}
                        />
                      </div>
                      <span className="tabular text-[#0A0A0A] text-right" style={{ fontSize: 12, color: positive ? '#0A0A0A' : '#F94500' }}>
                        {positive ? '+' : '−'}{fmt(Math.abs(c.value))}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 mb-3 pt-3 border-t border-[#F0F0F0]">
                <Stat label="Items" value={s.itemCount.toString()} />
                <Stat label="Reserves" value={fmt(s.reserves)} color="#F94500" />
                <Stat label="ETA" value={s.payoutEta.split(' ')[0]} sub={s.payoutEta.split(' ').slice(1).join(' ')} />
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button className="btn btn-yellow" style={{ justifyContent: 'center' }} data-testid={`offer-stack-accept-${idx}`}>
                  Accept Cash {fmt(s.offerAmount)} →
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 10 }} data-testid={`offer-stack-counter-${idx}`}>
                  Counter or Adjust Scope
                </button>
                {s.splitStrategy && (
                  <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                    <span className="label block mb-1" style={{ color: '#0E9F6E' }}>● Split Strategy Suggestion</span>
                    <span className="body-light block" style={{ fontSize: 12 }}>
                      <strong className="text-[#0A0A0A]">Take:</strong> {s.splitStrategy.take}
                    </span>
                    <span className="body-light block" style={{ fontSize: 12 }}>
                      <strong className="text-[#0A0A0A]">Keep:</strong> {s.splitStrategy.keep}
                    </span>
                    <span className="label tabular mt-1 block" style={{ color: '#0E9F6E' }}>
                      Combined estimate {fmt(s.splitStrategy.estimateNet)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div>
      <span className="label block mb-0.5">{label}</span>
      <span className="tabular text-[#0A0A0A]" style={{ fontSize: 13, color: color ?? '#0A0A0A' }}>{value}</span>
      {sub && <span className="label block">{sub}</span>}
    </div>
  )
}
