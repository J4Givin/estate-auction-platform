'use client'

import { ChannelMatrixForItem, fmt } from '@/lib/sample-data'

const RISK_COLOR: Record<string, string> = {
  low: '#0E9F6E',
  medium: '#FFDB15',
  high: '#F94500',
}

export function ChannelMatrix({ matrix }: { matrix: ChannelMatrixForItem }) {
  return (
    <div className="border border-[#E0E0E0] bg-white" data-testid={`channel-matrix-${matrix.itemId}`}>
      <div className="px-4 sm:px-6 py-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● Channel Recommendation Matrix</span>
          <h3 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 16 }}>{matrix.itemName}</h3>
          <span className="label block mt-1">{matrix.category}</span>
        </div>
      </div>

      {/* Mobile: card list. Desktop: table-ish grid */}
      <div className="md:hidden">
        {matrix.options.map(o => {
          const recommended = o.id === matrix.recommendedId
          return (
            <div
              key={o.id}
              className="px-4 py-4 border-b border-[#F0F0F0] last:border-b-0"
              data-testid={`channel-row-${matrix.itemId}-${o.id}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{o.name}</span>
                  <span className="label block mt-0.5">{o.bestFor}</span>
                </div>
                {recommended && (
                  <span className="label px-2 py-1 flex-shrink-0" style={{ background: '#0E9F6E', color: 'white' }}>
                    ● Recommended
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                <Cell label="Fit" value={`${Math.round(o.fitScore * 100)}%`} color={o.fitScore >= 0.8 ? '#0E9F6E' : o.fitScore >= 0.6 ? '#FFDB15' : '#F94500'} />
                <Cell label="Days" value={`${o.expectedDays}d`} />
                <Cell label="Net" value={fmt(o.expectedNet)} color="#0A0A0A" />
                <Cell label="Fee" value={`${Math.round(o.feePct * 100)}%`} />
                <Cell label="Policy Risk" value={o.policyRisk} color={RISK_COLOR[o.policyRisk]} />
                <Cell label="Fulfillment" value={o.fulfillmentBurden} color={RISK_COLOR[o.fulfillmentBurden]} />
              </div>
              <p className="body-light mt-3" style={{ fontSize: 12 }}>{o.notes}</p>
            </div>
          )
        })}
      </div>

      <div className="hidden md:block">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="border-b border-[#E0E0E0]">
              <Th>Channel</Th>
              <Th>Fit</Th>
              <Th align="right">Net</Th>
              <Th align="right">Fee</Th>
              <Th align="right">Days</Th>
              <Th>Policy</Th>
              <Th>Fulfill</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {matrix.options.map(o => {
              const recommended = o.id === matrix.recommendedId
              return (
                <tr key={o.id} className="border-b border-[#F0F0F0]" data-testid={`channel-row-${matrix.itemId}-${o.id}`}>
                  <Td>
                    <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{o.name}</span>
                    {recommended && <span className="label" style={{ color: '#0E9F6E' }}>● Recommended</span>}
                  </Td>
                  <Td>
                    <span className="tabular" style={{ color: o.fitScore >= 0.8 ? '#0E9F6E' : o.fitScore >= 0.6 ? '#FFDB15' : '#F94500', fontSize: 14 }}>
                      {Math.round(o.fitScore * 100)}%
                    </span>
                  </Td>
                  <Td align="right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>{fmt(o.expectedNet)}</span></Td>
                  <Td align="right"><span className="tabular text-[#6B6B6B]" style={{ fontSize: 13 }}>{Math.round(o.feePct * 100)}%</span></Td>
                  <Td align="right"><span className="tabular text-[#6B6B6B]" style={{ fontSize: 13 }}>{o.expectedDays}d</span></Td>
                  <Td><span className="label" style={{ color: RISK_COLOR[o.policyRisk] }}>● {o.policyRisk}</span></Td>
                  <Td><span className="label" style={{ color: RISK_COLOR[o.fulfillmentBurden] }}>● {o.fulfillmentBurden}</span></Td>
                  <Td><span className="body-light" style={{ fontSize: 12 }}>{o.notes}</span></Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <th
      className="label px-3 py-3"
      style={{ textAlign: align ?? 'left', fontWeight: 400 }}
    >
      {children}
    </th>
  )
}
function Td({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <td className="px-3 py-3 align-top" style={{ textAlign: align ?? 'left' }}>
      {children}
    </td>
  )
}
function Cell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span className="label block mb-0.5">{label}</span>
      <span className="tabular text-[#0A0A0A]" style={{ fontSize: 13, color: color ?? '#0A0A0A' }}>{value}</span>
    </div>
  )
}
