import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center justify-center px-10 py-24 text-center">
      <p className="mb-12 text-lg font-light leading-loose text-gray-300 md:text-xl">
        Dans 3 ans, nous voulons que Make the Change soit{' '}
        <span className="font-medium text-white drop-shadow-md">le plus grand collectif citoyen d'Europe</span>{' '}
        pour la biodiversité. Un écosystème où chaque swipe sur un écran plante une graine, où chaque défi relevé restaure un habitat, et où l'action commune devient une seconde nature. Le collectif n'attend plus que vous.
      </p>
      <div className="flex w-full items-center justify-center gap-3 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500">
        <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-600 sm:w-12" />
        {signature}
        <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-600 sm:w-12" />
      </div>
    </section>
  )
}
