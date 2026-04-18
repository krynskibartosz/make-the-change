import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[85%] text-center sm:max-w-xl">
        <p className="text-lg italic leading-relaxed text-gray-300 sm:text-xl">{body}</p>
        <p className="mt-10 text-sm tracking-[0.2em] text-gray-500 sm:text-base">— {signature}</p>
      </div>
    </section>
  )
}
