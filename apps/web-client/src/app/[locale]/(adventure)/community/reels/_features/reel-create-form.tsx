'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from '@make-the-change/core/ui'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link, useRouter } from '@/i18n/navigation'
import { createVideoPost } from '@/lib/social/feed.actions'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const MAX_REEL_VIDEO_SIZE_BYTES = 100 * 1024 * 1024
const MAX_REEL_DURATION_SECONDS = 60
const EMPTY_CAPTION_TRACK = 'data:text/vtt;charset=utf-8,WEBVTT'

type VideoMetadata = {
  durationSeconds: number
  width: number
  height: number
}

const readVideoMetadata = (fileUrl: string): Promise<VideoMetadata> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve({
        durationSeconds: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      })
    }
    video.onerror = () => reject(new Error('Impossible de lire la vidéo'))
    video.src = fileUrl
  })

const toSafeFileName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/[^\dA-Za-z.-]/g, '-')
    .replaceAll(/-+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')

export function ReelCreateForm() {
  const t = useTranslations('community')
  const { toast } = useToast()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [caption, setCaption] = useState('')
  const [hashtagsInput, setHashtagsInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const validateFile = (nextFile: File) => {
    if (nextFile.type !== 'video/mp4') {
      throw new Error(t('reels.validation_type'))
    }

    if (nextFile.size > MAX_REEL_VIDEO_SIZE_BYTES) {
      throw new Error(t('reels.validation_size'))
    }
  }

  const handleFileChange = async (nextFile: File | null) => {
    if (!nextFile) {
      return
    }

    try {
      validateFile(nextFile)
      const objectUrl = URL.createObjectURL(nextFile)
      const nextMetadata = await readVideoMetadata(objectUrl)
      if (nextMetadata.durationSeconds > MAX_REEL_DURATION_SECONDS) {
        URL.revokeObjectURL(objectUrl)
        throw new Error(t('reels.validation_duration'))
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setFile(nextFile)
      setPreviewUrl(objectUrl)
      setMetadata(nextMetadata)
    } catch (error) {
      const message = error instanceof Error ? error.message : t('reels.validation_default')
      toast({
        title: t('reels.validation_error_title'),
        description: message,
        variant: 'destructive',
      })
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] || null
    event.target.value = ''
    void handleFileChange(nextFile)
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragActive(false)
    const nextFile = event.dataTransfer.files?.[0] || null
    void handleFileChange(nextFile)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file || !metadata) {
      toast({
        title: t('reels.validation_error_title'),
        description: t('reels.validation_file_required'),
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    let uploadedStoragePath = ''

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error(t('feed.login_required_description'))
      }

      const safeFileName = toSafeFileName(file.name || 'reel.mp4') || 'reel.mp4'
      uploadedStoragePath = `${user.id}/reels/${Date.now()}-${safeFileName}`

      const { error: uploadError } = await supabase.storage
        .from('community-media')
        .upload(uploadedStoragePath, file, {
          upsert: false,
          contentType: 'video/mp4',
          cacheControl: '31536000',
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data: publicUrlData } = supabase.storage
        .from('community-media')
        .getPublicUrl(uploadedStoragePath)

      const hashtags = hashtagsInput
        .split(',')
        .map((entry) => sanitizeHashtagSlug(entry))
        .filter(Boolean)

      await createVideoPost({
        content: caption.trim(),
        hashtags,
        publicUrl: publicUrlData.publicUrl,
        storagePath: uploadedStoragePath,
        storageBucket: 'community-media',
        mimeType: file.type,
        sizeBytes: file.size,
        width: metadata.width,
        height: metadata.height,
        durationSeconds: metadata.durationSeconds,
      })

      toast({
        title: t('reels.create_success_title'),
        description: t('reels.create_success_description'),
      })

      router.push('/community/reels')
      router.refresh()
    } catch (error) {
      if (uploadedStoragePath) {
        await supabase.storage.from('community-media').remove([uploadedStoragePath])
      }

      const message = error instanceof Error ? error.message : t('reels.create_error_description')
      toast({
        title: t('reels.create_error_title'),
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community/reels">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t('reels.new_reel')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('reels.new_reel_help')}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="reel-video-input">
                {t('reels.video_label')}
              </label>
              <input
                ref={fileInputRef}
                id="reel-video-input"
                type="file"
                accept="video/mp4"
                className="sr-only"
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">{t('reels.video_constraints')}</p>
            </div>

            {previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-border/70 bg-black">
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  className="aspect-[9/16] w-full object-contain"
                >
                  <track
                    kind="captions"
                    srcLang="en"
                    label="Preview captions"
                    src={EMPTY_CAPTION_TRACK}
                  />
                </video>
              </div>
            ) : (
              <button
                type="button"
                onClick={openFilePicker}
                onDragOver={(event) => {
                  event.preventDefault()
                  if (!isDragActive) {
                    setIsDragActive(true)
                  }
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                className={cn(
                  'flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-sm transition-colors',
                  isDragActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/70 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/30',
                )}
              >
                <Upload className="h-5 w-5" />
                <span>{t('reels.video_placeholder')}</span>
                <span className="text-xs text-muted-foreground">
                  {file ? file.name : t('reels.video_constraints')}
                </span>
              </button>
            )}

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/15 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {file?.name || t('reels.video_placeholder')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metadata
                    ? `${Math.round(metadata.durationSeconds)}s · ${metadata.width}×${metadata.height}`
                    : t('reels.video_constraints')}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={openFilePicker}>
                {file ? t('actions.change') : t('actions.select')}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="reel-caption">
                {t('reels.caption_label')}
              </label>
              <Textarea
                id="reel-caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder={t('reels.caption_placeholder')}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="reel-hashtags">
                {t('reels.hashtags_label')}
              </label>
              <Input
                id="reel-hashtags"
                value={hashtagsInput}
                onChange={(event) => setHashtagsInput(event.target.value)}
                placeholder={t('reels.hashtags_placeholder')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !file}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('reels.publishing')}
                  </>
                ) : (
                  t('reels.publish')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
