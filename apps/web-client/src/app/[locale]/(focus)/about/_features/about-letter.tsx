import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[32ch] sm:max-w-[38ch]">
        <p className="text-xl font-light italic leading-relaxed text-emerald-50/80 sm:text-2xl">
          {body}
        </p>
        <p className="mt-10 text-right text-[11px] tracking-[0.25em] text-gray-500 uppercase">
          — {signature}
        </p>
      </div>
    </section>
  )
}
