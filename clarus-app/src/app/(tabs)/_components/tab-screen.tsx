import type { ReactNode } from 'react'

type TabScreenProps = Readonly<{
  title: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
}>

export function TabScreen({ title, eyebrow = 'Sparrenlaan', action, children }: TabScreenProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-28 pt-5 text-foreground">
      <header className="flex items-start justify-between gap-4 pb-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
        </div>
        {action}
      </header>

      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </main>
  )
}
