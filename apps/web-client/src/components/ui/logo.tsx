import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
  colorMode?: 'default' | 'dark' | 'light' // default = couleur, dark = pour fond sombre (texte blanc), light = pour fond clair (texte noir)
  width?: number
  height?: number
}

export const Logo = ({
  className,
  variant = 'full',
  colorMode = 'default',
  width,
  height,
}: LogoProps) => {
  // Dimensions par défaut basées sur le type
  const defaultWidth = variant === 'full' ? 180 : 40
  const defaultHeight = variant === 'full' ? 50 : 40

  let src = '/images/logo-full.png'

  if (variant === 'icon') {
    src = '/adopt.svg'
  } else {
    // Variant Full
    if (colorMode === 'dark') {
      src = '/images/logo-text-on-black.png' // Texte blanc pour fond noir (nom de fichier à confirmer selon contenu réel)
      // Note: Si "logo-text-on-black.png" signifie "logo avec texte NOIR" (pour fond blanc), alors la logique est inversée.
      // Basé sur le nommage standard : "text-on-black" = "texte fait pour aller sur du noir" => donc texte BLANC.
    } else if (colorMode === 'light') {
      src = '/images/logo-text-on-white.png' // Texte sombre pour fond blanc
    } else {
      src = '/images/logo-full.png' // Logo couleur original
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
