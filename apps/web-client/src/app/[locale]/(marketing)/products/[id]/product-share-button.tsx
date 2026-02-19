'use client'

import { Button } from '@make-the-change/core/ui'
import { Check, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function ProductShareButton({
    productName,
    productId,
    className,
}: {
    productName: string
    productId: string
    className?: string
}) {
    const t = useTranslations('products.detail_page')
    const [hasCopied, setHasCopied] = useState(false)
    const { toast } = useToast()

    const handleShare = async () => {
        const url = `${window.location.origin}/products/${productId}`

        // 1. Try Native Share API (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    text: `Check out ${productName} on Make The Change!`,
                    url,
                })
                return
            } catch (error) {
                // User cancelled or share failed, fallback to copy
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error)
                }
            }
        }

        // 2. Fallback to Copy to Clipboard (Desktop)
        try {
            await navigator.clipboard.writeText(url)
            setHasCopied(true)
            toast({
                title: t('share_success'),
                variant: 'success',
            })

            setTimeout(() => {
                setHasCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy specific link', err)
            toast({
                title: t('share_error'),
                variant: 'destructive',
            })
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className={className}
            onClick={handleShare}
            title={t('share')}
        >
            {hasCopied ? (
                <Check className="h-5 w-5 text-marketing-positive-500 transition-all duration-300 transform scale-110" />
            ) : (
                <Share2 className="h-5 w-5 transition-transform duration-300" />
            )}
            <span className="sr-only">{t('share')}</span>
        </Button>
    )
}
