import { MetadataRoute } from 'next'

/**
 * @fileOverview Robots Exclusion Protocol
 * Optimizes crawler visibility while securing administrative entry points.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard', '/admin-login'],
    },
    sitemap: 'https://docflow.pro/sitemap.xml',
  }
}
