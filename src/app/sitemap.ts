import type { MetadataRoute } from 'next'

const PUBLIC_PATHS = [
  '/',
  '/how-it-works',
  '/services',
  '/authentication',
  '/scenarios',
  '/pricing',
  '/faq',
  '/about',
  '/contact',
  '/request-walkthrough',
  '/partners',
  '/for/families',
  '/for/realtors',
  '/for/attorneys',
  '/legal/privacy',
  '/legal/terms',
  '/legal/seller-agreement',
  '/legal/buyer-terms',
  '/legal/fee-disclosure',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://auction-repo.vercel.app'
  const now = new Date()
  return PUBLIC_PATHS.map(p => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p === '/' ? 1.0 : p === '/request-walkthrough' ? 0.9 : 0.7,
  }))
}
