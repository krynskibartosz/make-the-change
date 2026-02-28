'use client'

import { Button } from '@make-the-change/core/ui'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from '@/i18n/navigation'
import { toggleFollowProducer, toggleFollowUser } from '@/lib/social/feed.actions'
import { cn } from '@/lib/utils'

type FollowToggleButtonProps = {
  targetType: 'user' | 'producer'
  targetId: string
  initialFollowing?: boolean
  className?: string
}

export function FollowToggleButton({
  targetType,
  targetId,
  initialFollowing = false,
  className,
}: FollowToggleButtonProps) {
  const t = useTranslations('community')
  const tNav = useTranslations('navigation')
  const { toast } = useToast()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = async () => {
    if (isSubmitting) {
      return
    }

    const previousState = isFollowing
    setIsFollowing(!previousState)
    setIsSubmitting(true)

    try {
      const nextState =
        targetType === 'user'
          ? await toggleFollowUser(targetId)
          : await toggleFollowProducer(targetId)

      setIsFollowing(nextState)
      router.refresh()
    } catch {
      setIsFollowing(previousState)
      toast({
        title: t('feed.login_required_title'),
        description: t('feed.login_required_description'),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            {tNav('login')}
          </Button>
        ),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleToggle}
      disabled={isSubmitting}
      variant={isFollowing ? 'outline' : 'default'}
      className={cn('rounded-full px-5', className)}
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        t('actions.following')
      ) : (
        t('actions.follow')
      )}
    </Button>
  )
}
