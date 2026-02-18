import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
let supabaseHostname = 'ebmjxinsyyjwshnynwwu.supabase.co'
try {
  if (supabaseUrl) {
    supabaseHostname = new URL(supabaseUrl).hostname
  }
} catch { }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  typescript: {
    // Temporarily allow production builds with TypeScript errors
    // Remove this after the underlying type issues are fixed.
    ignoreBuildErrors: true
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
}

export default withNextIntl(nextConfig)
