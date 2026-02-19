'use client'

import { Badge } from '@make-the-change/core/ui'
import { useState } from 'react'
import { updateProfileImages } from '@/app/[locale]/(dashboard)/dashboard/profile/actions'
import { uploadImages } from '@/app/actions/upload-images'
import { getRandomCoverImage } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'
import { ImageUploader } from './image-uploader'

const levelStyles: Record<string, string> = {
  explorateur: 'bg-muted text-muted-foreground',
  protecteur: 'bg-success/15 text-success',
  ambassadeur: 'bg-warning/15 text-warning',
}

type ProfileHeaderProps = {
  userId?: string
  name: string
  email?: string | null
  level: string
  avatarUrl?: string
  coverUrl?: string
  impactScore?: number
  readonly?: boolean
}

export const ProfileHeader = ({
  userId,
  name,
  email,
  level,
  avatarUrl: initialAvatarUrl,
  coverUrl: initialCoverUrl,
  impactScore = 0,
  readonly = false,
}: ProfileHeaderProps) => {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const [isCoverLoading, setIsCoverLoading] = useState(false)

  const levelClass = levelStyles[level] || levelStyles.explorateur
  const safeCover = coverUrl || getRandomCoverImage(1)

  const handleUpload = async (fileList: FileList | null, type: 'avatar' | 'cover') => {
    if (!fileList || fileList.length === 0 || !userId || readonly) return

    const file = fileList[0]
    const setLoading = type === 'avatar' ? setIsAvatarLoading : setIsCoverLoading

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('bucket', 'users') // Bucket 'users' must exist and have public access
      formData.append('entityId', userId)
      formData.append('files', file)

      // 1. Upload to Storage
      const result = await uploadImages(formData)

      if (result.success && result.urls && result.urls.length > 0) {
        const newUrl = result.urls[0]

        // 2. Update DB
        const updateResult = await updateProfileImages({
          [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: newUrl,
        })

        if (updateResult.success) {
          if (type === 'avatar') setAvatarUrl(newUrl)
          else setCoverUrl(newUrl)
        }
      }
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files, 'avatar')
    input.click()
  }

  const handleCoverClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files, 'cover')
    input.click()
  }

  return (
    <div className="relative -mt-[1px] bg-background/80 backdrop-blur-md transition-all duration-300 group/header">
      {/* Cover Image */}
      <div className="relative h-48 w-full lg:h-64">
        <ImageUploader
          imageSrc={safeCover}
          size="cover"
          isLoading={isCoverLoading}
          onImageClick={handleCoverClick}
          disabled={readonly}
          className="h-full w-full"
          containerClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
      </div>

      {/* Profile Info Overlay */}
      <div className="container mx-auto relative -mt-16 flex flex-col gap-6 px-4 pb-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end text-center sm:text-left">
          <div className="relative h-32 w-32 md:h-40 md:w-40 -mt-8 sm:mt-0">
            <ImageUploader
              imageSrc={avatarUrl}
              size="avatar"
              isLoading={isAvatarLoading}
              onImageClick={handleAvatarClick}
              disabled={readonly}
              className="h-full w-full rounded-full border-4 border-background shadow-2xl"
              containerClassName="h-full w-full"
            />
          </div>

          <div className="mb-2">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
              {email && <p className="text-sm text-muted-foreground font-medium">{email}</p>}
              <Badge
                className={cn(
                  'rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  levelClass,
                )}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border bg-background/60 p-4 sm:p-6 backdrop-blur-md shadow-xl lg:min-w-[200px]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
            Impact score
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-foreground lg:text-4xl">
              {new Intl.NumberFormat('fr-FR').format(impactScore)}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground/60">Votre progression globale</p>
        </div>
      </div>
    </div>
  )
}
