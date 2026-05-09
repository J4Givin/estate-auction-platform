import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/*', '/ops', '/ops/*', '/qa', '/qa/*', '/portal', '/portal/*', '/partner', '/partner/*', '/api/*'] },
    ],
    sitemap: 'https://auction-repo.vercel.app/sitemap.xml',
  }
}
