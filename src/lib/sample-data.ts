/**
 * Shared sample data for the customer portal command center.
 * Editorial / mocked — representative estate liquidity workflows.
 */

export type Disposition =
  | 'undecided'
  | 'sell_managed'
  | 'sell_to_platform'
  | 'store'
  | 'donate'
  | 'keep'
  | 'dispose'

export type ItemStatus =
  | 'captured'
  | 'ai_review'
  | 'human_review'
  | 'authenticated'
  | 'listed'
  | 'sold'
  | 'donated'
  | 'stored'
  | 'on_hold'

export type Confidence = 'high' | 'medium' | 'low'

export interface Comp {
  source: string
  title: string
  price: number
  date: string
  url?: string
}

export interface InventoryItem {
  id: string
  name: string
  room: string
  category: string
  estimateLow: number
  estimateHigh: number
  cashOffer: number
  floorPrice: number
  status: ItemStatus
  disposition: Disposition
  confidence: Confidence
  aiRationale: string
  humanReviewed: boolean
  reviewer?: { name: string; role: string; date: string; rationale: string }
  comps: Comp[]
  flags: string[]
  donationSuggested?: boolean
  channels?: string[]
  storageLocation?: string
  evidenceSnapshot?: string
}

const today = '2026-05-02'

export const INVENTORY: InventoryItem[] = [
  {
    id: 'ITM-1041',
    name: 'Tiffany Studios Favrile Glass Lamp',
    room: 'Library',
    category: 'Lighting / Art Glass',
    estimateLow: 9800,
    estimateHigh: 14200,
    cashOffer: 7600,
    floorPrice: 9000,
    status: 'human_review',
    disposition: 'sell_managed',
    confidence: 'medium',
    aiRationale:
      'Form, patina, and base mark match Tiffany Studios c.1905. AI flagged shade leading for closer inspection — comps span $9,400–$14,800 over the last 18 months.',
    humanReviewed: true,
    reviewer: { name: 'Helena Choe, ASA', role: 'Senior Appraiser — Art Glass', date: '2026-04-30', rationale: 'Authenticated. Recommend reserve at $9,000. Insurance crating required.' },
    comps: [
      { source: 'Christie’s', title: 'Tiffany Studios Daffodil Lamp', price: 13200, date: '2026-02-14' },
      { source: 'Sotheby’s', title: 'Tiffany Studios Favrile, 18in', price: 11400, date: '2026-01-09' },
      { source: 'Heritage Auctions', title: 'Tiffany Bronze Lamp', price: 9800, date: '2025-11-22' },
    ],
    flags: ['HIGH_VALUE', 'AUTHENTICATION_REQUIRED'],
    channels: ['House Auction', 'Live Show', '1stDibs'],
    evidenceSnapshot: 'snapshot-2026-04-30T14:21Z',
  },
  {
    id: 'ITM-1042',
    name: 'Continental Silver Candelabra, Pair',
    room: 'Dining Room',
    category: 'Silver / Hollowware',
    estimateLow: 1800,
    estimateHigh: 2600,
    cashOffer: 1450,
    floorPrice: 1700,
    status: 'authenticated',
    disposition: 'sell_managed',
    confidence: 'high',
    aiRationale:
      'Hallmarks consistent with Austrian silver, c.1890. Weight, condition, and patina photographed. 12 comps in last 24 months — narrow band.',
    humanReviewed: true,
    reviewer: { name: 'Jonas Park', role: 'Decorative Arts QA', date: '2026-04-29', rationale: 'Hallmarks verified. No repairs detected.' },
    comps: [
      { source: 'Bonhams', title: 'Pair Continental Silver Candelabra', price: 2400, date: '2026-03-01' },
      { source: 'Heritage', title: 'Austrian Silver Pair', price: 2150, date: '2026-02-18' },
    ],
    flags: [],
    channels: ['eBay', '1stDibs', 'House Storefront'],
    evidenceSnapshot: 'snapshot-2026-04-29T11:02Z',
  },
  {
    id: 'ITM-1043',
    name: 'Victorian Wingback Armchair',
    room: 'Sitting Room',
    category: 'Furniture',
    estimateLow: 1800,
    estimateHigh: 2400,
    cashOffer: 1150,
    floorPrice: 1500,
    status: 'listed',
    disposition: 'sell_managed',
    confidence: 'high',
    aiRationale:
      'English mahogany wingback, c.1870. Original horsehair stuffing, minor reupholstery. Strong demand on Chairish.',
    humanReviewed: true,
    reviewer: { name: 'Marcus Rivers', role: 'Furniture Specialist', date: '2026-04-27', rationale: 'Frame sound. Recommend list with two-tone re-cover option for buyers.' },
    comps: [
      { source: 'Chairish', title: 'Victorian Wingback', price: 2200, date: '2026-04-10' },
      { source: '1stDibs', title: 'English Wingback c.1875', price: 2600, date: '2026-03-22' },
    ],
    flags: [],
    channels: ['Chairish', '1stDibs', 'Facebook Marketplace'],
    evidenceSnapshot: 'snapshot-2026-04-27T10:18Z',
  },
  {
    id: 'ITM-1044',
    name: 'Skeleton Pocket Watch, Swiss',
    room: 'Study Safe',
    category: 'Horology',
    estimateLow: 800,
    estimateHigh: 1200,
    cashOffer: 720,
    floorPrice: 850,
    status: 'sold',
    disposition: 'sell_managed',
    confidence: 'high',
    aiRationale: 'Ebauches Swiss 18-jewel skeleton, c.1895. Movement runs. No case damage.',
    humanReviewed: true,
    reviewer: { name: 'Inez Kotov', role: 'Horology QA', date: '2026-04-12', rationale: 'Movement timed within 6s/day.' },
    comps: [
      { source: 'eBay Sold', title: 'Swiss Skeleton 1890s', price: 2050, date: '2026-04-15' },
    ],
    flags: [],
    channels: ['eBay'],
    evidenceSnapshot: 'snapshot-2026-04-12T09:00Z',
  },
  {
    id: 'ITM-1045',
    name: 'Crystal Candelabra Chandelier',
    room: 'Foyer',
    category: 'Lighting',
    estimateLow: 3200,
    estimateHigh: 4800,
    cashOffer: 2400,
    floorPrice: 3000,
    status: 'human_review',
    disposition: 'undecided',
    confidence: 'medium',
    aiRationale:
      'Continental cut crystal, possibly Baccarat-style. AI confidence medium pending maker verification. Loose prisms photographed.',
    humanReviewed: false,
    comps: [
      { source: 'Sotheby’s', title: 'Continental Crystal Chandelier', price: 4600, date: '2026-02-02' },
      { source: '1stDibs', title: 'Crystal 12-light Chandelier', price: 5200, date: '2025-12-10' },
    ],
    flags: ['NEEDS_HUMAN_REVIEW', 'CRATING_REQUIRED'],
    evidenceSnapshot: 'snapshot-2026-04-30T08:44Z',
  },
  {
    id: 'ITM-1046',
    name: 'Floral Damask Armchair, Pair',
    room: 'Sitting Room',
    category: 'Furniture',
    estimateLow: 900,
    estimateHigh: 1400,
    cashOffer: 600,
    floorPrice: 800,
    status: 'listed',
    disposition: 'sell_managed',
    confidence: 'medium',
    aiRationale: 'French upholstered armchairs c.1900. Minor staining flagged on one cushion.',
    humanReviewed: true,
    reviewer: { name: 'Helena Choe, ASA', role: 'Senior Appraiser', date: '2026-04-26', rationale: 'Conditioned and listed.' },
    comps: [
      { source: 'Chairish', title: 'Pair French Armchairs', price: 1450, date: '2026-04-04' },
    ],
    flags: [],
    channels: ['Chairish', 'Facebook Marketplace'],
    evidenceSnapshot: 'snapshot-2026-04-26T13:00Z',
  },
  {
    id: 'ITM-1047',
    name: 'Scholar’s Writing Desk',
    room: 'Library',
    category: 'Furniture',
    estimateLow: 1200,
    estimateHigh: 1800,
    cashOffer: 900,
    floorPrice: 1100,
    status: 'stored',
    disposition: 'store',
    confidence: 'high',
    aiRationale: 'American walnut Eastlake desk, c.1880. Original drawer pulls intact.',
    humanReviewed: true,
    reviewer: { name: 'Marcus Rivers', role: 'Furniture Specialist', date: '2026-04-22', rationale: 'In bonded storage at LA-04 pending decision.' },
    comps: [],
    flags: [],
    storageLocation: 'LA-04 / Bay 12',
    evidenceSnapshot: 'snapshot-2026-04-22T15:31Z',
  },
  {
    id: 'ITM-1048',
    name: 'Mid-Century Walnut Dresser',
    room: 'Bedroom',
    category: 'Furniture',
    estimateLow: 700,
    estimateHigh: 1100,
    cashOffer: 520,
    floorPrice: 700,
    status: 'listed',
    disposition: 'sell_managed',
    confidence: 'high',
    aiRationale: 'Lane-style mid-century dresser, c.1965. Strong demand in current cycle.',
    humanReviewed: false,
    comps: [
      { source: 'Chairish', title: 'MCM Walnut Dresser', price: 950, date: '2026-04-18' },
    ],
    flags: [],
    channels: ['Chairish', 'Facebook Marketplace'],
    evidenceSnapshot: 'snapshot-2026-04-25T08:14Z',
  },
  {
    id: 'ITM-1049',
    name: 'Estate Linens & Table Runners',
    room: 'Linen Closet',
    category: 'Textiles / Soft Goods',
    estimateLow: 80,
    estimateHigh: 220,
    cashOffer: 0,
    floorPrice: 0,
    status: 'ai_review',
    disposition: 'donate',
    confidence: 'low',
    aiRationale: 'Mixed-era linens. Low resale velocity. Recommended for charity routing.',
    humanReviewed: false,
    comps: [],
    flags: ['LOW_VELOCITY', 'DONATION_CANDIDATE'],
    donationSuggested: true,
  },
  {
    id: 'ITM-1050',
    name: 'Personal Family Photographs',
    room: 'Study',
    category: 'Personal / Sentimental',
    estimateLow: 0,
    estimateHigh: 0,
    cashOffer: 0,
    floorPrice: 0,
    status: 'on_hold',
    disposition: 'keep',
    confidence: 'high',
    aiRationale: 'Identified as sentimental personal photos. Locked from sale.',
    humanReviewed: true,
    reviewer: { name: 'Sarah Chen', role: 'Estate Coordinator', date: '2026-04-21', rationale: 'Customer-locked. Returned to family.' },
    comps: [],
    flags: ['CUSTOMER_LOCKED', 'PII_REDACTED'],
  },
  {
    id: 'ITM-1051',
    name: 'Antique Persian Rug, Tabriz',
    room: 'Living Room',
    category: 'Rugs',
    estimateLow: 4200,
    estimateHigh: 6800,
    cashOffer: 3400,
    floorPrice: 4000,
    status: 'human_review',
    disposition: 'sell_managed',
    confidence: 'medium',
    aiRationale: 'Hand-knotted Tabriz, c.1920–40 estimated by knot density and palette. Wear patterns suggest moderate use; minor edge fraying.',
    humanReviewed: false,
    comps: [
      { source: 'Doyle', title: 'Tabriz Rug 9x12', price: 5400, date: '2026-03-30' },
      { source: '1stDibs', title: 'Antique Tabriz', price: 6900, date: '2026-02-11' },
    ],
    flags: ['NEEDS_HUMAN_REVIEW'],
    evidenceSnapshot: 'snapshot-2026-04-30T17:52Z',
  },
  {
    id: 'ITM-1052',
    name: 'Costume Jewelry Lot, 30+ pieces',
    room: 'Bedroom Vanity',
    category: 'Jewelry',
    estimateLow: 120,
    estimateHigh: 280,
    cashOffer: 90,
    floorPrice: 120,
    status: 'ai_review',
    disposition: 'donate',
    confidence: 'low',
    aiRationale: 'Mixed costume pieces. Low individual value; donation suggested with charity tax receipt.',
    humanReviewed: false,
    comps: [],
    flags: ['DONATION_CANDIDATE'],
    donationSuggested: true,
  },
]

export const PORTFOLIO_SUMMARY = {
  estateName: 'Mitchell Estate',
  jobId: 'JOB-2026-0418',
  itemsTotal: 52,
  itemsCataloged: 47,
  itemsApproved: 38,
  itemsListed: 22,
  itemsSold: 9,
  itemsStored: 6,
  itemsDonated: 4,
  itemsHeld: 3,
  estimatedNetLow: 28400,
  estimatedNetHigh: 41200,
  cashOfferAvailable: 22650,
  cashOfferExpires: '2026-05-09',
  proceedsToDate: 14820,
  reservedForFees: 2230,
  availableForPayout: 9410,
  donationsToDate: 1180,
  charityName: 'Habitat for Humanity Greater LA',
  storageItems: 6,
  storageMonthlyCost: 84,
  riskFlags: 3,
  pendingApprovals: 5,
}

export interface CashOffer {
  id: string
  scope: string
  amount: number
  expires: string
  itemCount: number
  description: string
  status: 'live' | 'expiring' | 'accepted' | 'declined'
}

export const CASH_OFFERS: CashOffer[] = [
  {
    id: 'OFR-22-A',
    scope: 'Whole Estate Buyout',
    amount: 22650,
    expires: '2026-05-09',
    itemCount: 47,
    description: 'Single net-cash offer for full cataloged inventory. Funded escrow; 3-day pickup window.',
    status: 'live',
  },
  {
    id: 'OFR-22-B',
    scope: 'Furniture Lot',
    amount: 4860,
    expires: '2026-05-07',
    itemCount: 11,
    description: 'Cash offer for the furniture-only lot — sitting room, library, bedroom.',
    status: 'live',
  },
  {
    id: 'OFR-22-C',
    scope: 'Tiffany Studios Lamp',
    amount: 7600,
    expires: '2026-05-05',
    itemCount: 1,
    description: 'Direct buyout for the authenticated Tiffany lamp. Requires authentication waiver release.',
    status: 'expiring',
  },
]

export interface LedgerEntry {
  id: string
  date: string
  description: string
  type: 'sale' | 'fee' | 'reserve' | 'payout' | 'donation' | 'storage' | 'refund'
  gross: number
  fee: number
  net: number
  channel?: string
}

export const LEDGER: LedgerEntry[] = [
  { id: 'L-201', date: '2026-04-30', description: 'Skeleton Pocket Watch — eBay #1920', type: 'sale', gross: 2050, fee: 308, net: 1742, channel: 'eBay' },
  { id: 'L-202', date: '2026-04-29', description: 'Mid-Century Walnut Dresser — Chairish', type: 'sale', gross: 950, fee: 142, net: 808, channel: 'Chairish' },
  { id: 'L-203', date: '2026-04-27', description: 'Floral Damask Armchairs — Chairish', type: 'sale', gross: 1450, fee: 217, net: 1233, channel: 'Chairish' },
  { id: 'L-204', date: '2026-04-26', description: 'Storage — LA-04 monthly fee', type: 'storage', gross: 0, fee: 84, net: -84 },
  { id: 'L-205', date: '2026-04-25', description: 'Donation receipt — Habitat for Humanity', type: 'donation', gross: 0, fee: 0, net: 0 },
  { id: 'L-206', date: '2026-04-22', description: 'Continental Silver Pair — 1stDibs', type: 'sale', gross: 2400, fee: 360, net: 2040, channel: '1stDibs' },
  { id: 'L-207', date: '2026-04-20', description: 'Payout to bank ****6201', type: 'payout', gross: 0, fee: 0, net: -6500 },
  { id: 'L-208', date: '2026-04-15', description: 'Victorian Wingback — Chairish', type: 'sale', gross: 2200, fee: 330, net: 1870, channel: 'Chairish' },
]

export interface Charity {
  id: string
  name: string
  mission: string
  ein: string
  selected: boolean
  taxReceipts: number
  totalRouted: number
}

export const CHARITIES: Charity[] = [
  {
    id: 'CH-001',
    name: 'Habitat for Humanity Greater LA',
    mission: 'Affordable housing & home repair',
    ein: '95-1234567',
    selected: true,
    taxReceipts: 3,
    totalRouted: 1180,
  },
  {
    id: 'CH-002',
    name: 'Hospice of San Joaquin',
    mission: 'End-of-life family support services',
    ein: '94-2876543',
    selected: true,
    taxReceipts: 1,
    totalRouted: 240,
  },
  {
    id: 'CH-003',
    name: 'Goodwill Southern California',
    mission: 'Workforce development & re-use',
    ein: '95-1641939',
    selected: false,
    taxReceipts: 0,
    totalRouted: 0,
  },
  {
    id: 'CH-004',
    name: 'Friends of the LA Library',
    mission: 'Library programs & literacy',
    ein: '95-3137745',
    selected: false,
    taxReceipts: 0,
    totalRouted: 0,
  },
]

export const RISK_FLAGS = [
  {
    id: 'RF-1',
    severity: 'medium' as const,
    title: 'Crystal Chandelier — needs human review',
    detail: 'Maker verification pending. Item paused from listing until specialist signs off.',
    itemId: 'ITM-1045',
  },
  {
    id: 'RF-2',
    severity: 'high' as const,
    title: 'Tiffany lamp — authentication evidence frozen',
    detail: 'Listing locked to authenticated comps and snapshot 2026-04-30T14:21Z. Any disposition change requires customer + appraiser confirmation.',
    itemId: 'ITM-1041',
  },
  {
    id: 'RF-3',
    severity: 'low' as const,
    title: 'Persian rug — recommend secondary expert',
    detail: 'AI confidence medium. Region/age estimate would benefit from rug specialist secondary.',
    itemId: 'ITM-1051',
  },
]

export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function fmtSigned(n: number): string {
  if (n === 0) return '$0'
  const sign = n > 0 ? '+' : '−'
  return `${sign}${fmt(Math.abs(n))}`
}

export const DISPOSITION_LABEL: Record<Disposition, string> = {
  undecided: 'Undecided',
  sell_managed: 'Managed Sale',
  sell_to_platform: 'Sell to Platform',
  store: 'Store & Decide',
  donate: 'Donate',
  keep: 'Keep / Lock',
  dispose: 'Dispose',
}

export const DISPOSITION_COLOR: Record<Disposition, string> = {
  undecided: '#6B6B6B',
  sell_managed: '#826DEE',
  sell_to_platform: '#FFDB15',
  store: '#FF99DC',
  donate: '#0E9F6E',
  keep: '#0A0A0A',
  dispose: '#F94500',
}

export const STATUS_LABEL: Record<ItemStatus, string> = {
  captured: 'Captured',
  ai_review: 'AI Review',
  human_review: 'Human Review',
  authenticated: 'Authenticated',
  listed: 'Listed',
  sold: 'Sold',
  donated: 'Donated',
  stored: 'Stored',
  on_hold: 'On Hold',
}

/* ═══════════════════════════════════════════════════════════════
   AI APPRAISAL PIPELINE — multi-agent stages, rubrics, receipts
   ═══════════════════════════════════════════════════════════════ */

export type AgentStage =
  | 'classify'
  | 'condition'
  | 'provenance'
  | 'comps'
  | 'liquidity'
  | 'fraud'
  | 'strategy'
  | 'final'

export type AgentState = 'queued' | 'running' | 'done' | 'human_review' | 'blocked'

export interface AppraisalAgent {
  stage: AgentStage
  title: string
  oneLine: string
  state: AgentState
  confidence: number
  evidence: string[]
  output: string
  nextAction?: string
  humanTrigger?: string
  ranAt?: string
  durationMs?: number
}

export interface AppraisalRun {
  itemId: string
  itemName: string
  category: string
  startedAt: string
  finalConfidence: number
  finalEstimate: { low: number; high: number }
  agents: AppraisalAgent[]
}

export const APPRAISAL_RUNS: AppraisalRun[] = [
  {
    itemId: 'ITM-1041',
    itemName: 'Tiffany Studios Favrile Glass Lamp',
    category: 'Lighting / Art Glass',
    startedAt: '2026-04-30T14:18Z',
    finalConfidence: 0.78,
    finalEstimate: { low: 9800, high: 14200 },
    agents: [
      {
        stage: 'classify',
        title: 'Classifier',
        oneLine: 'Identifies category, maker, period.',
        state: 'done',
        confidence: 0.94,
        evidence: ['Bronze base mark T.S. NEW YORK', 'Favrile leaded shade signature', 'Form match: Daffodil 18in'],
        output: 'Tiffany Studios Daffodil-form lamp, c.1905. 99% match on signature mark.',
        ranAt: '14:18:21Z',
        durationMs: 1800,
      },
      {
        stage: 'condition',
        title: 'Condition Inspector',
        oneLine: 'Evaluates wear, repairs, breakage.',
        state: 'human_review',
        confidence: 0.62,
        evidence: ['Photo 4/8 shows leading anomaly', 'No fractures detected', 'Patina consistent with age'],
        output: 'Body sound. Leading near top rim should be inspected in person.',
        humanTrigger: 'Leading anomaly above $5K item — escalates to art glass specialist.',
        nextAction: 'Specialist physical inspection scheduled.',
        ranAt: '14:18:30Z',
        durationMs: 2300,
      },
      {
        stage: 'provenance',
        title: 'Provenance Tracer',
        oneLine: 'Looks for chain-of-ownership, paperwork, registry.',
        state: 'done',
        confidence: 0.71,
        evidence: ['Family acquisition note 1968', 'No prior public sale record', 'No registry hit'],
        output: 'Verbal family provenance, no public auction history. Acceptable.',
        ranAt: '14:18:45Z',
        durationMs: 1200,
      },
      {
        stage: 'comps',
        title: 'Comp Builder',
        oneLine: 'Pulls comparable sales across auction houses + marketplaces.',
        state: 'done',
        confidence: 0.83,
        evidence: ['Christie’s Feb 2026: $13,200', 'Sotheby’s Jan 2026: $11,400', 'Heritage Nov 2025: $9,800'],
        output: '12-month median $11,400. Range $9,400–$14,800.',
        ranAt: '14:18:55Z',
        durationMs: 3100,
      },
      {
        stage: 'liquidity',
        title: 'Liquidity Modeler',
        oneLine: 'Estimates time-to-sale and sell-through.',
        state: 'done',
        confidence: 0.74,
        evidence: ['Sell-through 78% in 90 days', 'Best velocity at house auction', '1stDibs slow but premium'],
        output: '~62 days expected sale. Auction recommended as primary.',
        ranAt: '14:19:01Z',
        durationMs: 1400,
      },
      {
        stage: 'fraud',
        title: 'Fraud / Risk Sentinel',
        oneLine: 'Authentication risk, counterfeits, restricted material.',
        state: 'human_review',
        confidence: 0.55,
        evidence: ['Tiffany counterfeit risk: medium', 'Lead glass — no restricted materials', 'No prior fraud match'],
        output: 'Authentication strongly recommended before listing.',
        humanTrigger: 'High-value Tiffany — automatic specialist authentication.',
        nextAction: 'Helena Choe, ASA assigned (art glass).',
        ranAt: '14:19:08Z',
        durationMs: 900,
      },
      {
        stage: 'strategy',
        title: 'Listing Strategist',
        oneLine: 'Picks channel mix, pricing curve, donation candidacy.',
        state: 'done',
        confidence: 0.81,
        evidence: ['Auction lift +18% over marketplace', 'Reserve $9,000 protects floor', 'Crating + insurance required'],
        output: 'House auction primary, 1stDibs secondary. Reserve $9,000.',
        ranAt: '14:19:14Z',
        durationMs: 1100,
      },
      {
        stage: 'final',
        title: 'Final Confidence',
        oneLine: 'Aggregates all agents into one estimate + confidence.',
        state: 'done',
        confidence: 0.78,
        evidence: ['Authentication pending', 'Comps converge', 'Listing strategy clean'],
        output: 'Final: $9,800–$14,200. Medium-high confidence, pending physical authentication.',
        ranAt: '14:19:21Z',
        durationMs: 600,
      },
    ],
  },
  {
    itemId: 'ITM-1045',
    itemName: 'Crystal Candelabra Chandelier',
    category: 'Lighting',
    startedAt: '2026-04-30T08:38Z',
    finalConfidence: 0.61,
    finalEstimate: { low: 3200, high: 4800 },
    agents: [
      { stage: 'classify', title: 'Classifier', oneLine: 'Identifies category, maker, period.', state: 'done', confidence: 0.84, evidence: ['12-light continental form', 'Cut crystal prisms'], output: 'Continental cut crystal chandelier, possibly Baccarat-style, c.1900–30.', ranAt: '08:38:14Z', durationMs: 1700 },
      { stage: 'condition', title: 'Condition Inspector', oneLine: 'Evaluates wear, repairs, breakage.', state: 'human_review', confidence: 0.5, evidence: ['Two prisms loose', 'Bobeche chips on arm 4'], output: 'Stable but fragile. Needs hands-on assessment.', humanTrigger: 'Mechanical handling required — crating/inspection prerequisite.', ranAt: '08:38:23Z', durationMs: 2100 },
      { stage: 'provenance', title: 'Provenance Tracer', oneLine: 'Chain-of-ownership search.', state: 'done', confidence: 0.4, evidence: ['No maker signature found', 'No registry record'], output: 'Provenance unclear. Likely unbranded continental piece.', nextAction: 'Maker verification needed.', ranAt: '08:38:34Z', durationMs: 1400 },
      { stage: 'comps', title: 'Comp Builder', oneLine: 'Comparable sales.', state: 'done', confidence: 0.76, evidence: ['Sotheby’s Feb 2026: $4,600', '1stDibs Dec 2025: $5,200'], output: 'Range $4,200–$5,400. Median $4,600.', ranAt: '08:38:42Z', durationMs: 2700 },
      { stage: 'liquidity', title: 'Liquidity Modeler', oneLine: 'Time-to-sale & sell-through.', state: 'done', confidence: 0.59, evidence: ['90-day sell-through 64%', 'Crating burden lengthens timeline'], output: '~84 days expected. Lower velocity.', ranAt: '08:38:49Z', durationMs: 1600 },
      { stage: 'fraud', title: 'Fraud / Risk Sentinel', oneLine: 'Authentication risk.', state: 'done', confidence: 0.78, evidence: ['No restricted materials', 'No counterfeit pattern'], output: 'No active risk flags.', ranAt: '08:38:53Z', durationMs: 600 },
      { stage: 'strategy', title: 'Listing Strategist', oneLine: 'Channel + pricing.', state: 'queued', confidence: 0, evidence: [], output: 'Strategy paused pending maker verification.', nextAction: 'Awaiting human review.', },
      { stage: 'final', title: 'Final Confidence', oneLine: 'Aggregate.', state: 'queued', confidence: 0, evidence: [], output: 'Pending — held at human review.', },
    ],
  },
]

export interface CategoryRubric {
  category: string
  factors: string[]
  primarySignals: string[]
  redFlags: string[]
  humanTriggerThreshold: number
}

export const CATEGORY_RUBRICS: CategoryRubric[] = [
  {
    category: 'Art & Sculpture',
    factors: ['Artist attribution', 'Period', 'Medium', 'Condition', 'Provenance chain', 'Frame originality'],
    primarySignals: ['Signature', 'Catalogue raisonné match', 'Auction history', 'COA paperwork'],
    redFlags: ['Print mistaken for original', 'Reframed lithograph', 'Provenance gap > 30 years'],
    humanTriggerThreshold: 1500,
  },
  {
    category: 'Jewelry & Watches',
    factors: ['Material assay', 'Stone identification', 'Hallmark verification', 'Movement / caliber', 'Condition', 'Repairs disclosed'],
    primarySignals: ['Hallmark stamp', 'Serial number', 'Service history', 'Original box & papers'],
    redFlags: ['Lab-grown represented as natural', 'Aftermarket diamonds in branded watch', 'Worn-down hallmarks'],
    humanTriggerThreshold: 800,
  },
  {
    category: 'Furniture & Decorative',
    factors: ['Maker / style attribution', 'Construction joinery', 'Wood species', 'Refinishing history', 'Damage / repairs'],
    primarySignals: ['Maker stamp', 'Period-correct hardware', 'Hand-cut dovetails', 'Patina'],
    redFlags: ['Married pieces (top/base mismatch)', 'Heavy refinishing', 'Modern reproductions'],
    humanTriggerThreshold: 2000,
  },
  {
    category: 'Collectibles & Memorabilia',
    factors: ['Edition / variant', 'Grade', 'Authenticated provenance', 'Population reports'],
    primarySignals: ['PSA/CGC slab', 'Edition markings', 'Original packaging'],
    redFlags: ['Counterfeit signatures', 'Reprinted variants', 'Forged COAs'],
    humanTriggerThreshold: 500,
  },
  {
    category: 'Vehicles',
    factors: ['VIN match', 'Title status', 'Mileage', 'Service records', 'Aftermarket changes'],
    primarySignals: ['Numbers-matching engine', 'Original interior', 'Marque registry'],
    redFlags: ['Salvage title', 'VIN tampering', 'Replica claimed as original'],
    humanTriggerThreshold: 5000,
  },
  {
    category: 'Electronics',
    factors: ['Functionality test', 'Serial verification', 'Accessories included', 'Software lock'],
    primarySignals: ['Activation status', 'Original cable + box', 'Working tests'],
    redFlags: ['iCloud/MDM lock', 'Counterfeit charger', 'Damaged ports'],
    humanTriggerThreshold: 400,
  },
  {
    category: 'Documents & Books',
    factors: ['Edition', 'Inscriptions', 'Binding integrity', 'Foxing / staining'],
    primarySignals: ['First edition statement', 'Author signature', 'Issue points'],
    redFlags: ['Book club editions', 'Forged inscriptions', 'Re-bound copies'],
    humanTriggerThreshold: 300,
  },
  {
    category: 'General Household',
    factors: ['Condition', 'Resale velocity', 'Donation appropriateness'],
    primarySignals: ['Brand recognition', 'Functional condition'],
    redFlags: ['Recall risk', 'Used soft goods'],
    humanTriggerThreshold: 100,
  },
]

/* ═══════════════════════════════════════════════════════════════
   HUMAN EXPERT MARKETPLACE
   ═══════════════════════════════════════════════════════════════ */

export type ExpertStatus = 'available' | 'in_review' | 'unavailable'

export interface Expert {
  id: string
  name: string
  specialty: string
  credential: string
  rating: number
  reviewsCount: number
  accuracy: number
  responseTime: string
  status: ExpertStatus
  bio: string
  region: string
  hourlyRate?: number
}

export const EXPERTS: Expert[] = [
  { id: 'EXP-01', name: 'Helena Choe, ASA', specialty: 'Art Glass · Tiffany · Galle', credential: 'ASA Senior Appraiser', rating: 4.9, reviewsCount: 412, accuracy: 0.96, responseTime: '< 4h', status: 'in_review', bio: 'Twenty-year specialist in late-19th-century American art glass and lighting.', region: 'Pacific', hourlyRate: 180 },
  { id: 'EXP-02', name: 'Jonas Park', specialty: 'Decorative Arts · Silver', credential: 'Decorative Arts QA', rating: 4.7, reviewsCount: 286, accuracy: 0.93, responseTime: '< 6h', status: 'available', bio: 'Hallmark verification on Continental, English, and American silver.', region: 'East Coast', hourlyRate: 140 },
  { id: 'EXP-03', name: 'Marcus Rivers', specialty: 'Furniture · Period & MCM', credential: 'Senior Furniture Specialist', rating: 4.8, reviewsCount: 530, accuracy: 0.95, responseTime: '< 3h', status: 'available', bio: 'Period American + European furniture, specializing in joinery analysis.', region: 'Pacific', hourlyRate: 150 },
  { id: 'EXP-04', name: 'Inez Kotov', specialty: 'Horology · Vintage Watches', credential: 'WOSTEP Certified', rating: 4.9, reviewsCount: 318, accuracy: 0.97, responseTime: '< 2h', status: 'available', bio: 'Mechanical movement verification + period correctness.', region: 'Mountain', hourlyRate: 200 },
  { id: 'EXP-05', name: 'Yara Idrissi', specialty: 'Rugs & Textiles', credential: 'ORRA Member', rating: 4.6, reviewsCount: 174, accuracy: 0.91, responseTime: '< 8h', status: 'available', bio: 'Persian, Turkish, and Caucasian rug attribution + dating.', region: 'East Coast', hourlyRate: 160 },
  { id: 'EXP-06', name: 'Devon Bao', specialty: 'Jewelry · GIA', credential: 'GIA GG', rating: 4.8, reviewsCount: 402, accuracy: 0.94, responseTime: '< 5h', status: 'unavailable', bio: 'Stone identification, treatment disclosure, and natural-vs-lab analysis.', region: 'Pacific', hourlyRate: 220 },
  { id: 'EXP-07', name: 'Sarah Chen', specialty: 'Estate Coordinator · Concierge', credential: 'Estate Coordinator', rating: 4.9, reviewsCount: 612, accuracy: 0.99, responseTime: '< 1h', status: 'available', bio: 'White-glove executor and family liaison; manages stop-sell, locks, and family-only items.', region: 'Pacific', hourlyRate: 95 },
]

export type ExpertQueueState = 'needed' | 'assigned' | 'in_review' | 'verified' | 'escalated'

export interface ExpertQueueRow {
  id: string
  itemId: string
  itemName: string
  category: string
  estimateLow: number
  estimateHigh: number
  state: ExpertQueueState
  expertId?: string
  assignedAt?: string
  slaHours: number
  hoursOpen: number
  notes?: string
}

export const EXPERT_QUEUE: ExpertQueueRow[] = [
  { id: 'EQ-01', itemId: 'ITM-1041', itemName: 'Tiffany Studios Favrile Lamp', category: 'Art Glass', estimateLow: 9800, estimateHigh: 14200, state: 'in_review', expertId: 'EXP-01', assignedAt: '2026-04-30T14:21Z', slaHours: 24, hoursOpen: 18, notes: 'Authentication; physical inspection requested.' },
  { id: 'EQ-02', itemId: 'ITM-1045', itemName: 'Crystal Candelabra Chandelier', category: 'Lighting', estimateLow: 3200, estimateHigh: 4800, state: 'needed', slaHours: 48, hoursOpen: 4, notes: 'Maker verification.' },
  { id: 'EQ-03', itemId: 'ITM-1051', itemName: 'Antique Persian Rug, Tabriz', category: 'Rugs', estimateLow: 4200, estimateHigh: 6800, state: 'assigned', expertId: 'EXP-05', assignedAt: '2026-05-02T10:14Z', slaHours: 36, hoursOpen: 6, notes: 'Region/age secondary opinion.' },
  { id: 'EQ-04', itemId: 'ITM-2030', itemName: 'Patek Philippe Calatrava (other estate)', category: 'Watches', estimateLow: 15000, estimateHigh: 22000, state: 'escalated', expertId: 'EXP-04', assignedAt: '2026-04-30T08:00Z', slaHours: 24, hoursOpen: 36, notes: 'Movement service history concern. Escalated to senior.' },
  { id: 'EQ-05', itemId: 'ITM-2031', itemName: 'Civil War Field Letters', category: 'Documents', estimateLow: 600, estimateHigh: 1100, state: 'verified', expertId: 'EXP-02', assignedAt: '2026-04-29T11:00Z', slaHours: 24, hoursOpen: 0, notes: 'Verified. Period-correct. Listing approved.' },
]

/* ═══════════════════════════════════════════════════════════════
   INSTANT LIQUIDITY ENGINE
   ═══════════════════════════════════════════════════════════════ */

export interface OfferComponent {
  label: string
  value: number
  pct: number
  detail: string
  color: string
}

export interface OfferStackEntry {
  scope: 'estate' | 'lot' | 'category' | 'item'
  scopeLabel: string
  offerAmount: number
  managedNetLow: number
  managedNetHigh: number
  components: OfferComponent[]
  itemCount: number
  expires: string
  payoutEta: string
  reserves: number
  splitStrategy?: { take: string; keep: string; estimateNet: number }
}

export const OFFER_STACK: OfferStackEntry[] = [
  {
    scope: 'estate',
    scopeLabel: 'Whole-Estate Buyout',
    offerAmount: 22650,
    managedNetLow: 28400,
    managedNetHigh: 41200,
    itemCount: 47,
    expires: '2026-05-09',
    payoutEta: '1–2 business days',
    reserves: 1900,
    components: [
      { label: 'Comp Floor', value: 18900, pct: 0.55, detail: 'Bottom of 12-month auction comps, weighted by category.', color: '#826DEE' },
      { label: 'Velocity Premium', value: 2400, pct: 0.10, detail: 'Cash-now liquidity premium vs 60–90 day managed sale.', color: '#FFDB15' },
      { label: 'Authentication Buffer', value: -1200, pct: -0.05, detail: 'Reserve held against pending Tiffany authentication.', color: '#F94500' },
      { label: 'Storage Burden Discount', value: -800, pct: -0.03, detail: 'Discounted for items requiring crating/insurance.', color: '#FF99DC' },
      { label: 'Channel Fee Avoidance', value: 3350, pct: 0.13, detail: 'Customer avoids 12–18% channel commission.', color: '#0E9F6E' },
    ],
    splitStrategy: { take: 'Cash on furniture lot now', keep: 'Send Tiffany + chandelier to managed auction', estimateNet: 18600 },
  },
  {
    scope: 'lot',
    scopeLabel: 'Furniture Lot · 11 items',
    offerAmount: 4860,
    managedNetLow: 6200,
    managedNetHigh: 8800,
    itemCount: 11,
    expires: '2026-05-07',
    payoutEta: '1 business day',
    reserves: 240,
    components: [
      { label: 'Comp Floor', value: 4100, pct: 0.66, detail: 'Chairish + 1stDibs + Facebook MP closes.', color: '#826DEE' },
      { label: 'Velocity Premium', value: 600, pct: 0.10, detail: 'Furniture is high-handling; cash beats long lists.', color: '#FFDB15' },
      { label: 'Channel Fee Avoidance', value: 380, pct: 0.06, detail: 'Avoids platform commissions.', color: '#0E9F6E' },
      { label: 'Logistics Discount', value: -220, pct: -0.04, detail: 'Cost to pull, pack, and reposition pieces.', color: '#FF99DC' },
    ],
  },
  {
    scope: 'item',
    scopeLabel: 'Tiffany Studios Lamp · ITM-1041',
    offerAmount: 7600,
    managedNetLow: 9300,
    managedNetHigh: 12800,
    itemCount: 1,
    expires: '2026-05-05',
    payoutEta: 'Same day on signed waiver',
    reserves: 600,
    components: [
      { label: 'Authenticated Comps Floor', value: 8400, pct: 0.92, detail: 'Christie’s + Heritage 12-month median.', color: '#826DEE' },
      { label: 'Authentication Buffer', value: -600, pct: -0.07, detail: 'Held until Helena Choe physical inspection clears.', color: '#F94500' },
      { label: 'Insurance Crating Discount', value: -200, pct: -0.02, detail: 'Crating + freight risk priced in.', color: '#FF99DC' },
    ],
  },
]

export interface AssetBalance {
  cashAvailable: number
  cashPending: number
  listedValue: number
  storageValue: number
  donatedValue: number
  reserves: number
  estimatedNetLow: number
  estimatedNetHigh: number
}

export const ASSET_BALANCE: AssetBalance = {
  cashAvailable: 9410,
  cashPending: 4830,
  listedValue: 38400,
  storageValue: 6200,
  donatedValue: 1180,
  reserves: 2230,
  estimatedNetLow: 28400,
  estimatedNetHigh: 41200,
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE CAPTURE EXCELLENCE
   ═══════════════════════════════════════════════════════════════ */

export type CaptureState = 'incomplete' | 'ready_for_ai' | 'ai_review' | 'human_review_required'

export interface RoomCapture {
  id: string
  name: string
  itemsExpected: number
  itemsCaptured: number
  coverageScore: number
  missingAngles: string[]
  qualityIssues: string[]
  piiRedacted: number
  status: CaptureState
  lastCapturedAt?: string
}

export const ROOM_CAPTURE: RoomCapture[] = [
  { id: 'RC-01', name: 'Library', itemsExpected: 8, itemsCaptured: 8, coverageScore: 0.96, missingAngles: [], qualityIssues: [], piiRedacted: 2, status: 'ready_for_ai', lastCapturedAt: '2026-04-29 16:22' },
  { id: 'RC-02', name: 'Dining Room', itemsExpected: 6, itemsCaptured: 6, coverageScore: 0.92, missingAngles: ['Underside of candelabra'], qualityIssues: [], piiRedacted: 0, status: 'ready_for_ai', lastCapturedAt: '2026-04-29 14:01' },
  { id: 'RC-03', name: 'Sitting Room', itemsExpected: 5, itemsCaptured: 5, coverageScore: 0.89, missingAngles: ['Frame back of armchair pair'], qualityIssues: ['Soft focus on Photo 3'], piiRedacted: 1, status: 'ai_review', lastCapturedAt: '2026-04-29 11:18' },
  { id: 'RC-04', name: 'Foyer', itemsExpected: 3, itemsCaptured: 3, coverageScore: 0.78, missingAngles: ['Crystal chandelier — top angle', 'Maker mark close-up'], qualityIssues: ['Glare on prisms'], piiRedacted: 0, status: 'human_review_required', lastCapturedAt: '2026-04-30 08:34' },
  { id: 'RC-05', name: 'Bedroom', itemsExpected: 9, itemsCaptured: 4, coverageScore: 0.42, missingAngles: ['Closet contents', 'Vanity drawers', 'Under bed'], qualityIssues: ['3 photos < 1080p'], piiRedacted: 0, status: 'incomplete', lastCapturedAt: '2026-04-28 19:44' },
  { id: 'RC-06', name: 'Garage', itemsExpected: 12, itemsCaptured: 0, coverageScore: 0, missingAngles: ['Entire room'], qualityIssues: [], piiRedacted: 0, status: 'incomplete' },
  { id: 'RC-07', name: 'Study Safe', itemsExpected: 2, itemsCaptured: 2, coverageScore: 0.95, missingAngles: [], qualityIssues: [], piiRedacted: 4, status: 'ready_for_ai', lastCapturedAt: '2026-04-26 09:22' },
]

export const CAPTURE_CHECKLIST = [
  { id: 'cap-front', label: 'Front-on at eye level', tip: 'Frame the whole item, no crop.' },
  { id: 'cap-back', label: 'Back / underside', tip: 'Reveals construction, signatures, condition.' },
  { id: 'cap-mark', label: 'Maker mark / signature close-up', tip: 'Sharp focus on hallmarks, stamps, labels.' },
  { id: 'cap-condition', label: 'Condition close-up', tip: 'Any chips, repairs, or wear.' },
  { id: 'cap-scale', label: 'Scale reference', tip: 'Hand or coin for size.' },
  { id: 'cap-paperwork', label: 'Provenance paperwork', tip: 'COA, receipts, family notes — auto-redacts PII.' },
]

/* ═══════════════════════════════════════════════════════════════
   TRUST RECEIPTS — universal record
   ═══════════════════════════════════════════════════════════════ */

export type ReceiptKind =
  | 'appraisal'
  | 'listing'
  | 'price_drop'
  | 'donation'
  | 'payout'
  | 'disposal'
  | 'stop_sell'
  | 'authentication'
  | 'storage'

export interface TrustReceiptData {
  id: string
  kind: ReceiptKind
  itemId?: string
  title: string
  what: string
  why: string
  evidence: string[]
  approver: string
  approverRole: string
  timestamp: string
  immutableSnapshotId: string
  disputeUrl?: string
}

export const TRUST_RECEIPTS: TrustReceiptData[] = [
  {
    id: 'TR-1041-A',
    kind: 'appraisal',
    itemId: 'ITM-1041',
    title: 'AI appraisal — Tiffany Studios Favrile Lamp',
    what: 'AI estimate $9,800–$14,200 produced, escalated to specialist for authentication.',
    why: 'Eight-stage agent run flagged condition + counterfeit risk above $5K threshold.',
    evidence: ['Snapshot 2026-04-30T14:21Z', '8 photos analyzed', '12 comps', 'Helena Choe queued'],
    approver: 'Estate Liquidity Appraisal Engine v3.2',
    approverRole: 'AI multi-agent + human-in-the-loop',
    timestamp: '2026-04-30T14:19:21Z',
    immutableSnapshotId: 'snap_3a82f1c',
    disputeUrl: '/portal/items/ITM-1041',
  },
  {
    id: 'TR-1041-B',
    kind: 'authentication',
    itemId: 'ITM-1041',
    title: 'Specialist authentication assigned',
    what: 'Helena Choe, ASA assigned for in-person Tiffany authentication.',
    why: 'AI flagged authentication-required + value > $5K.',
    evidence: ['Specialist credentials on file', 'Specialist accuracy 96% over 412 reviews'],
    approver: 'Helena Choe, ASA',
    approverRole: 'Senior Appraiser — Art Glass',
    timestamp: '2026-04-30T14:21:00Z',
    immutableSnapshotId: 'snap_4c91d22',
  },
  {
    id: 'TR-1043-A',
    kind: 'listing',
    itemId: 'ITM-1043',
    title: 'Listing published — Victorian Wingback Armchair',
    what: 'Listed across Chairish + 1stDibs + Facebook Marketplace at $2,400 with floor $1,500.',
    why: 'Comps at $2,200 (Chairish) and $2,600 (1stDibs); customer-set floor $1,500.',
    evidence: ['Channel matrix v1.4', '2 active comps', 'Customer floor confirmed 2026-04-26'],
    approver: 'Marcus Rivers',
    approverRole: 'Furniture Specialist',
    timestamp: '2026-04-27T10:18:00Z',
    immutableSnapshotId: 'snap_5d12af0',
  },
  {
    id: 'TR-1044-A',
    kind: 'payout',
    itemId: 'ITM-1044',
    title: 'Sale + reserve hold — Skeleton Pocket Watch',
    what: 'Sold $2,050 on eBay. $1,742 cleared. 7-day reserve $308.',
    why: 'Standard reserve protects against return/chargeback per policy.',
    evidence: ['eBay order #1920', 'Buyer feedback 100%', 'Tracking confirmed'],
    approver: 'Estate Liquidity Settlement',
    approverRole: 'Auto-reconciliation + Inez Kotov check',
    timestamp: '2026-04-30T18:00:00Z',
    immutableSnapshotId: 'snap_6e21af8',
  },
  {
    id: 'TR-1049-A',
    kind: 'donation',
    itemId: 'ITM-1049',
    title: 'Donation routed — Estate Linens',
    what: 'Routed to Habitat for Humanity Greater LA. Tax receipt scheduled.',
    why: 'Low-velocity, low-margin items get more good as donations than open-market resale.',
    evidence: ['Habitat EIN 95-1234567', 'Customer-confirmed charity 2026-04-25', 'IRS 8283 thresholds checked'],
    approver: 'Sarah Chen',
    approverRole: 'Estate Coordinator',
    timestamp: '2026-04-25T15:00:00Z',
    immutableSnapshotId: 'snap_7f30c1d',
  },
  {
    id: 'TR-1050-A',
    kind: 'stop_sell',
    itemId: 'ITM-1050',
    title: 'Stop-sell / lock — Family Photographs',
    what: 'Item locked. Removed from any future listing or donation routing.',
    why: 'Customer flagged as sentimental personal property.',
    evidence: ['Customer ack 2026-04-21', 'PII redaction confirmed', 'No listing channel touched'],
    approver: 'Sarah Mitchell (Customer)',
    approverRole: 'Estate Owner',
    timestamp: '2026-04-21T12:11:00Z',
    immutableSnapshotId: 'snap_8a44b22',
  },
  {
    id: 'TR-PAY-001',
    kind: 'payout',
    title: 'Payout — Bank ****6201',
    what: '$6,500 transferred to bank ****6201.',
    why: 'Customer-requested withdrawal of available proceeds.',
    evidence: ['ACH trace 1920331', 'Same-day reconciliation'],
    approver: 'Estate Liquidity Treasury',
    approverRole: 'Finance ops',
    timestamp: '2026-04-20T09:14:00Z',
    immutableSnapshotId: 'snap_9b51e44',
  },
]

/* ═══════════════════════════════════════════════════════════════
   MARKETPLACE CHANNEL MATRIX
   ═══════════════════════════════════════════════════════════════ */

export interface ChannelOption {
  id: string
  name: string
  fitScore: number
  expectedDays: number
  expectedNet: number
  feePct: number
  policyRisk: 'low' | 'medium' | 'high'
  fulfillmentBurden: 'low' | 'medium' | 'high'
  bestFor: string
  notes: string
}

export interface ChannelMatrixForItem {
  itemId: string
  itemName: string
  category: string
  options: ChannelOption[]
  recommendedId: string
}

export const CHANNEL_MATRIX: ChannelMatrixForItem[] = [
  {
    itemId: 'ITM-1041',
    itemName: 'Tiffany Studios Favrile Lamp',
    category: 'Art Glass',
    recommendedId: 'house_auction',
    options: [
      { id: 'house_auction', name: 'House Auction', fitScore: 0.92, expectedDays: 32, expectedNet: 11200, feePct: 0.18, policyRisk: 'low', fulfillmentBurden: 'medium', bestFor: 'Authenticated, high-value art', notes: 'Reserve $9,000. Live + online bidders.' },
      { id: '1stdibs', name: '1stDibs', fitScore: 0.81, expectedDays: 84, expectedNet: 10100, feePct: 0.20, policyRisk: 'low', fulfillmentBurden: 'medium', bestFor: 'Trade-buyer reach, premium price', notes: 'Slow but premium pricing.' },
      { id: 'ebay', name: 'eBay', fitScore: 0.45, expectedDays: 28, expectedNet: 8400, feePct: 0.13, policyRisk: 'medium', fulfillmentBurden: 'high', bestFor: 'Mass reach', notes: 'Counterfeit risk requires authenticity guarantee.' },
      { id: 'direct_buyout', name: 'Direct Buyout', fitScore: 0.74, expectedDays: 1, expectedNet: 7600, feePct: 0, policyRisk: 'low', fulfillmentBurden: 'low', bestFor: 'Speed', notes: 'Same-day cash on signed waiver.' },
    ],
  },
  {
    itemId: 'ITM-1043',
    itemName: 'Victorian Wingback Armchair',
    category: 'Furniture',
    recommendedId: 'chairish',
    options: [
      { id: 'chairish', name: 'Chairish', fitScore: 0.88, expectedDays: 24, expectedNet: 1880, feePct: 0.20, policyRisk: 'low', fulfillmentBurden: 'medium', bestFor: 'Designers + collectors', notes: 'Strong fit; ships via white glove.' },
      { id: '1stdibs', name: '1stDibs', fitScore: 0.74, expectedDays: 60, expectedNet: 2080, feePct: 0.20, policyRisk: 'low', fulfillmentBurden: 'medium', bestFor: 'Premium dealers', notes: 'Higher net but slower.' },
      { id: 'facebook', name: 'Facebook Marketplace', fitScore: 0.62, expectedDays: 12, expectedNet: 1500, feePct: 0.05, policyRisk: 'low', fulfillmentBurden: 'high', bestFor: 'Local pickup', notes: 'Local-only fast cash.' },
      { id: 'house_auction', name: 'House Auction', fitScore: 0.40, expectedDays: 35, expectedNet: 1700, feePct: 0.18, policyRisk: 'low', fulfillmentBurden: 'medium', bestFor: 'Lot-style bundling', notes: 'Furniture clears strong in lot auctions.' },
    ],
  },
  {
    itemId: 'ITM-1049',
    itemName: 'Estate Linens',
    category: 'Textiles / Donation',
    recommendedId: 'donation',
    options: [
      { id: 'donation', name: 'Donation Routing', fitScore: 0.95, expectedDays: 3, expectedNet: 0, feePct: 0, policyRisk: 'low', fulfillmentBurden: 'low', bestFor: 'Hard-to-sell goods', notes: 'Tax receipt + impact report.' },
      { id: 'etsy', name: 'Etsy', fitScore: 0.42, expectedDays: 90, expectedNet: 110, feePct: 0.13, policyRisk: 'low', fulfillmentBurden: 'high', bestFor: 'Vintage textile collectors', notes: 'Slow and labor-heavy.' },
      { id: 'facebook', name: 'Facebook Marketplace', fitScore: 0.35, expectedDays: 60, expectedNet: 80, feePct: 0.05, policyRisk: 'low', fulfillmentBurden: 'high', bestFor: 'Local lots', notes: 'Volume is low; donation likely better.' },
    ],
  },
]

export const CHANNEL_HEALTH = [
  { channel: 'eBay', status: 'green', listings: 142, errors: 0, latencyMs: 420, avgFee: 0.13, sellThrough: 0.62, lift: 0.04 },
  { channel: '1stDibs', status: 'green', listings: 38, errors: 0, latencyMs: 690, avgFee: 0.20, sellThrough: 0.41, lift: 0.18 },
  { channel: 'Chairish', status: 'yellow', listings: 76, errors: 1, latencyMs: 380, avgFee: 0.20, sellThrough: 0.74, lift: 0.12 },
  { channel: 'Facebook MP', status: 'green', listings: 124, errors: 0, latencyMs: 210, avgFee: 0.05, sellThrough: 0.81, lift: 0.02 },
  { channel: 'Etsy', status: 'red', listings: 22, errors: 2, latencyMs: 520, avgFee: 0.13, sellThrough: 0.36, lift: 0.01 },
  { channel: 'House Auction', status: 'green', listings: 18, errors: 0, latencyMs: 0, avgFee: 0.18, sellThrough: 0.88, lift: 0.21 },
  { channel: 'Direct Buyout', status: 'green', listings: 0, errors: 0, latencyMs: 0, avgFee: 0, sellThrough: 1.0, lift: -0.06 },
  { channel: 'Donation', status: 'green', listings: 6, errors: 0, latencyMs: 0, avgFee: 0, sellThrough: 1.0, lift: 0 },
]

/* ═══════════════════════════════════════════════════════════════
   OPERATIONAL COMMAND CENTER
   ═══════════════════════════════════════════════════════════════ */

export type OpsEventKind =
  | 'pickup_scheduled'
  | 'crew_dispatched'
  | 'custody_transfer'
  | 'storage_logged'
  | 'packing_evidence'
  | 'channel_published'
  | 'exception'
  | 'return_requested'
  | 'dispute_opened'
  | 'reconciliation'
  | 'authentication_started'
  | 'stop_sell'

export interface OpsEvent {
  id: string
  kind: OpsEventKind
  itemId?: string
  jobId: string
  title: string
  detail: string
  ts: string
  status: 'ok' | 'attention' | 'blocked'
  evidence?: string[]
  owner?: string
}

export const OPS_EVENTS: OpsEvent[] = [
  { id: 'OE-101', kind: 'pickup_scheduled', jobId: 'JOB-2026-0418', title: 'Pickup scheduled — Mitchell Estate', detail: 'Crew of 2 dispatched 2026-05-04 09:00. Climate truck reserved.', ts: '2026-05-02 11:00', status: 'ok', owner: 'Alex Rivera', evidence: ['Route confirmed', 'COI on file'] },
  { id: 'OE-102', kind: 'authentication_started', itemId: 'ITM-1041', jobId: 'JOB-2026-0418', title: 'Authentication started — Tiffany Lamp', detail: 'Helena Choe (ASA) on-site appointment booked 2026-05-05.', ts: '2026-05-02 09:15', status: 'attention', owner: 'Helena Choe', evidence: ['Snapshot snap_4c91d22', 'Specialist contract on file'] },
  { id: 'OE-103', kind: 'custody_transfer', itemId: 'ITM-1042', jobId: 'JOB-2026-0418', title: 'Chain of custody — Silver Candelabra', detail: 'Tagged ITM-1042-A/B. Sealed in tamper-evident bags.', ts: '2026-04-29 14:11', status: 'ok', evidence: ['Tag photo', 'Crew manifest'] },
  { id: 'OE-104', kind: 'storage_logged', itemId: 'ITM-1047', jobId: 'JOB-2026-0418', title: 'Storage logged — Scholar’s Desk', detail: 'Bay LA-04 / 12. Climate range 18–22°C.', ts: '2026-04-22 15:31', status: 'ok' },
  { id: 'OE-105', kind: 'packing_evidence', itemId: 'ITM-1043', jobId: 'JOB-2026-0418', title: 'Packing evidence — Wingback Armchair', detail: '6-photo packing record uploaded prior to ship.', ts: '2026-04-26 17:00', status: 'ok', evidence: ['6 packing photos', 'Pad map'] },
  { id: 'OE-106', kind: 'channel_published', itemId: 'ITM-1043', jobId: 'JOB-2026-0418', title: 'Listings live — Chairish + 1stDibs + Facebook MP', detail: '3 channels live within 14 minutes. Auto-attribution applied.', ts: '2026-04-27 10:18', status: 'ok' },
  { id: 'OE-107', kind: 'exception', itemId: 'ITM-1045', jobId: 'JOB-2026-0418', title: 'Exception — Crystal Chandelier', detail: 'Maker verification missing. Listing hold; crating dependency.', ts: '2026-04-30 08:34', status: 'attention', owner: 'Yara Idrissi' },
  { id: 'OE-108', kind: 'return_requested', itemId: 'ITM-1046', jobId: 'JOB-2026-0418', title: 'Return — Damask Armchair Pair', detail: 'Buyer reports stain transfer. Photos requested.', ts: '2026-04-30 16:40', status: 'attention', owner: 'Returns desk' },
  { id: 'OE-109', kind: 'reconciliation', jobId: 'JOB-2026-0418', title: 'Daily reconciliation', detail: 'Stripe + eBay + Chairish settle file matched. 0 variance.', ts: '2026-05-01 23:55', status: 'ok' },
  { id: 'OE-110', kind: 'stop_sell', itemId: 'ITM-1050', jobId: 'JOB-2026-0418', title: 'Stop-sell — Family Photographs', detail: 'Customer-requested lock from sale.', ts: '2026-04-21 12:11', status: 'ok' },
  { id: 'OE-111', kind: 'dispute_opened', itemId: 'ITM-2030', jobId: 'JOB-2026-0301', title: 'Dispute — Calatrava service history', detail: 'Buyer claims undisclosed service. Evidence pack drafted.', ts: '2026-04-29 10:44', status: 'blocked', owner: 'Inez Kotov' },
]

/* ═══════════════════════════════════════════════════════════════
   DATA MOAT — learning loop metrics
   ═══════════════════════════════════════════════════════════════ */

export interface LearningMetric {
  id: string
  label: string
  value: string
  trend: { up: boolean; pct: number }
  description: string
  color: string
}

export const LEARNING_METRICS: LearningMetric[] = [
  { id: 'M-1', label: 'AI Appraiser Accuracy', value: '94.2%', trend: { up: true, pct: 1.8 }, description: 'AI estimate vs realized price within ±15%.', color: '#826DEE' },
  { id: 'M-2', label: 'Price Realization', value: '102%', trend: { up: true, pct: 3.4 }, description: 'Realized / mid-estimate, last 90 days.', color: '#0E9F6E' },
  { id: 'M-3', label: 'Sell-Through (90d)', value: '74%', trend: { up: true, pct: 2.1 }, description: 'Items sold within 90 days of list.', color: '#FFDB15' },
  { id: 'M-4', label: 'Time-to-Sale (median)', value: '38d', trend: { up: false, pct: -4.6 }, description: 'Days from list to clear.', color: '#FF99DC' },
  { id: 'M-5', label: 'Channel Lift (auction vs MP)', value: '+18%', trend: { up: true, pct: 0.9 }, description: 'Net premium from auction routing for high-value items.', color: '#826DEE' },
  { id: 'M-6', label: 'Donation Conversion', value: '46%', trend: { up: true, pct: 6.2 }, description: 'Of low-velocity items routed to charity.', color: '#0E9F6E' },
  { id: 'M-7', label: 'Dispute Rate', value: '0.6%', trend: { up: false, pct: -0.3 }, description: 'Disputed sales / total cleared.', color: '#F94500' },
  { id: 'M-8', label: 'Customer NPS', value: '78', trend: { up: true, pct: 4 }, description: 'Net Promoter Score, last 60 days.', color: '#826DEE' },
]

export const PLATFORM_LEARNINGS = [
  { id: 'PL-1', title: 'Auction routing beats marketplace for art glass > $5K', detail: 'Last 60 days: +22% net realized vs marketplace control set.', confidence: 0.91, color: '#826DEE' },
  { id: 'PL-2', title: 'Donation suggestion lifts NPS for executors', detail: 'Executors who routed at least one item to charity show NPS 86 vs 72 baseline.', confidence: 0.84, color: '#0E9F6E' },
  { id: 'PL-3', title: 'Cash-now is preferred when AI confidence < 60%', detail: 'Items with AI confidence < 60% accept cash 2.3× more often than > 80% confidence cohort.', confidence: 0.88, color: '#FFDB15' },
  { id: 'PL-4', title: 'Mid-week price drops sell faster than weekend drops', detail: 'Tuesday/Wednesday price drops convert 14% faster than Saturday drops.', confidence: 0.78, color: '#FF99DC' },
]

export const EXPERIMENTS = [
  { id: 'EX-1', name: 'Price drop curve v3 (5/10/15)', status: 'live', uplift: '+3.1% net', cohort: '320 listings', color: '#0E9F6E' },
  { id: 'EX-2', name: 'Donation suggestion threshold $150', status: 'live', uplift: '+12% donation conversion', cohort: '180 candidates', color: '#0E9F6E' },
  { id: 'EX-3', name: 'Channel routing for furniture > $1.5K', status: 'analyzing', uplift: 'pending', cohort: '64 items', color: '#FFDB15' },
  { id: 'EX-4', name: 'Cash-offer velocity premium tweak', status: 'paused', uplift: 'inconclusive', cohort: '210 offers', color: '#6B6B6B' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPLIANCE & SAFETY
   ═══════════════════════════════════════════════════════════════ */

export type SafetyLevel = 'green' | 'yellow' | 'red'

export interface ComplianceCheck {
  id: string
  area: string
  state: SafetyLevel
  label: string
  detail: string
  evidence: string[]
}

export const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  { id: 'CC-1', area: 'Authority & Consent', state: 'green', label: 'Authority documents on file', detail: 'Letters Testamentary verified 2026-04-18. Customer authorization signed.', evidence: ['Letters Testamentary', 'Authorization e-sign 2026-04-18'] },
  { id: 'CC-2', area: 'Identity / KYC', state: 'green', label: 'Identity verified', detail: 'KYC complete via partner. Beneficiary on payout matches signer.', evidence: ['KYC reference KY-9981'] },
  { id: 'CC-3', area: 'Restricted / Prohibited', state: 'green', label: '0 prohibited matches', detail: 'Zero firearm, ivory, hazardous, or restricted-material flags in catalog.', evidence: ['Auto-screen v1.7', '47 items scanned'] },
  { id: 'CC-4', area: 'Luxury Authentication', state: 'yellow', label: '1 authentication pending', detail: 'Tiffany lamp at specialist for in-person authentication.', evidence: ['Helena Choe assignment'] },
  { id: 'CC-5', area: 'Provenance Documentation', state: 'green', label: 'Provenance recorded', detail: 'Family acquisition notes captured for high-value items.', evidence: ['Notes uploaded for ITM-1041, ITM-1051'] },
  { id: 'CC-6', area: 'PII Redaction', state: 'green', label: 'PII redaction active', detail: '286 photos auto-redacted (faces, addresses, account numbers).', evidence: ['Redaction engine v2.4'] },
  { id: 'CC-7', area: 'Tax Documentation', state: 'green', label: '1099 + 8283 prep', detail: 'Year-end forms scaffolded; donation 8283 thresholds tracked per item.', evidence: ['IRS form scaffold'] },
  { id: 'CC-8', area: 'Legal Hold', state: 'green', label: 'No legal hold active', detail: 'Estate not flagged in litigation registry.', evidence: ['Registry check 2026-04-30'] },
  { id: 'CC-9', area: 'Dispute / Evidence Pack', state: 'green', label: 'Evidence packs ready', detail: 'Per-item evidence pack generation enabled.', evidence: ['Receipts: 7 generated this estate'] },
]

/* ═══════════════════════════════════════════════════════════════
   CONCIERGE
   ═══════════════════════════════════════════════════════════════ */

export type ConciergeState = 'available' | 'with_you' | 'scheduled'

export interface ConciergeMember {
  name: string
  role: string
  avatarColor: string
  state: ConciergeState
  nextAvailable?: string
  phone?: string
  bio: string
}

export const CONCIERGE_TEAM: ConciergeMember[] = [
  { name: 'Sarah Chen', role: 'Estate Coordinator', avatarColor: '#826DEE', state: 'with_you', nextAvailable: 'now', phone: '+1-310-555-0192', bio: 'Your primary executor liaison. Handles family-only items and stop-sell.' },
  { name: 'David Okonkwo', role: 'Liquidity Advisor', avatarColor: '#FFDB15', state: 'available', nextAvailable: 'today 2pm PT', bio: 'Helps you decide between cash now and managed sale per lot.' },
  { name: 'Maya Patel', role: 'Donation & Tax', avatarColor: '#0E9F6E', state: 'scheduled', nextAvailable: 'tomorrow 10am PT', bio: 'Tax-receipt strategist; 8283 thresholds and charity routing.' },
]

export const CONCIERGE_TIMELINE = [
  { id: 'CT-1', date: '2026-05-02', label: 'Sarah called you re: pickup window', kind: 'call', color: '#826DEE' },
  { id: 'CT-2', date: '2026-04-30', label: 'David texted you re: Tiffany authentication', kind: 'text', color: '#FFDB15' },
  { id: 'CT-3', date: '2026-04-25', label: 'Maya emailed you tax-receipt summary', kind: 'email', color: '#0E9F6E' },
  { id: 'CT-4', date: '2026-04-18', label: 'Welcome call — Sarah Chen', kind: 'call', color: '#826DEE' },
]

/* ═══════════════════════════════════════════════════════════════
   STATEMENTS
   ═══════════════════════════════════════════════════════════════ */

export interface Statement {
  id: string
  period: string
  generated: string
  net: number
  status: 'ready' | 'generating'
  downloadUrl?: string
}

export const STATEMENTS: Statement[] = [
  { id: 'STMT-2026-04', period: 'April 2026', generated: '2026-05-01', net: 9410, status: 'ready', downloadUrl: '#' },
  { id: 'STMT-2026-03', period: 'March 2026', generated: '2026-04-01', net: 6520, status: 'ready', downloadUrl: '#' },
  { id: 'STMT-2026-02', period: 'February 2026', generated: '2026-03-01', net: 4180, status: 'ready', downloadUrl: '#' },
]

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

export const SAFETY_COLOR: Record<SafetyLevel, string> = {
  green: '#0E9F6E',
  yellow: '#FFDB15',
  red: '#F94500',
}

export const SAFETY_GLYPH: Record<SafetyLevel, string> = {
  green: '✓',
  yellow: '!',
  red: '×',
}

export const RECEIPT_COLOR: Record<ReceiptKind, string> = {
  appraisal: '#826DEE',
  listing: '#FFDB15',
  price_drop: '#FF99DC',
  donation: '#0E9F6E',
  payout: '#0A0A0A',
  disposal: '#F94500',
  stop_sell: '#F94500',
  authentication: '#826DEE',
  storage: '#FF99DC',
}

export const RECEIPT_LABEL: Record<ReceiptKind, string> = {
  appraisal: 'Appraisal',
  listing: 'Listing',
  price_drop: 'Price Drop',
  donation: 'Donation',
  payout: 'Payout',
  disposal: 'Disposal',
  stop_sell: 'Stop-Sell',
  authentication: 'Authentication',
  storage: 'Storage',
}
