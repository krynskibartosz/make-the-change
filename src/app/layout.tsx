import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { RoleProvider } from '@/lib/role-context'
import { DemoRoleSwitcher } from '@/components/demo-role-switcher'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Clarus',
  description: 'Prototype chantier mobile-first pour Sparrenlaan.',
}

export const viewport: Viewport = {
  themeColor: '#080B0F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

type RootLayoutProps = Readonly<{
  children: ReactNode
  modal?: ReactNode
}>

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="fr" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RoleProvider>
          {children}
          {modal}
          <DemoRoleSwitcher />
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  )
}
