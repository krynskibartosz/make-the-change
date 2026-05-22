import * as React from 'react'

const DEFAULT_PROFILE = {
  width: 390,
  height: 780,
  isNarrow: false,
  isShort: false,
  isCompact: true,
}

function getViewportProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE

  const viewport = window.visualViewport
  const width = Math.round(viewport?.width ?? window.innerWidth)
  const height = Math.round(viewport?.height ?? window.innerHeight)

  return {
    width,
    height,
    isNarrow: width <= 380,
    isShort: height <= 720,
    isCompact: width <= 430 || height <= 760,
  }
}

export function useAtlasViewportProfile() {
  const [profile, setProfile] = React.useState(DEFAULT_PROFILE)

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setProfile(getViewportProfile()))
    }

    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [])

  return profile
}
