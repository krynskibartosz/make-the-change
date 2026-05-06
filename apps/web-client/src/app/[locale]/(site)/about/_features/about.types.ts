export type AboutHeroProps = {
  overline: string
  title: string
  subtitle: string
  imageAlt: string
}

export type AboutGenesisProps = {
  title: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
}

export type AboutModelBlock = {
  title: string
  description: string
}

export type AboutModelProps = {
  overline: string
  gamification: AboutModelBlock
  circular: AboutModelBlock
  transparency: AboutModelBlock
}

export type AboutTeamMember = {
  name: string
  role: string
  quote: string
  photoSrc: string
  linkedinUrl: string
  linkedinLabel: string
}

export type AboutTeamProps = {
  title: string
  subtitle: string
  members: AboutTeamMember[]
}

export type AboutLetterProps = {
  body: string
  signature: string
}

export type AboutCtaProps = {
  label: string
}

export type AboutFieldProofProps = {
  title: string
  description: string
  projects: {
    apiculture: string
    corals: string
    olives: string
    partners: string
  }
}

export type AboutTimelineProps = {
  overline: string
  title: string
  events: {
    y2019: string
    y2021: string
    y2023: string
    y2025: string
    y2026: string
  }
}

export type AboutViewModel = {
  hero: AboutHeroProps
  genesis: AboutGenesisProps
  model: AboutModelProps
  team: AboutTeamProps
  letter: AboutLetterProps
  cta: AboutCtaProps
  fieldProof: AboutFieldProofProps
  timeline: AboutTimelineProps
}
