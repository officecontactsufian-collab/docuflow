import { MetadataRoute } from 'next'

/**
 * @fileOverview Automated Sitemap Generation Protocol
 * Indexes all public document transformation routes for SEO optimization.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docflow.pro'
  
  const coreProtocols = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/merge',
    '/split',
    '/compress',
    '/organize',
    '/analyze',
    '/numbers',
    '/sign',
    '/protect',
    '/convert',
    '/scan-to-pdf',
    '/repair',
    '/watermark'
  ]

  return coreProtocols.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
