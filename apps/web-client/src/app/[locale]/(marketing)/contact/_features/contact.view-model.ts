import { getTranslations } from 'next-intl/server';
import type { ContactViewModel } from './contact.types';

export const buildContactViewModel = async (
    t: Awaited<ReturnType<typeof getTranslations>>
): Promise<ContactViewModel> => {
    return {
        hero: {
            badge: t('badge'),
            title: {
                line1: t('hero.title_line1'),
                highlight: t('hero.title_highlight'),
            },
            description: {
                line1: t('hero.description_line1'),
                line2: t('hero.description_line2'),
            },
        },
        cards: {
            email: {
                title: {
                    line1: t('email.title_line1'),
                    line2: t('email.title_line2'),
                },
                description: t('email.description'),
                copyLabel: t('email.copy_label'),
            },
            social: {
                title: t('social.title'),
                description: t('social.description'),
                links: [
                    {
                        iconName: 'Twitter',
                        label: t('social.twitter.label'),
                        handle: t('social.twitter.handle'),
                        url: 'https://x.com/makethechange',
                    },
                    {
                        iconName: 'Linkedin',
                        label: t('social.linkedin.label'),
                        handle: t('social.linkedin.handle'),
                        url: 'https://www.linkedin.com',
                    },
                    {
                        iconName: 'Instagram',
                        label: t('social.instagram.label'),
                        handle: t('social.instagram.handle'),
                        url: 'https://www.instagram.com/mtc_impact',
                    },
                ],
            },
            faq: {
                title: t('faq_card.title'),
                description: t('faq_card.description'),
                cta: t('faq_card.cta'),
            },
            office: {
                city: t('office.city'),
                label: t('office.label'),
                status: t('office.status'),
                coordinates: t('office.coordinates'),
            },
        },
        cta: {
            title: {
                line1: t('cta.title_line1'),
                line2: t('cta.title_line2'),
                line3: t('cta.title_line3'),
            },
            description: t('cta.description'),
            primary: t('cta.primary'),
        },
    };
};
