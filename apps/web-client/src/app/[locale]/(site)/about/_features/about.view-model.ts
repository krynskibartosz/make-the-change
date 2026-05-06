import type { getTranslations } from 'next-intl/server'
import type { AboutViewModel } from './about.types'

export async function buildAboutViewModel(
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<AboutViewModel> {
  return {
    hero: {
      overline: t('hero.overline'),
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      imageAlt: t('hero.imageAlt'),
    },
    genesis: {
      title: t('genesis.title'),
      paragraph1: t('genesis.paragraph1'),
      paragraph2: t('genesis.paragraph2'),
      paragraph3: t('genesis.paragraph3'),
    },
    model: {
      overline: t('model.overline'),
      gamification: {
        title: t('model.gamification.title'),
        description: t('model.gamification.description'),
      },
      circular: {
        title: t('model.circular.title'),
        description: t('model.circular.description'),
      },
      transparency: {
        title: t('model.transparency.title'),
        description: t('model.transparency.description'),
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
    fieldProof: {
      title: t('field_proof.title'),
      description: t('field_proof.description'),
      projects: {
        apiculture: t('field_proof.projects.apiculture'),
        corals: t('field_proof.projects.corals'),
        olives: t('field_proof.projects.olives'),
        partners: t('field_proof.projects.partners'),
      },
    },
    timeline: {
      overline: t('timeline.overline'),
      title: t('timeline.title'),
      events: {
        y2019: t('timeline.events.y2019'),
        y2021: t('timeline.events.y2021'),
        y2023: t('timeline.events.y2023'),
        y2025: t('timeline.events.y2025'),
        y2026: t('timeline.events.y2026'),
      },
    },
  }
}
