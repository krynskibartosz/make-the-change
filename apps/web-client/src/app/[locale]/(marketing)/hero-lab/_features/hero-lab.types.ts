import type { HomeHeroStat } from '@/app/[locale]/(marketing)/(home)/_features/home.view-model'

export type HeroLabVariant = 'v1' | 'v2' | 'v3'

export type HeroLabLocale = 'fr' | 'en' | 'nl'

export type HeroVariantCopy = {
  badge: string
  title: string
  subtitle: string
  microProof: string
}

export type HeroLabNavLabels = {
  title: string
  index: string
  farmMinerals: string
  v1: string
  v3: string
  awwwards: string
  home: string
}

export type HeroLabIndexLabels = {
  eyebrow: string
  title: string
  description: string
  openHome: string
}

export type HeroLabVariantCard = {
  id: string
  href: string
  cta: string
  title: string
  summary: string
}

export type HeroLabCopy = {
  nav: HeroLabNavLabels
  index: HeroLabIndexLabels
  cards: HeroLabVariantCard[]
  variants: Record<HeroLabVariant, HeroVariantCopy>
}

export type HeroContextualCta = {
  href: string
  label: string
}

export type HeroVariantProps = {
  copy: HeroVariantCopy
  secondaryCtaLabel: string
  heroContextualCta: HeroContextualCta
  heroStats: HomeHeroStat[]
}
