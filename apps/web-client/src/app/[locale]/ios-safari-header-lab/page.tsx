import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'iOS Safari Header Lab',
  description: 'Test page for fixed header and safe-area background parity on iOS Safari.',
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#04131d',
}

const checkpoints = Array.from({ length: 20 }, (_, index) => index + 1)
const shellStyle = {
  '--lab-top-inset': 'clamp(2.25rem, env(safe-area-inset-top, 2.75rem), 3rem)',
} as CSSProperties

export default function IosSafariHeaderLabPage() {
  return (
    <div className="relative min-h-[100svh] bg-slate-950 text-slate-100" style={shellStyle}>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950" style={{ paddingTop: 'var(--lab-top-inset)' }}>
        <div className="mx-auto w-full max-w-md px-4">
          <header className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/25 text-sky-300">
                M
              </span>
              <div className="leading-none">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                  Header Lab
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">Fixed + Safe Area</p>
              </div>
            </div>
            <div className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
              Test iOS
            </div>
          </header>
        </div>
      </div>

      <main className="mx-auto w-full max-w-md px-4 pb-24" style={{ paddingTop: 'calc(var(--lab-top-inset) + 5.5rem)' }}>
        <section className="rounded-3xl border border-sky-400/40 bg-sky-500 p-5 text-slate-50 shadow-[0_8px_0_rgba(2,78,129,0.9)]">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sky-100">
            Reproduction Safari
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight">Scroll pour valider l effet Duolingo</h1>
          <p className="mt-3 text-sm text-sky-100/95">
            Le header est fixe et opaque. En scrollant, le contenu passe derriere, mais reste cache par le
            fond du header et la zone safe-area du haut.
          </p>
        </section>

        <section className="mt-10">
          <div className="mx-auto mb-8 w-full max-w-[220px] rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
            Contenu de scroll
          </div>

          <ul className="m-0 flex list-none flex-col gap-8 p-0">
            {checkpoints.map((step) => (
              <li key={step} className="flex items-center justify-center">
                <button
                  type="button"
                  className="h-24 w-24 rounded-full border border-slate-700 bg-slate-700/70 text-xl font-bold text-slate-200 shadow-[0_8px_0_rgba(15,23,42,0.8)]"
                >
                  {step}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
