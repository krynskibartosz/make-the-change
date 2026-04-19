import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[32ch] sm:max-w-[38ch]">
        <p className="text-xl font-light italic leading-relaxed text-emerald-50/80 sm:text-2xl">
          {body}
        </p>
        <p className="mt-6 text-right text-sm italic text-gray-500">
          {signature}
        </p>
      </div>
    </section>
  )
}
