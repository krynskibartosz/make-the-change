import { locales } from '@make-the-change/core/i18n'
import type { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/static'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app'
  const supabase = createStaticClient()

  // Base routes to include in sitemap
  const routes = [
    '',
    '/about',
    '/projects',
    '/products',
    '/how-it-works',
    '/login',
    '/register',
    '/blog',
  ]

  // Fetch active projects
  const { data: projects } = await supabase
    .schema('investment')
    .from('projects')
    .select('slug, id, updated_at')
    .eq('status', 'active')

  // Fetch active products
  const { data: products } = await supabase
    .schema('commerce')
    .from('products')
    .select('slug, id, updated_at')
    .eq('is_active', true)

  // Fetch published blog posts
  const { data: posts } = await supabase
    .schema('content')
    .from('blog_posts')
    .select('slug, id, published_at')
    .eq('status', 'published')

  const sitemapEntry: MetadataRoute.Sitemap = []

  // 1. Static Routes
  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntry.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // 2. Dynamic Projects
  if (projects) {
    projects.forEach((project) => {
      const slugOrId = project.slug || project.id
      locales.forEach((locale) => {
        sitemapEntry.push({
          url: `${baseUrl}/${locale}/projects/${slugOrId}`,
          lastModified: new Date(project.updated_at || new Date()),
          changeFrequency: 'daily',
          priority: 0.9,
        })
      })
    })
  }

  // 3. Dynamic Products
  if (products) {
    products.forEach((product) => {
      const slugOrId = product.slug || product.id
      locales.forEach((locale) => {
        sitemapEntry.push({
          url: `${baseUrl}/${locale}/products/${slugOrId}`,
          lastModified: new Date(product.updated_at || new Date()),
          changeFrequency: 'daily',
          priority: 0.9,
        })
      })
    })
  }

  // 4. Dynamic Blog Posts
  if (posts) {
    posts.forEach((post) => {
      const slugOrId = post.slug || post.id
      // Use published_at as last modified if updated_at is not available, or just use published_at
      // The blog_posts schema we saw had published_at but not explicitly updated_at in the SELECT const,
      // though it likely exists. Let's strictly use what we saw: published_at.
      const date = post.published_at ? new Date(post.published_at) : new Date()

      locales.forEach((locale) => {
        sitemapEntry.push({
          url: `${baseUrl}/${locale}/blog/${slugOrId}`,
          lastModified: date,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    })
  }

  return sitemapEntry
}
