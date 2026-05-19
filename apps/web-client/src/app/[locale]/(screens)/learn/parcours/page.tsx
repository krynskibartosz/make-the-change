import type { Metadata } from 'next'
import {
  LearningPathCard,
  LearningScreenIntro,
  LearningSectionTitle,
} from '@/app/[locale]/(tabs)/learn/_features/learning-cards'
import { getAllLearningPaths } from '@/lib/learning/catalog'

export const metadata: Metadata = {
  title: 'Parcours guides | Make the Change',
}

export default function LearningPathsPage() {
  const paths = getAllLearningPaths()

  return (
    <main className="min-h-[100dvh] bg-[#0B0F15] text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Chemins conseilles" title="Parcours guides">
          Des sequences pour les sujets qui ont un ordre pedagogique clair. L'Academy reste le mode
          immersif du parcours principal, les autres chemins ouvrent les memes cours en exploration
          libre.
        </LearningScreenIntro>

        <section>
          <LearningSectionTitle title="Tous les parcours" />
          <div className="grid gap-3 md:grid-cols-2">
            {paths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
