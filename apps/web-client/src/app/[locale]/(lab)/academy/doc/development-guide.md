# Academy Development Guide

## Overview
This guide provides reusable patterns and components from the existing codebase to accelerate the development of the Academy feature. All components are production-ready and follow the app's design system.

---

## 1. Full Screen Modal Pattern

### Component: FullScreenSlideModal
**Location:** `src/app/[locale]/@modal_components/full-screen-slide-modal.tsx`

**Usage:** Perfect for Academy unit pages and exercise feedback screens.

**Props:**
```typescript
type FullScreenSlideModalProps = {
  title?: string
  fallbackHref?: string
  headerMode?: 'back' | 'close' | 'none' | 'dynamic'
  className?: string
  contentClassName?: string
  onClose?: () => void
  refreshOnClose?: boolean
}
```

**Key Features:**
- Full screen slide-in animation
- Header with back/close button (configurable)
- Safe area insets for mobile
- Backdrop blur glassmorphism effect
- Scroll handling with overscroll control

**Example for Academy Unit Page:**
```tsx
import { FullScreenSlideModal } from '@/app/[locale]/@modal_components/full-screen-slide-modal'

export function UnitPage() {
  return (
    <FullScreenSlideModal
      title="Unité 1.1"
      headerMode="back"
      fallbackHref="/academy"
    >
      {/* Unit content */}
    </FullScreenSlideModal>
  )
}
```

---

## 2. Back Button Component

### Component: BackButton
**Location:** `src/components/back-button.tsx`

**Usage:** Simple back button with glassmorphism style.

**Code:**
```tsx
'use client'

import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Retour"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}
```

**Styling:** 
- Glassmorphism effect (`bg-white/5`)
- Hover state (`hover:bg-white/10`)
- Accessible with aria-label

---

## 3. Fixed Header Pattern

### Component: Header
**Location:** `src/components/layout/header.tsx`

**Key Pattern for Academy:**
```tsx
<header
  className="fixed left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
             border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
  <div className="flex h-16 items-center justify-between px-4">
    {/* Header content */}
  </div>
</header>
```

**Glassmorphism Classes:**
- `bg-background/95` - Semi-transparent background
- `backdrop-blur` - Blur effect
- `supports-backdrop-filter:bg-background/60` - Fallback for browsers without backdrop-filter

**Animation:**
- `transition-all duration-300 ease-in-out` - Smooth transitions
- `fixed left-0 right-0 z-50` - Fixed positioning

---

## 4. Mobile Navigation Header

### Component: TopNavigation
**Location:** `src/components/layout/top-navigation.tsx`

**Usage:** Mobile-first fixed header with section label.

**Pattern:**
```tsx
<header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 
                 bg-background/85 backdrop-blur-xl md:hidden">
  <div className="pt-[env(safe-area-inset-top)]">
    <div className="flex h-14 items-center justify-between px-4">
      {/* Navigation content */}
    </div>
  </div>
</header>
```

**Key Classes:**
- `pt-[env(safe-area-inset-top)]` - Safe area for notch
- `md:hidden` - Mobile only
- `backdrop-blur-xl` - Strong blur effect

---

## 5. Scroll Header Hook

### Hook: useScrollHeader
**Location:** `src/components/layout/use-scroll-header.ts`

**Usage:** Hide/show header based on scroll direction.

**Code:**
```typescript
'use client'

import { useEffect, useState } from 'react'

export function useScrollHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      const threshold = 100

      if (currentScrollY > threshold) {
        if (scrollDirection === 'down' && isVisible) {
          setIsVisible(false)
        } else if (scrollDirection === 'up' && !isVisible) {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const throttledHandleScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = null
      }, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [lastScrollY, isVisible])

  return { isVisible, scrollThreshold }
}
```

**Usage in Academy:**
```tsx
const { isVisible } = useScrollHeader()

<header className={cn(
  'fixed top-0 z-50 transition-all',
  isVisible ? 'translate-y-0' : '-translate-y-full'
)}>
```

---

## 6. Quick View Pattern (Project/Product)

### Components:
- `ProjectQuickView` - `src/app/[locale]/(marketing)/projects/[slug]/project-quick-view.tsx`
- `ProductQuickView` - `src/app/[locale]/(marketing)/products/[id]/product-quick-view.tsx`

**Pattern for Academy Unit Page:**
```tsx
<div className="relative flex h-full min-h-full flex-col bg-transparent">
  {/* Background gradients */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
  </div>

  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto overscroll-contain pb-4">
    {/* Content */}
  </div>

  {/* Fixed bottom button */}
  <div className="relative shrink-0 border-t border-white/10 
                  bg-background/95 p-4 backdrop-blur-xl 
                  pb-[max(1rem,env(safe-area-inset-bottom))]">
    <Button className="h-14 w-full">
      Continue
    </Button>
  </div>
</div>
```

**Key Classes:**
- `overscroll-contain` - Prevent pull-to-refresh
- `pb-[max(1rem,env(safe-area-inset-bottom))]` - Safe area for home indicator
- `backdrop-blur-xl` - Glassmorphism bottom bar

---

## 7. Full Screen Modal with Animation

### Pattern from ProductQuickView
**Location:** `src/app/[locale]/(marketing)/products/[id]/product-quick-view.tsx`

**Animation Pattern:**
```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0F15]"
    >
      {/* Modal content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Header Pattern:**
```tsx
<div className="sticky top-0 z-20 bg-[#0B0F15]/90 backdrop-blur-md px-6 py-4 
                flex items-center justify-between border-b border-white/5 
                pt-[max(1.5rem,env(safe-area-inset-top))]">
  <h3 className="text-xl font-bold text-white tracking-tight">Title</h3>
  <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10">
    <X className="w-5 h-5 text-white" />
  </button>
</div>
```

---

## 8. Mascotte Images

### Available Mascottes
**Location:** `public/`

- `ondine.png` - Water element mascot (215 KB)
- `sylva.png` - Forest/plant mascot (229 KB)

**Usage:**
```tsx
import Image from 'next/image'

<Image 
  src="/ondine.png" 
  alt="Mascotte Ondine" 
  width={200} 
  height={200}
  className="w-32 h-32 object-contain"
/>
```

**Default Mascotte Mapping:**
- Ondine: Units 1.1, 2.3, 3.2, 4.2, 5.1 (Water/Change themes)
- Sylva: Units 1.2, 2.2, 3.3, 4.1, 5.3 (Plant/Growth themes)
- Melli: Units 1.3, 2.1, 3.1, 4.3, 5.2 (Animal/Action themes) - *Note: Melli image not yet available, use Ondine or Sylva as fallback*

---

## 9. Academy-Specific Patterns

### Unit Page Structure
```tsx
// academy/[unit]/page.tsx
'use client'

import { FullScreenSlideModal } from '@/app/[locale]/@modal_components/full-screen-slide-modal'
import { BackButton } from '@/components/back-button'
import { useScrollHeader } from '@/components/layout/use-scroll-header'

export default function UnitPage({ params }: { params: { unit: string } }) {
  const { isVisible } = useScrollHeader()

  return (
    <FullScreenSlideModal
      title={`Unité ${params.unit}`}
      headerMode="back"
      fallbackHref="/academy"
    >
      {/* Mascotte Image */}
      <div className="relative aspect-video">
        <Image 
          src="/ondine.png" 
          alt="Mascotte" 
          fill
          className="object-contain"
        />
      </div>

      {/* Exercise Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Story, Swipe, Drag Drop, Quiz components */}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 
                      bg-background/95 backdrop-blur-xl 
                      border-t border-white/10
                      pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button className="h-14 w-full bg-lime-400 text-black font-black">
          Continuer
        </Button>
      </div>
    </FullScreenSlideModal>
  )
}
```

### Exercise Feedback Screen Pattern
```tsx
// Victory/Error feedback screen
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br 
                 from-lime-500/20 to-emerald-600/20 backdrop-blur-xl"
>
  <div className="text-center space-y-4">
    <div className="text-6xl">🎉</div>
    <h2 className="text-2xl font-black text-white">Excellent !</h2>
    <p className="text-white/80">{feedbackText}</p>
    <Button className="h-14 w-full bg-lime-400 text-black font-black">
      Continuer
    </Button>
  </div>
</motion.div>
```

---

## 10. Utility Classes Reference

### Glassmorphism
- `bg-white/5` - Light glass
- `bg-background/95` - Strong glass
- `backdrop-blur` - Basic blur
- `backdrop-blur-xl` - Strong blur
- `backdrop-blur-3xl` - Maximum blur

### Positioning
- `fixed inset-0` - Full screen fixed
- `sticky top-0` - Sticky header
- `fixed bottom-0` - Fixed bottom bar

### Safe Areas
- `pt-[env(safe-area-inset-top)]` - Top safe area
- `pb-[max(1rem,env(safe-area-inset-bottom))]` - Bottom safe area

### Animations
- `transition-all duration-300 ease-in-out` - Smooth transitions
- `active:scale-95` - Press effect
- `hover:bg-white/10` - Hover effect

---

## 11. Component Imports Reference

```typescript
// Layout components
import { Header } from '@/components/layout/header'
import { TopNavigation } from '@/components/layout/top-navigation'
import { BackButton } from '@/components/back-button'
import { useScrollHeader } from '@/components/layout/use-scroll-header'

// Modal components
import { FullScreenSlideModal } from '@/app/[locale]/@modal_components/full-screen-slide-modal'

// UI components
import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, X, ChevronLeft } from 'lucide-react'

// Utilities
import { cn } from '@/lib/utils'
import { useRouter } from '@/i18n/navigation'
```

---

## 12. Design System Colors

### Primary Colors
- `lime-400` - Primary accent (buttons, highlights)
- `primary` - Brand primary
- `marketing-positive-500` - Success/positive

### Backgrounds
- `background` - Main background
- `[#0B0F15]` - Dark background (used in modals)
- `white/5` - Light glass
- `white/10` - Medium glass

### Borders
- `border-white/10` - Light border
- `border-border/70` - Standard border
- `border-lime-400/20` - Accent border

---

## 13. Quick Start Template

### Academy Main Page Template
```tsx
// academy/page.tsx
'use client'

import { Header } from '@/components/layout/header'
import { TopNavigation } from '@/components/layout/top-navigation'

export default function AcademyPage() {
  return (
    <>
      <Header />
      <TopNavigation />
      
      <main className="pt-16 md:pt-16 pb-24 md:pb-0">
        {/* Chapter tree with no-line layout */}
      </main>
    </>
  )
}
```

### Academy Unit Page Template
```tsx
// academy/[unit]/page.tsx
'use client'

import { FullScreenSlideModal } from '@/app/[locale]/@modal_components/full-screen-slide-modal'

export default function UnitPage({ params }: { params: { unit: string } }) {
  return (
    <FullScreenSlideModal
      title={`Unité ${params.unit}`}
      headerMode="back"
      fallbackHref="/academy"
    >
      {/* Unit content with exercises */}
    </FullScreenSlideModal>
  )
}
```

---

## 14. Performance Tips

1. **Use `overscroll-contain`** on scrollable areas to prevent pull-to-refresh
2. **Throttle scroll handlers** with 16ms timeout (60fps)
3. **Use `passive: true`** for scroll event listeners
4. **Lazy load images** with Next.js Image component
5. **Use `will-change` sparingly** for animations

---

## 15. Accessibility Checklist

- [ ] All buttons have `aria-label` or visible text
- [ ] Safe area insets respected on mobile
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets minimum 44x44px

---

## Summary

This guide provides all the reusable patterns needed to build the Academy feature:
- Full screen modals with animations
- Fixed headers with glassmorphism
- Back buttons and navigation
- Scroll behavior hooks
- Mascotte images (Ondine, Sylva, Melli)
- Bottom action bars
- Safe area handling
- Animation patterns

All components are production-ready and follow the existing design system. Use these patterns as building blocks for the Academy implementation.
