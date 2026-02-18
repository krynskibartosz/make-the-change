import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { placeholderImages } from '@/lib/placeholder-images'
import { MegaMenuContent } from '@/components/layout/mega-menu'

export function useDiscoverMenu() {
    const t = useTranslations('navigation')

    const discoverMenu = useMemo<MegaMenuContent>(() => {
        const fallbackDiscoverMenu: MegaMenuContent = {
            title: t('discover_menu.title'),
            sections: [
                {
                    title: t('discover_menu.sections.concept'),
                    items: [
                        {
                            title: t('discover_menu.items.mission'),
                            href: '/about',
                            image:
                                'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.producers'),
                            href: '/producers',
                            image:
                                'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.pricing'),
                            href: '/pricing',
                            image:
                                'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
                        },
                    ],
                },
                {
                    title: t('discover_menu.sections.experience'),
                    items: [
                        {
                            title: t('discover_menu.items.challenges'),
                            href: '/challenges',
                            image:
                                'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.leaderboard'),
                            href: '/leaderboard',
                            image:
                                'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.biodex'),
                            href: '/biodex',
                            image:
                                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
                        },
                    ],
                },
                {
                    title: t('discover_menu.sections.help_resources'),
                    items: [
                        {
                            title: t('discover_menu.items.blog'),
                            href: '/blog',
                            image:
                                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.faq'),
                            href: '/faq',
                            image:
                                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.contact'),
                            href: '/contact',
                            image:
                                'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.privacy'),
                            href: '/privacy',
                            image:
                                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
                        },
                        {
                            title: t('discover_menu.items.terms'),
                            href: '/terms',
                            image:
                                'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400',
                        },
                    ],
                },
            ],
            featured: {
                title: t('discover_menu.featured.title'),
                description: t('discover_menu.featured.description'),
                image:
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5763?auto=format&fit=crop&q=80&w=600',
                href: '/projects',
                ctaLabel: t('discover_menu.featured.cta'),
            },
        }

        const brandGuidelinesItem = {
            title: t('brand_guidelines'),
            href: '/brand-guidelines',
            image: placeholderImages.categories.default,
        }

        const baseDiscoverMenu = fallbackDiscoverMenu
        const alreadyInDiscover = baseDiscoverMenu.sections.some((section) =>
            section.items.some((item) => item.href === '/brand-guidelines'),
        )

        return alreadyInDiscover
            ? baseDiscoverMenu
            : {
                ...baseDiscoverMenu,
                sections:
                    baseDiscoverMenu.sections.length > 0
                        ? baseDiscoverMenu.sections.map((section, index, sections) =>
                            index === sections.length - 1
                                ? { ...section, items: [...section.items, brandGuidelinesItem] }
                                : section,
                        )
                        : [
                            {
                                title: t('discover_menu.sections.help_resources'),
                                items: [brandGuidelinesItem],
                            },
                        ],
            }
    }, [t])

    return discoverMenu
}
