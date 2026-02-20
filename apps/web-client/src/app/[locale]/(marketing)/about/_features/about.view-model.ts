import { getTranslations } from 'next-intl/server';
import type { AboutViewModel } from './about.types';

export const buildAboutViewModel = async (
    t: Awaited<ReturnType<typeof getTranslations>>
): Promise<AboutViewModel> => {
    return {
        hero: {
            badge: t('hero.badge'),
            title: t('title'),
            intro: t('intro'),
            cards: {
                global: {
                    title: t('hero.cards.global.title'),
                    subtitle: t('hero.cards.global.subtitle'),
                },
                nature: t('hero.cards.nature'),
                social: t('hero.cards.social'),
            },
        },
        mission: {
            title: t('mission.title'),
            heading: {
                line1: t('mission.heading.line1'),
                highlight: t('mission.heading.highlight'),
            },
            description: t('mission.description'),
            metrics: {
                transparency: t('mission.metrics.transparency'),
                activeProjects: t('mission.metrics.active_projects'),
            },
            community: {
                title: t('mission.community.title'),
                description: t('mission.community.description'),
            },
            imageAlt: t('mission.image_alt'),
        },
        values: {
            sectionBadge: t('values.section_badge'),
            sectionHeading: {
                line1: t('values.section_heading.line1'),
                highlight: t('values.section_heading.highlight'),
            },
            sectionDescription: t('values.section_description'),
            impact: {
                title: t('values.impact.title'),
                description: t('values.impact.description'),
                metricLabel: t('values.impact.metric_label'),
            },
            transparency: {
                title: t('values.transparency.title'),
                description: t('values.transparency.description'),
                verifiedLabel: t('values.transparency.verified_label'),
            },
            community: {
                title: t('values.community.title'),
                description: t('values.community.description'),
            },
            innovation: {
                title: t('values.innovation.title'),
                description: t('values.innovation.description'),
                badges: {
                    ai: t('values.innovation.badges.ai'),
                    iot: t('values.innovation.badges.iot'),
                },
            },
        },
        team: {
            title: t('team.title'),
            subtitle: t('team.subtitle'),
            gregory: {
                role: t('team.gregory.role'),
                badge: t('team.gregory.badge'),
                quote: t('team.gregory.quote'),
                bio: t('team.gregory.bio'),
            },
            bartosz: {
                role: t('team.bartosz.role'),
                badge: t('team.bartosz.badge'),
                quote: t('team.bartosz.quote'),
                bio: t('team.bartosz.bio'),
            },
        },
        cta: {
            badge: t('cta.badge'),
            title: {
                line1: t('cta.title.line1'),
                line2: t('cta.title.line2'),
            },
            description: t('cta.description'),
            primary: t('cta.primary'),
            secondary: t('cta.secondary'),
        },
    };
};
