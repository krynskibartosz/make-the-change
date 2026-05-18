import type { Metadata } from 'next'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import {
  AtlasDomainCard,
  LearningCourseCard,
  LearningScreenIntro,
  LearningSectionTitle,
} from '../_features/learning-cards'
import { getAtlasDomains } from '@/lib/learning/selectors'

export const metadata: Metadata = {
  title: 'Atlas du vivant | Make the Change',
}

export default function LearningAtlasPage() {
  const domains = getAtlasDomains()

  return (
    <TabScreen className="bg-[#0B0F15]">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-28 pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Atlas libre" title="Atlas du vivant">
          Une exploration par domaines : les cours restent libres, mais chaque île garde ses thèmes, ses niveaux et ses
          liens vers les projets ou le BioDex.
        </LearningScreenIntro>

        <section>
          <LearningSectionTitle title="Îles thématiques" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <AtlasDomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </section>

        <div className="grid gap-8">
          {domains.map((domain) => (
            <section key={domain.id} id={domain.id} className="scroll-mt-8">
              <LearningSectionTitle title={domain.title} href={`/learn/courses?domain=${domain.id}`} action="Filtrer" />
              <div className="grid gap-4">
                {domain.themeGroups.map((group) => (
                  <div key={group.theme} className="rounded-[1.5rem] border border-white/8 bg-white/[0.035] p-4">
                    <h2 className="text-[16px] font-black text-white">{group.theme}</h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {group.courses.slice(0, 4).map((course) => (
                        <LearningCourseCard key={course.id} course={course} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </TabScreen>
  )
}
