'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import type { MegaMenuContent } from '@/components/layout/mega-menu'

export function useCommunityMenu() {
  const tNavigation = useTranslations('navigation')
  const tFooter = useTranslations('footer')

  const communityMenu = useMemo<MegaMenuContent>(() => {
    const fallbackCommunityMenu: MegaMenuContent = {
      title: tNavigation('community'),
      sections: [
        {
          title: tNavigation('explore_section'),
          items: [
            {
              title: tFooter('community_trending'),
              href: '/community?sort=best',
              image:
                'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=400',
            },
          ],
        },
      ],
      footerLinks: [
        {
          title: tNavigation('community'),
          href: '/community',
        },
      ],
      featured: {
        title: tNavigation('community'),
        description: tFooter('community_trending'),
        image:
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
        href: '/community',
        ctaLabel: tFooter('community_publish'),
      },
    }

    return fallbackCommunityMenu
  }, [tFooter, tNavigation])

  return communityMenu
}
