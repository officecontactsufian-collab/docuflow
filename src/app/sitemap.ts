
import { MetadataRoute } from 'next'

/**
 * @fileOverview Automated Multilingual Sitemap Generation
 * Generates SEO entries for all languages and core protocols.
 * Follows Google's cross-language link standards.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docflow.pro'
  const locales = ['en', 'fr', 'es', 'ar', 'zh', 'de', 'ja', 'pt', 'ru', 'it']
  
  const corePaths = [
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
    '/ai-studio',
    '/remove-background',
    '/remove-watermark',
    '/tools/ai-niche-finder',
    '/tools/ai-decision-helper',
    '/tools/ai-reality-check',
    '/tools/ai-life-simulator',
    '/tools/ai-skill-generator',
    '/tools/ai-personal-brain',
    '/tools/ai-prompt-improver',
    '/tools/ai-humanizer',
    '/tools/ai-content-repurposer'
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  corePaths.forEach((path) => {
    locales.forEach((locale) => {
      const url = `${baseUrl}/${locale}${path}`
      
      // Create alternates mapping for this specific path
      // This helps Google understand localized versions of the same content
      const languages: Record<string, string> = {}
      locales.forEach((l) => {
        languages[l] = `${baseUrl}/${l}${path}`
      })

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
        alternates: {
          languages
        }
      })
    })
  })

  return sitemapEntries
}
