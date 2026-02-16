import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') ||
    'https://soundeffectpro.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/upload', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
