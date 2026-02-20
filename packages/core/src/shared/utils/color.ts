/**
 * Color utility functions for HSL and HEX conversions
 */

export function hexToHsl(hex: string): string {
  // Remove the # if it exists
  hex = hex.replace(/^#/, '')

  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function parseHsl(hslStr: string): { h: number; s: number; l: number } {
  const [hRaw = '0', sRaw = '0', lRaw = '0'] = hslStr.replace(/%/g, '').trim().split(/\s+/)
  return {
    h: parseInt(hRaw, 10) || 0,
    s: parseInt(sRaw, 10) || 0,
    l: parseInt(lRaw, 10) || 0,
  }
}

export function generatePaletteFromPrimary(primaryHsl: string): Record<string, string> {
  const { h, s, l } = parseHsl(primaryHsl)
  
  return {
    '--primary': `${h} ${s}% ${l}%`,
    '--primary-foreground': `${h} ${s}% ${l > 60 ? 10 : 98}%`,
    '--secondary': `${h} 15% 96%`,
    '--secondary-foreground': `${h} 50% 15%`,
    '--accent': `${(h + 30) % 360} 60% 70%`,
    '--accent-foreground': `${(h + 30) % 360} 60% 15%`,
    '--background': `0 0% 100%`,
    '--foreground': `${h} 10% 10%`,
    '--card': `0 0% 99%`,
    '--card-foreground': `${h} 10% 10%`,
    '--border': `${h} 15% 90%`,
    '--input': `${h} 15% 96%`,
    '--ring': `${h} ${s}% ${l}%`,
  }
}
