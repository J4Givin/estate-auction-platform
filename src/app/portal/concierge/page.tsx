'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { CONCIERGE_TEAM, CONCIERGE_TIMELINE, ASSET_BALANCE } from '@/lib/sample-data'

const STATE_DOT: Record<string, string> = {
  with_you: '#0E9F6E',
  available: '#826DEE',
  scheduled: '#FFDB15',
}
const STATE_LABEL: Record<string, string> = {
  with_you: 'On call now',
  available: 'Available',
  scheduled: 'Scheduled',
}

export default function ConciergePage() {
  return (
    <AppShell
      role="customer"
      userName="Sample User"
      orgName="Sample Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Call now" primaryHref="/portal/concierge#contact" />}
    >
      <PageHeader
        eyebrow="White-Glove Concierge"
        title="We'll handle it."
        subtitle="A real human is assigned to your estate from day one. We coordinate pickup, flag risk, manage stop-sells, and protect family-only items."
      />

      {/* Promise card */}
      <div className="border border-[#0A0A0A] bg-white mb-10" data-testid="concierge-promise">
        <div className="px-5 sm:px-7 py-6 bg-[#0A0A0A] text-white">
          <span className="label-dark block mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>● Our promise</span>
          <p className="text-white" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4 }}>
            You don&rsquo;t have to be an estate expert. You don&rsquo;t need to know the value of every item. You don&rsquo;t need to drive to a self-storage unit. We&rsquo;ll do the work, you&rsquo;ll make the calls — and a single coordinator stays with you the whole way through.
          </p>
        </div>
      </div>

      {/* Team */}
      <SectionCard title="Your Team" description="Three real people. One phone call, one text, one click away.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONCIERGE_TEAM.map(m => (
            <div key={m.name} className="border border-[#E0E0E0] bg-white p-5" data-testid={`concierge-${m.name.split(' ')[0].toLowerCase()}`}>
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
                  style={{ background: m.avatarColor, fontSize: 16 }}
                >
                  {m.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                </span>
                <div>
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{m.name}</span>
                  <span className="label">{m.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATE_DOT[m.state] }} />
                <span className="label" style={{ color: STATE_DOT[m.state] }}>
                  {STATE_LABEL[m.state]} {m.nextAvailable && m.state !== 'with_you' ? `· ${m.nextAvailable}` : ''}
                </span>
              </div>
              <p className="body-light mb-4" style={{ fontSize: 13 }}>{m.bio}</p>
              <div className="flex flex-col gap-2">
                <button className="btn btn-yellow" style={{ justifyContent: 'center' }} data-testid={`concierge-call-${m.name.split(' ')[0].toLowerCase()}`}>
                  Call now →
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'center' }} data-testid={`concierge-text-${m.name.split(' ')[0].toLowerCase()}`}>
                  Text {m.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Stress-reducing next steps */}
      <SectionCard
        title="Easy next steps"
        description="Pick what feels right for today. We'll never push you to decide faster than you want."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'I want a 15-min phone call', detail: 'Sarah will walk through what we found, what to expect this week, and what you can ignore for now.', cta: 'Schedule a call', color: '#826DEE' },
            { title: 'I just want cash for the whole estate', detail: 'David runs you through the buyout. Funded escrow, single deposit, 3-day pickup. No channel risk.', cta: 'Talk to David', color: '#FFDB15' },
            { title: 'I have one or two family items I want back', detail: 'We lock those out of any sale immediately. They&rsquo;re yours.', cta: 'Lock items', color: '#0A0A0A' },
            { title: 'I&rsquo;d like to give some of this to charity', detail: 'Maya helps you pick a charity, route items, and prep tax receipts.', cta: 'Open donations', color: '#0E9F6E' },
          ].map(c => (
            <div key={c.title} className="border border-[#E0E0E0] bg-white p-5" data-testid={`next-step-${c.title.slice(0, 12).toLowerCase().replace(/[^a-z]+/g, '-')}`}>
              <span className="label block mb-2" style={{ color: c.color }}>● Easy step</span>
              <h4 className="text-[#0A0A0A] font-medium mb-2" style={{ fontSize: 16 }}>{c.title}</h4>
              <p className="body-light mb-4" style={{ fontSize: 13 }}>{c.detail}</p>
              <button className="btn btn-outline" style={{ justifyContent: 'center', width: '100%' }}>
                {c.cta} →
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Concierge Timeline" description="Every call, text, email between you and your team.">
        <ol className="border-l border-[#E0E0E0] pl-4 ml-1">
          {CONCIERGE_TIMELINE.map(t => (
            <li key={t.id} className="relative pl-4 pb-5 last:pb-0">
              <span className="absolute -left-[20px] top-1 w-2 h-2 rounded-full" style={{ background: t.color }} />
              <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 13 }}>{t.label}</span>
              <span className="label tabular">{t.date}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Escalation CTA */}
      <div id="contact" className="border border-[#E0E0E0] bg-[#FFFDF0] p-5 sm:p-6" data-testid="concierge-escalation">
        <span className="label block mb-2" style={{ color: '#F94500' }}>● Need help right now?</span>
        <h4 className="text-[#0A0A0A] font-medium mb-2" style={{ fontSize: 16 }}>Escalate to a senior coordinator.</h4>
        <p className="body-light mb-4" style={{ fontSize: 13 }}>
          Stop-sell, dispute, family lock, legal hold, or you&rsquo;re just feeling overwhelmed — escalate at any time. A senior person responds within 30 minutes during business hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-yellow" style={{ justifyContent: 'center' }} data-testid="concierge-escalate-call">Call senior coordinator →</button>
          <button className="btn btn-outline" style={{ justifyContent: 'center' }} data-testid="concierge-escalate-stop">Stop-sell everything</button>
        </div>
      </div>
    </AppShell>
  )
}
