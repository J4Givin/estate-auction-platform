export function SampleBanner({ label = 'Sample / Demo Environment', detail }: { label?: string; detail?: string }) {
  return (
    <div className="bg-[#FFDB15] text-[#0A0A0A] border-b border-[#0A0A0A]/20" role="status">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold">{label}</span>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
          {detail ?? 'Anonymized data — does not represent any real client estate.'}
        </span>
      </div>
    </div>
  )
}
