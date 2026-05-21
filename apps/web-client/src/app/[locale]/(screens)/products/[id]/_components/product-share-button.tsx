'use client'

import { Check, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function ProductShareButton({
  productName,
  productId,
}: {
  productName: string
  productId: string
}) {
  const t = useTranslations('products.detail_page')
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${productId}`

    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text: `Check out ${productName} on Make The Change!`, url })
        return
      } catch (error) {
        if ((error as Error).name !== 'AbortError') console.error('Error sharing:', error)
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setHasCopied(true)
      toast({ title: t('share_success'), variant: 'success' })
      setTimeout(() => setHasCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy specific link', err)
      toast({ title: t('share_error'), variant: 'destructive' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={t('share')}
      className="flex h-11 w-11 items-center justify-center rounded-full"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-all active:scale-95 hover:bg-black/55">
        {hasCopied ? (
          <Check className="h-4 w-4 scale-110 text-marketing-positive-500 transition-all duration-300" />
        ) : (
          <Share2 className="h-4 w-4 transition-transform duration-300" />
        )}
      </span>
    </button>
  )
}
