import { useId } from 'react'

type ImpactCreditVariant = 'color' | 'black' | 'white' | 'mono'

type ImpactCreditIconProps = {
  size?: number
  variant?: ImpactCreditVariant
  className?: string
  glow?: boolean
  title?: string
}

const palette = (variant: ImpactCreditVariant) => {
  if (variant === 'black') {
    return {
      bg: '#111317',
      bg2: '#252A31',
      border: '#050607',
      line: '#EEF2F6',
      lineSoft: '#8F98A3',
      mark: '#F8FAFC',
      shadow: 'rgba(0,0,0,.55)',
      highlight: 'rgba(255,255,255,.12)',
      glow: 'rgba(255,255,255,.08)',
      mode: 'black' as const,
    }
  }

  if (variant === 'white') {
    return {
      bg: 'transparent',
      bg2: 'transparent',
      border: '#FFFFFF',
      line: '#FFFFFF',
      lineSoft: '#FFFFFF',
      mark: '#FFFFFF',
      shadow: 'transparent',
      highlight: 'transparent',
      glow: 'rgba(255,255,255,.14)',
      mode: 'white' as const,
    }
  }

  if (variant === 'mono') {
    return {
      bg: 'transparent',
      bg2: 'transparent',
      border: 'currentColor',
      line: 'currentColor',
      lineSoft: 'currentColor',
      mark: 'currentColor',
      shadow: 'transparent',
      highlight: 'transparent',
      glow: 'rgba(255,255,255,.10)',
      mode: 'mono' as const,
    }
  }

  return {
    bg: '#F2A915',
    bg2: '#FFD95C',
    border: '#9D5D05',
    line: '#FFF4C7',
    lineSoft: '#FFD465',
    mark: '#FFF8D7',
    shadow: 'rgba(92,52,6,.32)',
    highlight: 'rgba(255,255,255,.34)',
    glow: 'rgba(255,194,55,.24)',
    mode: 'color' as const,
  }
}

export function ImpactCreditIcon({
  size = 160,
  variant = 'color',
  className = '',
  glow = false,
  title,
}: ImpactCreditIconProps) {
  const p = palette(variant)
  const uid = useId().replace(/:/g, '')
  const isColor = variant === 'color'
  const isBlack = variant === 'black'
  const isWhite = variant === 'white'
  const isMono = variant === 'mono'
  const isFlat = isWhite || isMono

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}

      <defs>
        <radialGradient id={`creditGlow-${uid}`} cx="50%" cy="48%" r="56%">
          <stop
            offset="0%"
            stopColor={isWhite || isMono ? 'currentColor' : p.bg2}
            stopOpacity="0.3"
          />
          <stop
            offset="60%"
            stopColor={isWhite || isMono ? 'currentColor' : p.bg2}
            stopOpacity="0.1"
          />
          <stop
            offset="100%"
            stopColor={isWhite || isMono ? 'currentColor' : p.bg2}
            stopOpacity="0"
          />
        </radialGradient>

        <linearGradient
          id={`creditColorFill-${uid}`}
          x1="56"
          y1="36"
          x2="204"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFF0A6" />
          <stop offset="0.42" stopColor="#F6B91F" />
          <stop offset="1" stopColor="#A96305" />
        </linearGradient>

        <linearGradient
          id={`creditBlackFill-${uid}`}
          x1="62"
          y1="42"
          x2="202"
          y2="218"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#444951" />
          <stop offset="0.48" stopColor="#171A1F" />
          <stop offset="1" stopColor="#050607" />
        </linearGradient>

        <linearGradient
          id={`creditMarkFill-${uid}`}
          x1="102"
          y1="102"
          x2="154"
          y2="154"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={isBlack ? '#FFFFFF' : '#FFFBE8'} />
          <stop offset="1" stopColor={isBlack ? '#7E8792' : '#FFE06B'} />
        </linearGradient>

        <filter id={`creditShadow-${uid}`} x="-20%" y="-20%" width="140%" height="145%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="8"
            floodColor={isBlack ? '#000000' : '#5C3406'}
            floodOpacity={isBlack ? 0.55 : 0.28}
          />
        </filter>
      </defs>

      {glow && (
        <circle
          cx="128"
          cy="128"
          r="118"
          fill={`url(#creditGlow-${uid})`}
          opacity={isWhite ? 0.7 : 1}
        />
      )}

      <g filter={isColor || isBlack ? `url(#creditShadow-${uid})` : undefined}>
        {!isFlat && (
          <>
            <circle
              cx="128"
              cy="128"
              r="106"
              fill={isBlack ? `url(#creditBlackFill-${uid})` : `url(#creditColorFill-${uid})`}
            />
            <circle
              cx="128"
              cy="128"
              r="92"
              fill={isBlack ? 'rgba(255,255,255,.035)' : 'rgba(255,244,199,.16)'}
            />
            <path
              d="M58 96C71 59 103 39 137 41C106 44 79 64 65 101C61 112 58 123 57 134C53 120 54 108 58 96Z"
              fill="#FFFFFF"
              opacity={isColor ? 0.26 : 0.08}
            />
          </>
        )}

        <circle
          cx="128"
          cy="128"
          r="106"
          fill={isFlat ? 'none' : 'transparent'}
          stroke={isFlat ? p.line : isBlack ? '#050607' : '#9D5D05'}
          strokeWidth={isFlat ? 12 : 6}
          opacity={isFlat ? 1 : 0.46}
        />

        <circle
          cx="128"
          cy="128"
          r="86"
          stroke={isFlat ? p.line : isBlack ? '#D7DCE2' : '#FFF4C7'}
          strokeWidth={isFlat ? 10 : 5}
          opacity={isBlack ? 0.78 : 0.92}
        />

        <path
          d="M128 66L181 96.6V157.8L128 188.4L75 157.8V96.6L128 66Z"
          fill="none"
          stroke={isFlat ? p.line : isBlack ? '#DCE1E7' : '#FFF4C7'}
          strokeWidth={isFlat ? 11 : 9}
          strokeLinejoin="round"
          opacity={isBlack ? 0.9 : 1}
        />

        <path
          d="M128 88C134.1 109.7 146.3 121.9 168 128C146.3 134.1 134.1 146.3 128 168C121.9 146.3 109.7 134.1 88 128C109.7 121.9 121.9 109.7 128 88Z"
          fill={
            isFlat
              ? p.mark
              : isBlack
                ? `url(#creditMarkFill-${uid})`
                : `url(#creditMarkFill-${uid})`
          }
        />

        {!isFlat && (
          <path
            d="M128 106C131.5 118.8 137.2 124.5 150 128C137.2 131.5 131.5 137.2 128 150C124.5 137.2 118.8 131.5 106 128C118.8 124.5 124.5 118.8 128 106Z"
            fill="#FFFFFF"
            opacity={isColor ? 0.2 : 0.1}
          />
        )}
      </g>
    </svg>
  )
}
