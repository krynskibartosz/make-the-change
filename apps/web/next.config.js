import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
let supabaseHostname = 'ebmjxinsyyjwshnynwwu.supabase.co'
try {
  if (supabaseUrl) {
    supabaseHostname = new URL(supabaseUrl).hostname
  }
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactCompiler: true,
  experimental: {
  },
  turbopack: {}, // Enable Turbopack builds (beta)
  typedRoutes: true, // Type-safe routing

  // Exclude test files from pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(
    (ext) => !['test', 'spec', 'setup'].includes(ext.split('.')[0]),
  ),

  // Existing configuration
  transpilePackages: ['@make-the-change/core'],

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Image optimizations (15.3+ improvements)
  images: {
    formats: ['image/avif', 'image/webp'],
    // Activer l'optimisation pour de meilleures performances
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ilanga-nature.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }

    // Exclude test files from build
    config.module.rules.push({
      test: /\.test\.|\.spec\.|\.setup\./,
      loader: 'ignore-loader',
    })

    return config
  },
}

export default withNextIntl(nextConfig)
