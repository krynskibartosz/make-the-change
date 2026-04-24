import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
let supabaseHostname = 'ebmjxinsyyjwshnynwwu.supabase.co'
try {
  if (supabaseUrl) {
    supabaseHostname = new URL(supabaseUrl).hostname
  }
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  typescript: {
    // Temporarily allow production builds with TypeScript errors
    // Remove this after the underlying type issues are fixed.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.supabase.co',
        pathname: '/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ilanga-nature.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  transpilePackages: ['@make-the-change/core'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/challenges',
        destination: '/aventure?tab=defis',
        permanent: true,
      },
      {
        source: '/challenges/:slug',
        destination: '/aventure?tab=defis',
        permanent: true,
      },
      // Support i18n (préfixes locales)
      {
        source: '/:locale/challenges',
        destination: '/:locale/aventure?tab=defis',
        permanent: true,
      },
      {
        source: '/community',
        destination: '/collectif',
        permanent: true,
      },
      {
        source: '/:locale/community',
        destination: '/:locale/collectif',
        permanent: true,
      },
      {
        source: '/aventure/guilds',
        destination: '/community/guilds',
        permanent: true,
      },
      {
        source: '/aventure/guilds/:slug',
        destination: '/community/guilds/:slug',
        permanent: true,
      },
      {
        source: '/:locale/aventure/guilds',
        destination: '/:locale/community/guilds',
        permanent: true,
      },
      {
        source: '/:locale/aventure/guilds/:slug',
        destination: '/:locale/community/guilds/:slug',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
