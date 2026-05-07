'use client'

import { AppraisalRun, AgentState } from '@/lib/sample-data'

const STATE_COLOR: Record<AgentState, string> = {
  queued: '#BDBDBD',
  running: '#FFDB15',
  done: '#0E9F6E',
  human_review: '#F94500',
  blocked: '#F94500',
}

const STATE_LABEL: Record<AgentState, string> = {
  queued: 'Queued',
  running: 'Running',
  done: 'Done',
  human_review: 'Human review',
  blocked: 'Blocked',
}

export function AppraisalPipeline({ run }: { run: AppraisalRun }) {
  return (
    <div className="border border-[#E0E0E0] bg-white" data-testid={`appraisal-pipeline-${run.itemId}`}>
      <div className="px-4 sm:px-6 py-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● AI Multi-Agent Appraisal</span>
          <h3 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 16 }}>{run.itemName}</h3>
          <span className="label block mt-1">{run.category} · started {run.startedAt}</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="label block mb-1">Confidence</span>
            <span
              className="tabular block"
              style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1, color: run.finalConfidence >= 0.75 ? '#0E9F6E' : run.finalConfidence >= 0.6 ? '#FFDB15' : '#F94500' }}
            >
              {Math.round(run.finalConfidence * 100)}%
            </span>
          </div>
          <div>
            <span className="label block mb-1">AI Estimate</span>
            <span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>
              ${run.finalEstimate.low.toLocaleString()}–${run.finalEstimate.high.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* AI guarantee banner */}
      <div className="px-4 sm:px-6 py-3 border-b border-[#F0F0F0] bg-[#FFFDF0]">
        <span className="label block" style={{ color: '#7B6800' }}>
          ● AI estimate · not a guarantee. High-value or low-confidence items route to a human specialist.
        </span>
      </div>

      <ol className="">
        {run.agents.map((a, i) => {
          const dotColor = STATE_COLOR[a.state]
          return (
            <li
              key={a.stage}
              className="px-4 sm:px-6 py-5 border-b border-[#F0F0F0] last:border-b-0 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5"
              data-testid={`agent-stage-${a.stage}`}
            >
              <div className="md:col-span-3 flex items-start gap-3">
                <span className="flex flex-col items-center pt-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
                </span>
                <div>
                  <span className="label block">Stage {String(i + 1).padStart(2, '0')}</span>
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{a.title}</span>
                  <span className="label block mt-1" style={{ color: dotColor }}>● {STATE_LABEL[a.state]}</span>
                </div>
              </div>
              <div className="md:col-span-6">
                <p className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>{a.output || a.oneLine}</p>
                {a.evidence.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5" data-testid={`agent-evidence-${a.stage}`}>
                    {a.evidence.map((e, idx) => (
                      <li key={idx} className="label px-2 py-1" style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
                {a.humanTrigger && (
                  <p className="label mt-2.5" style={{ color: '#F94500' }}>
                    ● Human trigger: {a.humanTrigger}
                  </p>
                )}
                {a.nextAction && (
                  <p className="label mt-1" style={{ color: '#826DEE' }}>
                    → Next action: {a.nextAction}
                  </p>
                )}
              </div>
              <div className="md:col-span-3 flex md:flex-col md:items-end gap-3 md:gap-1">
                <div>
                  <span className="label block">Confidence</span>
                  <span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>
                    {a.confidence > 0 ? `${Math.round(a.confidence * 100)}%` : '—'}
                  </span>
                </div>
                {a.ranAt && (
                  <div className="md:text-right">
                    <span className="label block">Ran</span>
                    <span className="label tabular">{a.ranAt}</span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
