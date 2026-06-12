import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { ProjectProvider } from '@/lib/project-context'
import { mockClarusRepository } from '@/lib/repositories'
import { RoleProvider } from '@/lib/role-context'
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

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const projects = await mockClarusRepository.getProjects()

  return (
    <html lang="fr" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RoleProvider>
          <ProjectProvider initialProjects={projects}>{children}</ProjectProvider>
          {modal}
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  )
}
