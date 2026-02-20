export interface MegaMenuItem {
  title: string
  image: string
  href: string
  badge?: string
}

export interface MegaMenuSection {
  title: string
  items: MegaMenuItem[]
}

export interface MegaMenuCategory {
  title: string
  eyebrow?: string
  sections: MegaMenuSection[]
  featured?: {
    title: string
    image: string
    href: string
    ctaLabel: string
  }
}

export interface MainMenuStructure {
  projects: MegaMenuCategory
  products: MegaMenuCategory
  discover: MegaMenuCategory
  [key: string]: MegaMenuCategory // Flexible for future additions
}

export interface HomePageContent {
  hero: {
    badge: string
    title: string
    subtitle: string
    cta_primary: string
    cta_secondary: string
  }
  stats: {
    projects: string
    members: string
    global_impact: string
    points_generated: string
    points_label: string
  }
  universe: {
    title: string
    description: string
    cards: {
      projects: UniverseCard
      products: UniverseCard
      community: UniverseCard
    }
  }
  features: {
    title: string
    invest: FeatureItem
    earn: FeatureItem
    redeem: FeatureItem
    explore: string
  }
  cta: {
    title: string
    description: string
    button: string
    stats: {
      engagement: string
      transparency: string
      community: string
    }
  }
  partners?: {
    title: string
    description: string
  }
  blog?: {
    title: string
  }
}

interface UniverseCard {
  title: string
  description: string
  badge?: string
  cta: string
  image?: string
}

interface FeatureItem {
  title: string
  description: string
}
