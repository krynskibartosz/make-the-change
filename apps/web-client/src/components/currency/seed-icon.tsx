import { useId } from 'react'

type SeedVariant = 'color' | 'mono' | 'white'

type SeedIconProps = {
  size?: number
  variant?: SeedVariant
  className?: string
  glow?: boolean
}

const palette = (variant: SeedVariant) => {
  const isMono = variant === 'mono'
  const isWhite = variant === 'white'

  return {
    leafDark: isWhite ? '#F8FFF4' : isMono ? 'currentColor' : '#28D69B',
    leafLight: isWhite ? '#FFFFFF' : isMono ? 'currentColor' : '#7AF4C8',
    leafAccent: isWhite ? '#FFFFFF' : isMono ? 'currentColor' : '#B9FFE5',
    stem: isWhite ? '#F8FFF4' : isMono ? 'currentColor' : '#50E3B2',
    soilDark: isWhite ? '#F8FFF4' : isMono ? 'currentColor' : '#8A5C4D',
    soilMid: isWhite ? '#F8FFF4' : isMono ? 'currentColor' : '#A87561',
    soilLight: isWhite ? '#FFFFFF' : isMono ? 'currentColor' : '#C9967C',
    seedDot: isWhite ? '#FFFFFF' : isMono ? 'currentColor' : '#5E3E34',
  }
}

function SeedShape({
  c,
  showDetails,
}: {
  c: ReturnType<typeof palette>
  showDetails: boolean
}) {
  return (
    <>
      <path
        fill={c.soilDark}
        d="M9 41.8c1.7-4.6 7-8.3 15-8.3s13.3 3.7 15 8.3c.4 1.2-.4 2.2-1.6 2.2H10.6c-1.2 0-2-1-1.6-2.2Z"
      />
      <path fill={c.soilMid} d="M14 41c1.9-2.7 5.2-4.4 10-4.4s8.1 1.7 10 4.4H14Z" />
      <ellipse
        cx="24"
        cy="40.7"
        rx="5.8"
        ry="1.3"
        fill={c.soilLight}
        opacity={showDetails ? 0.7 : 1}
      />

      <path
        fill={c.stem}
        d="M23 36.8V23.3c0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6v13.5c0 .9-.7 1.6-1.6 1.6S23 37.7 23 36.8Z"
      />
      <path
        fill={c.stem}
        d="M24.2 25.4c-.4 0-.8-.2-1.1-.5-1.8-2.2-4.4-3.8-7.4-4.8-.8-.3-1.3-1.2-1-2 .3-.8 1.2-1.3 2-1 3.6 1.1 6.7 3.1 8.8 5.7.5.7.4 1.7-.2 2.2-.3.2-.7.4-1.1.4Z"
      />
      <path
        fill={c.stem}
        d="M24.8 24.9c-.4 0-.8-.1-1.1-.4-.7-.6-.8-1.6-.2-2.2 2.3-2.7 5.5-4.6 9.2-5.5.9-.2 1.7.3 1.9 1.2.2.8-.3 1.7-1.2 1.9-3 .8-5.6 2.3-7.6 4.6-.3.2-.6.4-1 .4Z"
      />

      <path
        fill={c.leafDark}
        d="M7.4 8.6c5.2-.2 10.7 1.8 14.2 5.3 2.3 2.3 2.7 5.2 1.1 7.1-1.8 2.1-5.2 2.3-8.3.6-4.1-2.1-6.7-6.4-7-13Z"
      />
      <path
        fill={c.leafLight}
        d="M10.3 10.8c4.2.2 7.8 1.8 10.3 4.2 1.6 1.6 1.8 3.5.7 4.7-1.1 1.2-3.4 1.3-5.6.1-2.9-1.5-5-4.5-5.4-9Z"
      />
      <path
        fill={c.leafAccent}
        d="M13.2 13.2c2.3.9 4.6 2.5 6.4 4.7.5.6.4 1.5-.2 2-.6.5-1.5.4-2-.2-1.5-1.8-3.4-3.2-5.3-4-.7-.3-1.1-1.1-.8-1.9.3-.7 1.1-1 1.9-.6Z"
        opacity={showDetails ? 0.55 : 1}
      />

      <path
        fill={c.leafDark}
        d="M40.7 10.2c-5.3-.8-10.9.2-14.6 3-2.4 1.8-3.3 4.6-2 6.8 1.4 2.4 4.7 3.2 8 2.1 4.4-1.5 7.5-5.4 8.6-11.9Z"
      />
      <path
        fill={c.leafLight}
        d="M37.7 12.1c-4.2.7-7.6 2.8-9.8 5.4-1.4 1.7-1.3 3.6-.1 4.8 1.2 1.1 3.5.9 5.6-.6 2.7-1.9 4.4-5.1 4.3-9.6Z"
      />
      <path
        fill={c.leafAccent}
        d="M35.8 14.7c-2.5.6-4.9 1.9-7 3.8-.6.5-1.5.5-2-.1s-.5-1.5.1-2c2.4-2.1 5.2-3.6 8-4.2.8-.2 1.5.3 1.7 1.1.1.7-.3 1.4-1.1 1.4Z"
        opacity={showDetails ? 0.5 : 1}
      />

      {showDetails && (
        <>
          <circle cx="18.1" cy="41.1" r="0.8" fill={c.seedDot} opacity="0.45" />
          <circle cx="24.9" cy="42" r="0.6" fill={c.seedDot} opacity="0.45" />
          <circle cx="31.2" cy="40.9" r="0.75" fill={c.seedDot} opacity="0.4" />
        </>
      )}
    </>
  )
}

export function SeedIcon({
  size = 160,
  variant = 'color',
  className = '',
  glow = false,
}: SeedIconProps) {
  const uid = useId().replace(/:/g, '')
  const c = palette(variant)
  const showDetails = variant === 'color'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {glow && (
        <defs>
          <radialGradient id={`seedGlowSoft-${uid}`} cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor="#5EE6B5" stopOpacity="0.28" />
            <stop offset="42%" stopColor="#5EE6B5" stopOpacity="0.16" />
            <stop offset="72%" stopColor="#5EE6B5" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#5EE6B5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`seedDiscDepth-${uid}`} cx="50%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#174A3C" stopOpacity="0.62" />
            <stop offset="68%" stopColor="#143C33" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#0F2C28" stopOpacity="0.18" />
          </radialGradient>
          <filter id={`seedGlowBlur-${uid}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
      )}

      {glow && (
        <>
          <ellipse
            cx="24"
            cy="24.6"
            rx="17.8"
            ry="18.7"
            fill={`url(#seedGlowSoft-${uid})`}
            filter={`url(#seedGlowBlur-${uid})`}
          />
          <ellipse
            cx="24"
            cy="24.9"
            rx="16.4"
            ry="17.2"
            fill={`url(#seedDiscDepth-${uid})`}
          />
        </>
      )}

      <SeedShape c={c} showDetails={showDetails} />
    </svg>
  )
}
