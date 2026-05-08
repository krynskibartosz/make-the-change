import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
  colorMode?: 'default' | 'dark' | 'light' // default = couleur, dark = pour fond sombre (texte blanc), light = pour fond clair (texte noir)
  width?: number
  height?: number
}

export function Logo({
  className,
  variant = 'full',
  colorMode = 'default',
  width,
  height,
}: LogoProps) {
  // Dimensions par défaut basées sur le type
  const defaultWidth = variant === 'full' ? 180 : 40
  const defaultHeight = variant === 'full' ? 50 : 40

  let src = '/images/logos/logo-full.png'

  if (variant === 'icon') {
    src = '/adopt.svg'
  } else {
    // Variant Full
    if (colorMode === 'dark') {
      src = '/images/logos/logo-text-on-black.png'
    } else if (colorMode === 'light') {
      src = '/images/logos/logo-text-on-white.png'
    } else {
      src = '/images/logos/logo-full.png'
    }
  }

  const alt = 'Make the Change'

  return (
    <div className={cn('relative flex items-center', className)}>
      <Image
        src={src}
        alt={alt}
        width={width || defaultWidth}
        height={height || defaultHeight}
        className="object-contain"
        priority
      />
    </div>
  )
}
