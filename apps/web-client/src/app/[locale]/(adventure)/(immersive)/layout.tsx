import type { PropsWithChildren } from 'react'

export default function ImmersiveLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
    </div>
  )
}
