
import { MetadataRoute } from 'next'

/**
 * @fileOverview Robots Exclusion Protocol
 * Optimizes crawler visibility while securing administrative entry points.
 * Explicitly allows all core localized paths.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/en/', '/fr/', '/es/', '/ar/', '/zh/', '/de/', '/ja/', '/pt/', '/ru/', '/it/'
      ],
      disallow: [
        '/admin-dashboard', 
        '/admin-login', 
        '/dashboard', 
        '/*/dashboard',
        '/api/',
        '/_next/'
      ],
    },
    sitemap: 'https://docflow.pro/sitemap.xml',
  }
}
