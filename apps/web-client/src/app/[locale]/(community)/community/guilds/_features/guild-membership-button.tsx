'use client'

import { Button } from '@make-the-change/core/ui'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from '@/i18n/navigation'
import { joinGuild, leaveGuild } from '@/lib/social/feed.actions'

type GuildMembershipButtonProps = {
  guildId: string
  isMember: boolean
}

export function GuildMembershipButton({ guildId, isMember }: GuildMembershipButtonProps) {
  const t = useTranslations('community')
  const { toast } = useToast()
  const router = useRouter()
  const [pendingState, setPendingState] = useState(isMember)
  const [isPending, startTransition] = useTransition()

  const handleToggleMembership = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    startTransition(async () => {
      try {
        if (pendingState) {
          await leaveGuild(guildId)
          setPendingState(false)
          toast({
            title: t('guilds.leave_success_title'),
            description: t('guilds.leave_success_description'),
          })
        } else {
          await joinGuild(guildId)
          setPendingState(true)
          toast({
            title: t('guilds.join_success_title'),
            description: t('guilds.join_success_description'),
          })
        }
        router.refresh()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : t('guilds.membership_error_description')
        toast({
          title: t('guilds.membership_error_title'),
          description: message,
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Button
      type="button"
      className="w-full"
      variant={pendingState ? 'outline' : 'default'}
      disabled={isPending}
      onClick={handleToggleMembership}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('guilds.membership_loading')}
        </>
      ) : pendingState ? (
        t('guilds.leave')
      ) : (
        t('guilds.join')
      )}
    </Button>
  )
}
