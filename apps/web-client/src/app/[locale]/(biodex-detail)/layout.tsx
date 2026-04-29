import type { PropsWithChildren } from 'react'

export default function BiodexDetailLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* No Header */}
      <main className="flex-1">{children}</main>
      {/* No MobileBottomNav */}
    </div>
  )
}
