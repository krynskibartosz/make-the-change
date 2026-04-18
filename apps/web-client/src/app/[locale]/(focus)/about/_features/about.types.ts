export type AboutHeroProps = {
  overline: string
  title: string
  subtitle: string
  imageAlt: string
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

export type AboutViewModel = {
  hero: AboutHeroProps
  pillars: AboutPillarsProps
  team: AboutTeamProps
  letter: AboutLetterProps
  cta: AboutCtaProps
}
