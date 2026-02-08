'use client'

import { Badge } from '@make-the-change/core/ui'
import { useState } from 'react'
import { uploadImages } from '@/app/actions/upload-images'
import { updateProfileImages } from '@/app/[locale]/(dashboard)/dashboard/profile/actions'
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
          [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: newUrl
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
      <div className="container mx-auto relative -mt-16 flex flex-col gap-4 px-4 pb-6 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-4">
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <ImageUploader
              imageSrc={avatarUrl}
              size="avatar"
              isLoading={isAvatarLoading}
              onImageClick={handleAvatarClick}
              disabled={readonly}
              className="h-full w-full rounded-full shadow-2xl"
              containerClassName="h-full w-full"
            />
          </div>
          
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{name}</h1>
            <div className="flex items-center gap-2">
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
              <Badge className={cn('rounded-full', levelClass)}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="hidden rounded-2xl border bg-background/50 px-6 py-4 backdrop-blur md:block">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Impact score</p>
          <p className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat('fr-FR').format(impactScore)}
          </p>
          <p className="text-xs text-muted-foreground">Votre progression globale</p>
        </div>
      </div>
    </div>
  )
}
