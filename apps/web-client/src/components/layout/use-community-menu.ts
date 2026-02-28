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
              title: tNavigation('leaderboard'),
              href: '/leaderboard',
              image:
                'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: tFooter('community_trending'),
              href: '/community?sort=best',
              image:
                'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: tFooter('community_guilds'),
              href: '/community/guilds',
              image:
                'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: tFooter('community_hashtags'),
              href: '/community/hashtags',
              image:
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: tFooter('community_publish'),
              href: '/community/posts/new',
              image:
                'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
            },
          ],
        },
      ],
      footerLinks: [
        {
          title: tNavigation('community'),
          href: '/community',
        },
        {
          title: tNavigation('leaderboard'),
          href: '/leaderboard',
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
