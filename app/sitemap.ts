import { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') ||
  'https://soundeffectpro.com'

function escapeXml(url: string) {
  return url
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
}

/* ---------- TYPES ---------- */

interface Sound {
  slug: string
  s_id: string
  updatedAt?: string
  createdAt: string
}

interface Soundboard {
  slug: string
  sb_id: string
  updatedAt?: string
  createdAt: string
}

interface User {
  uid: string
  name: string
}

interface Category {
  slug: string
  updatedAt?: string
  createdAt: string
}

interface ApiResponse {
  sounds: Sound[]
  soundboards: Soundboard[]
  users: User[]
  category: Category[]
}

/* ---------- FETCH DATA ---------- */

async function getData(): Promise<ApiResponse> {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/sitemap'
      : `${BASE_URL}/api/sitemap`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch sitemap data')

  return res.json()
}

/* ---------- SITEMAP ---------- */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { sounds, soundboards, users, category } = await getData()

  const soundPages = sounds.map((s) => ({
    url: escapeXml(`${BASE_URL}/${s.slug}-${s.s_id}`),
    lastModified: new Date(s.updatedAt ?? s.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const soundboardPages = soundboards.map((sb) => ({
    url: escapeXml(`${BASE_URL}/soundboard/${sb.slug}-${sb.sb_id}`),
    lastModified: new Date(sb.updatedAt ?? sb.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages = category.map((c) => ({
    url: escapeXml(`${BASE_URL}/category/${c.slug}`),
    lastModified: new Date(c.updatedAt ?? c.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const userPages = users.map((u) => ({
    url: escapeXml(
      `${BASE_URL}/user/${u.uid}?name=${encodeURIComponent(u.name)}`
    ),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const periods = ['week', 'month', 'halfyear']
  const fields = ['views', 'likes', 'downloads']

  const filterButtonsPages = periods.flatMap((period) =>
    fields.map((field) => ({
      url: escapeXml(`${BASE_URL}/filter-buttons?period=${period}&field=${field}`),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  )

  const filterBoardsPages = periods.map((period) => ({
    url: escapeXml(`${BASE_URL}/soundboard/filter-board?period=${period}&field=views`),
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const coreRoutes = [
    '',
    '/popular',
    '/recent-buttons',
    '/most-viewed',
    '/soundboard',
    '/contact',
    '/soundboard/popular',
    '/page/privacy-policy',
    '/page/terms-conditions',
    '/page/dmca-copyright',
    '/page/cookie-policy',
    '/page/community-guidelines',
  ]

  const corePages = coreRoutes.map((route) => ({
    url: escapeXml(`${BASE_URL}${route}`),
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  return [
    ...corePages,
    ...soundPages,
    ...soundboardPages,
    ...categoryPages,
    ...userPages,
    ...filterButtonsPages,
    ...filterBoardsPages,
  ]
}
