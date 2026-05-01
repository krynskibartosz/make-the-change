export type BrandGuidelinePageSlug =
  | 'overview'
  | 'logo'
  | 'colors'
  | 'typography'
  | 'voice'
  | 'assets'

export interface BrandGuidelineNavItem {
  slug: BrandGuidelinePageSlug
  href: string
  labelKey: string
}

export interface BrandGuidelineNavGroup {
  id: string
  labelKey: 'foundation' | 'identity' | 'writing' | 'resources'
  items: readonly BrandGuidelinePageSlug[]
}

export interface BrandGuidelineTheme {
  heroClass: string
  headingClass: string
  paragraphClass: string
  quickLinkClass: string
  quickLinkHoverClass: string
  accentClass: string
}

export const BRAND_GUIDELINE_BASE_PATH = '/brand-guidelines'

export const getBrandGuidelinePath = (slug: BrandGuidelinePageSlug): string => {
  if (slug === 'overview') {
    return BRAND_GUIDELINE_BASE_PATH
  }

  return `${BRAND_GUIDELINE_BASE_PATH}/${slug}`
}

export const BRAND_GUIDELINE_NAV_ITEMS: readonly BrandGuidelineNavItem[] = [
  { slug: 'overview', href: BRAND_GUIDELINE_BASE_PATH, labelKey: 'overview' },
  { slug: 'logo', href: getBrandGuidelinePath('logo'), labelKey: 'logo' },
  { slug: 'colors', href: getBrandGuidelinePath('colors'), labelKey: 'colors' },
  {
    slug: 'typography',
    href: getBrandGuidelinePath('typography'),
    labelKey: 'typography',
  },
  { slug: 'voice', href: getBrandGuidelinePath('voice'), labelKey: 'voice' },
  { slug: 'assets', href: getBrandGuidelinePath('assets'), labelKey: 'assets' },
]

export const BRAND_GUIDELINE_NAV_GROUPS: readonly BrandGuidelineNavGroup[] = [
  { id: 'foundation', labelKey: 'foundation', items: ['overview'] },
  { id: 'identity', labelKey: 'identity', items: ['logo', 'colors', 'typography'] },
  { id: 'writing', labelKey: 'writing', items: ['voice'] },
  { id: 'resources', labelKey: 'resources', items: ['assets'] },
]

export const BRAND_GUIDELINE_NAV_ITEM_BY_SLUG = Object.fromEntries(
  BRAND_GUIDELINE_NAV_ITEMS.map((item) => [item.slug, item]),
) as Record<BrandGuidelinePageSlug, BrandGuidelineNavItem>

export const BRAND_GUIDELINE_PAGE_THEMES: Record<BrandGuidelinePageSlug, BrandGuidelineTheme> = {
  overview: {
    heroClass: 'bg-marketing-positive-600',
    headingClass: 'text-marketing-overlay-light',
    paragraphClass: 'text-marketing-positive-100',
    quickLinkClass: 'text-marketing-overlay-light border-marketing-overlay-light/30',
    quickLinkHoverClass: 'hover:bg-marketing-overlay-light/10',
    accentClass: 'text-marketing-positive-300',
  },
  logo: {
    heroClass: 'bg-marketing-surface-strong',
    headingClass: 'text-marketing-overlay-light',
    paragraphClass: 'text-marketing-positive-100',
    quickLinkClass: 'text-marketing-overlay-light border-marketing-overlay-light/25',
    quickLinkHoverClass: 'hover:bg-marketing-overlay-light/10',
    accentClass: 'text-marketing-positive-300',
  },
  colors: {
    heroClass: 'bg-marketing-warning-400',
    headingClass: 'text-marketing-neutral-900',
    paragraphClass: 'text-marketing-neutral-700',
    quickLinkClass: 'text-marketing-neutral-900 border-marketing-neutral-900/30',
    quickLinkHoverClass: 'hover:bg-marketing-neutral-900/5',
    accentClass: 'text-marketing-neutral-700',
  },
  typography: {
    heroClass: 'bg-marketing-info-500',
    headingClass: 'text-marketing-overlay-light',
    paragraphClass: 'text-marketing-overlay-light/90',
    quickLinkClass: 'text-marketing-overlay-light border-marketing-overlay-light/30',
    quickLinkHoverClass: 'hover:bg-marketing-overlay-light/10',
    accentClass: 'text-marketing-info-100',
  },
  voice: {
    heroClass: 'bg-marketing-warning-500',
    headingClass: 'text-marketing-neutral-900',
    paragraphClass: 'text-marketing-neutral-700',
    quickLinkClass: 'text-marketing-neutral-900 border-marketing-neutral-900/30',
    quickLinkHoverClass: 'hover:bg-marketing-neutral-900/5',
    accentClass: 'text-marketing-neutral-700',
  },
  assets: {
    heroClass: 'bg-marketing-accent-alt-500',
    headingClass: 'text-marketing-overlay-light',
    paragraphClass: 'text-marketing-overlay-light/90',
    quickLinkClass: 'text-marketing-overlay-light border-marketing-overlay-light/30',
    quickLinkHoverClass: 'hover:bg-marketing-overlay-light/10',
    accentClass: 'text-marketing-accent-alt-200',
  },
}

const normalizePath = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export const isBrandGuidelineActivePath = (pathname: string, href: string): boolean => {
  const normalizedPathname = normalizePath(pathname)
  const normalizedHref = normalizePath(href)

  if (normalizedHref === BRAND_GUIDELINE_BASE_PATH) {
    return normalizedPathname === normalizedHref
  }

  return (
    normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`)
  )
}

export const resolveBrandGuidelineSlugFromPath = (pathname: string): BrandGuidelinePageSlug => {
  const normalizedPathname = normalizePath(pathname)

  const foundItem = BRAND_GUIDELINE_NAV_ITEMS.find((item) =>
    isBrandGuidelineActivePath(normalizedPathname, item.href),
  )

  return foundItem?.slug ?? 'overview'
}
