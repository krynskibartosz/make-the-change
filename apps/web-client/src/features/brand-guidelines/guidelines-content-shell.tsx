import type { ReactNode } from 'react'

type TocItem = {
  id: string
  label: string
}

type GuidelinesContentShellProps = {
  title: string
  intro: string
  tocItems: TocItem[]
  children: ReactNode
  aside?: ReactNode
}

export function GuidelinesContentShell({
  title,
  intro,
  tocItems,
  children,
  aside,
}: GuidelinesContentShellProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">{children}</div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-muted/40 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-primary">{title}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>

            <nav className="mt-6 space-y-2">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {aside ? <div className="mt-6">{aside}</div> : null}
          </div>
        </aside>
      </div>
    </div>
  )
}
