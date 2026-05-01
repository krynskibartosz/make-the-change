import { Suspense, type PropsWithChildren } from 'react'
import { MobileBottomNav } from '@/app/[locale]/(tabs)/_components/mobile-bottom-nav'

export default function TabsLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100dvh] bg-[#0B0F15] text-white">
      <Suspense fallback={null}>{children}</Suspense>
      <MobileBottomNav />
    </div>
  )
}
