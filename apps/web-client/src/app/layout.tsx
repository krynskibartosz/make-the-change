import type { PropsWithChildren } from 'react'
import '@/app/globals.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr" suppressHydrationWarning className="m-0 p-0 w-full h-full">
      <body className="m-0 p-0 bg-background text-foreground w-full h-full">{children}</body>
    </html>
  )
}
