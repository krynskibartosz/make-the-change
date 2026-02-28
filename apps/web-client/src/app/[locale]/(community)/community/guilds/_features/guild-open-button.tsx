'use client'

import { Button } from '@make-the-change/core/ui'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type GuildOpenButtonProps = {
  guildSlug: string
}

export function GuildOpenButton({ guildSlug }: GuildOpenButtonProps) {
  const t = useTranslations('community')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Button asChild variant="outline" className="w-full" onClick={handleClick}>
      <Link href={`/community/guilds/${guildSlug}`} prefetch={false}>
        {t('guilds.open')}
      </Link>
    </Button>
  )
}
