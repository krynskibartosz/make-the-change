export type PrivacyHeroProps = {
  badge: string
  title: {
    line1: string
    highlight: string
  }
  description: {
    line1: string
    line2: string
  }
}

export type PrivacyCardsProps = {
  minimalCollection: {
    title: string
    description: string
  }
  dataOwnership: {
    title: string
    description: string
    guarantee: string
  }
  security: {
    title: string
    description: string
  }
  contact: {
    title: string
    description: string
    cta: string
  }
}

export type PrivacyViewModel = {
  hero: PrivacyHeroProps
  cards: PrivacyCardsProps
}
