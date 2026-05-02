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
