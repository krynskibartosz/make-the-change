import type { Metadata } from 'next'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { getAllLearningPaths } from '@/lib/learning/catalog'
import { LearningPathCard, LearningScreenIntro, LearningSectionTitle } from '../_features/learning-cards'

export const metadata: Metadata = {
  title: 'Parcours guidés | Make the Change',
}

export default function LearningPathsPage() {
  const paths = getAllLearningPaths()

  return (
    <TabScreen className="bg-[#0B0F15]">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-28 pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Chemins conseillés" title="Parcours guidés">
          Des séquences pour les sujets qui ont un ordre pédagogique clair. L’Academy reste le mode immersif du parcours
          principal, les autres chemins ouvrent les mêmes cours en exploration libre.
        </LearningScreenIntro>

        <section>
          <LearningSectionTitle title="Tous les parcours" />
          <div className="grid gap-3 md:grid-cols-2">
            {paths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </section>
      </main>
    </TabScreen>
  )
}
