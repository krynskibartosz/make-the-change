'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from '@make-the-change/core/ui'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link, useRouter } from '@/i18n/navigation'
import { createPost } from '@/lib/social/feed.actions'

export function CreatePostPageClient() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('community')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = content.trim()
    if (!trimmed) {
      return
    }

    setIsSubmitting(true)
    try {
      const post = await createPost(trimmed)
      toast({
        title: t('create_post.success_title'),
        description: t('create_post.success_description'),
      })

      if (post?.id) {
        router.push(`/community/posts/${post.id}`)
      } else {
        router.push('/community')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : null
      toast({
        title: t('create_post.error_title'),
        description: errorMessage || t('create_post.error_description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t('create_post.heading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={t('create_post.placeholder')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[180px]"
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link href="/community">{t('actions.cancel')}</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !content.trim()} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('create_post.publishing')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('create_post.publish')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
