import { getTranslations } from 'next-intl/server';
import type { TermsViewModel } from './terms.types';

export const buildTermsViewModel = async (
    t: Awaited<ReturnType<typeof getTranslations>>
): Promise<TermsViewModel> => {
    return {
        hero: {
            badge: t('badge'),
            title: t('title'),
            description: t('description'),
        },
        content: {
            acceptance: {
                title: t('sections.acceptance.title'),
                content: t('sections.acceptance.content'),
            },
            evolution: {
                title: t('sections.evolution.title'),
                content: t('sections.evolution.content'),
            },
            contact: {
                title: t('sections.contact.title'),
                content: t('sections.contact.content'),
                cta: t('sections.contact.cta'),
            },
        }
    };
};
