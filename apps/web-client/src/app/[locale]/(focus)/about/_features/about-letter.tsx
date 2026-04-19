import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center px-12 py-24 text-center">
      <p className="mb-14 text-lg font-light leading-[2.2] text-gray-300 text-pretty drop-shadow-sm">
        Dans 3 ans, nous voulons que Make the Change soit{' '}
        <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">le plus grand collectif citoyen d'Europe</span>{' '}
        pour la biodiversité. Un écosystème où chaque swipe sur un écran plante une graine, où chaque défi relevé restaure un habitat, et où l'action commune devient une seconde nature. Le collectif n'attend plus que vous.
      </p>
      <div className="flex w-full items-center justify-center gap-4 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.25em] text-gray-500 opacity-80">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-500" />
        {signature}
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-500" />
      </div>
    </section>
  )
}
