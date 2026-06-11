import type { ReactNode } from 'react'

import { BottomNav } from './_components/bottom-nav'

type TabsLayoutProps = Readonly<{
  children: ReactNode
}>

export default function TabsLayout({ children }: TabsLayoutProps) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
