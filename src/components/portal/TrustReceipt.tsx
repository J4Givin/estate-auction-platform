'use client'

import { TrustReceiptData, RECEIPT_COLOR, RECEIPT_LABEL } from '@/lib/sample-data'

export function TrustReceipt({ receipt, compact = false }: { receipt: TrustReceiptData; compact?: boolean }) {
  const color = RECEIPT_COLOR[receipt.kind]
  const label = RECEIPT_LABEL[receipt.kind]

  return (
    <div
      className="border border-[#E0E0E0] bg-white"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
      data-testid={`trust-receipt-${receipt.id}`}
      data-receipt-kind={receipt.kind}
    >
      <div className="px-4 sm:px-5 py-4 border-b border-[#F0F0F0] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="label block mb-1.5" style={{ color }}>● {label} · Trust Receipt</span>
          <h4 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: compact ? 14 : 15 }}>
            {receipt.title}
          </h4>
        </div>
        <span className="label tabular flex-shrink-0">{receipt.id}</span>
      </div>
      <dl className="px-4 sm:px-5 py-4 grid gap-3" style={{ fontSize: 13 }}>
        <ReceiptRow label="What happened" value={receipt.what} />
        <ReceiptRow label="Why" value={receipt.why} />
        <ReceiptRow
          label="Evidence"
          value={
            <ul className="flex flex-col gap-1 mt-0.5">
              {receipt.evidence.map((e, i) => (
                <li key={i} className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>
                  · {e}
                </li>
              ))}
            </ul>
          }
        />
        <ReceiptRow
          label="Approved by"
          value={
            <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>
              <strong className="font-medium">{receipt.approver}</strong> · {receipt.approverRole}
            </span>
          }
        />
        <ReceiptRow
          label="When"
          value={<span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>{receipt.timestamp}</span>}
        />
        <ReceiptRow
          label="Snapshot"
          value={<span className="tabular text-[#6B6B6B]" style={{ fontSize: 12 }}>{receipt.immutableSnapshotId} · immutable</span>}
        />
      </dl>
      {receipt.disputeUrl && (
        <div className="px-4 sm:px-5 py-3 border-t border-[#F0F0F0] flex items-center justify-between gap-3">
          <span className="label">Need to dispute or change?</span>
          <a
            href={receipt.disputeUrl}
            className="label tap-target px-3 py-2 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            data-testid={`trust-receipt-dispute-${receipt.id}`}
          >
            Open Dispute →
          </a>
        </div>
      )}
    </div>
  )
}

function ReceiptRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-3 items-start">
      <dt className="label">{label}</dt>
      <dd className="text-[#0A0A0A] body-light" style={{ fontSize: 13 }}>{value}</dd>
    </div>
  )
}
