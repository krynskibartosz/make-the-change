export type ContactSocialLink = {
  iconName: 'Twitter' | 'Linkedin' | 'Instagram'
  label: string
  handle: string
  url: string
}

export type ContactHeroProps = {
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

export type ContactCardsProps = {
  email: {
    title: {
      line1: string
      line2: string
    }
    description: string
    copyLabel: string
  }
  social: {
    title: string
    description: string
    links: ContactSocialLink[]
  }
  faq: {
    title: string
    description: string
    cta: string
  }
  office: {
    city: string
    label: string
    status: string
    coordinates: string
  }
}

export type ContactCtaProps = {
  title: {
    line1: string
    line2: string
    line3: string
  }
  description: string
  primary: string
}

export type ContactViewModel = {
  hero: ContactHeroProps
  cards: ContactCardsProps
  cta: ContactCtaProps
}
