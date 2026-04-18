import type { getTranslations } from 'next-intl/server'
import type { AboutViewModel } from './about.types'

export const buildAboutViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<AboutViewModel> => {
  return {
    hero: {
      overline: t('hero.overline'),
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      imageAlt: t('hero.imageAlt'),
    },
    pillars: {
      overline: t('pillars.overline'),
      engagement: {
        title: t('pillars.engagement.title'),
        description: t('pillars.engagement.description'),
      },
      swarm: {
        title: t('pillars.swarm.title'),
        description: t('pillars.swarm.description'),
      },
      impact: {
        title: t('pillars.impact.title'),
        description: t('pillars.impact.description'),
      },
    },
    team: {
      title: t('team.title'),
      subtitle: t('team.subtitle'),
      members: [
        {
          name: t('team.gregory.name'),
          role: t('team.gregory.role'),
          quote: t('team.gregory.quote'),
          photoSrc: '/team/greg.png',
          linkedinUrl: t('team.gregory.linkedinUrl'),
          linkedinLabel: t('team.gregory.linkedinLabel'),
        },
        {
          name: t('team.bartosz.name'),
          role: t('team.bartosz.role'),
          quote: t('team.bartosz.quote'),
          photoSrc: '/team/bart.png',
          linkedinUrl: t('team.bartosz.linkedinUrl'),
          linkedinLabel: t('team.bartosz.linkedinLabel'),
        },
      ],
    },
    letter: {
      body: t('letter.body'),
      signature: t('letter.signature'),
    },
    cta: {
      label: t('cta.label'),
    },
  }
}
