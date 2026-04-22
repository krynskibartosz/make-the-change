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

export type AboutPillarEntry = {
  title: string
  description: string
}

export type AboutPillarsProps = {
  overline: string
  engagement: AboutPillarEntry
  swarm: AboutPillarEntry
  impact: AboutPillarEntry
}

export type AboutViewModel = {
  hero: AboutHeroProps
  genesis: AboutGenesisProps
  model: AboutModelProps
  team: AboutTeamProps
  letter: AboutLetterProps
  cta: AboutCtaProps
}
