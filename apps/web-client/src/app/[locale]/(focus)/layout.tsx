import type { PropsWithChildren } from 'react'

export default function FocusLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-[#0D1117] text-white antialiased">
      <main className="relative">{children}</main>
    </div>
  )
}
