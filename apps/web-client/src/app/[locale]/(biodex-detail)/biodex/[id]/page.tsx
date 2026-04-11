'use client'

import { ArrowLeft, ArrowRight, ChevronRight, Lock, ShieldCheck, TreePine, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'

const SPECIES_IMAGE_URL = '/images/diorama-chouette.png'
const ECOSYSTEM_PROJECTS_HREF = '/projects?search=abeilles&status=active'

export default function SpeciesPage() {
  const router = useRouter()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const toggleCard = (cardId: string) => {
    setExpandedCard((current) => (current === cardId ? null : cardId))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative mx-auto w-full max-w-2xl px-4 pt-6 pb-40">
        <button
          type="button"
          onClick={() => router.back()}
          className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 p-2"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        <section className="mb-8">
          <div className="relative mx-auto mt-4 mb-6 flex h-64 w-64 items-center justify-center">
            <div className="absolute top-1/2 left-1/2 z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/30 blur-[60px]" />
            <img
              src={SPECIES_IMAGE_URL}
              alt="Chouette Effraie"
              className="relative z-10 h-full w-full border-none object-contain ring-0 outline-none drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
              style={{ clipPath: 'circle(50%)' }}
            />
          </div>

          <div className="mx-auto mt-2 mb-4 w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Préoccupation Mineure
          </div>
          <h1 className="text-center text-4xl font-black tracking-tight text-white">Chouette Effraie</h1>
          <p className="mb-6 text-center font-serif italic text-white/40">Tyto alba</p>

          <div className="mx-4 mb-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-lime-400" />
            <p className="text-sm text-white/80">
              Espèce protégée grâce à votre soutien au projet{' '}
              <strong className="text-white">Sauvons les Abeilles</strong> le 12 Avril 2026.
            </p>
          </div>
        </section>

        <section>
          <p className="mb-8 px-4 text-center leading-relaxed text-white/70">
            Chasseur discret des nuits, la Chouette Effraie régule naturellement les populations de
            rongeurs et contribue à l'équilibre des écosystèmes ruraux.
          </p>

          <div className="mx-4 grid grid-cols-1 gap-3">
            <article
              className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300"
              onClick={() => toggleCard('habitat')}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <TreePine className="h-5 w-5 text-emerald-400" />
                  <p className="text-sm font-bold text-white">
                    HABITAT : <span className="font-medium text-white/85">Forêts &amp; Plaines</span>
                  </p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-white/60 transition-transform duration-300 ${expandedCard === 'habitat' ? 'rotate-90' : ''}`}
                />
              </div>
              {expandedCard === 'habitat' ? (
                <div className="px-4 pb-4 text-sm text-white/70">
                  Présente sur presque tous les continents, la chouette effraie privilégie les
                  milieux ouverts (champs, prairies) et niche souvent dans les vieux bâtiments
                  agricoles ou les clochers.
                </div>
              ) : null}
            </article>

            <article
              className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300"
              onClick={() => toggleCard('threats')}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <TriangleAlert className="h-5 w-5 text-red-400" />
                  <p className="text-sm font-bold text-white">MENACES PRINCIPALES</p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-white/60 transition-transform duration-300 ${expandedCard === 'threats' ? 'rotate-90' : ''}`}
                />
              </div>
              {expandedCard === 'threats' ? (
                <div className="px-4 pb-4 text-sm text-white/70">
                  <ul className="list-decimal space-y-1 pl-5">
                    <li>Disparition des vieilles granges (sites de nidification).</li>
                    <li>Empoisonnement indirect via les pesticides raticides.</li>
                    <li>Collisions routières.</li>
                  </ul>
                </div>
              ) : null}
            </article>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-white/10 bg-[#0B0F15]/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Niveau 1 / 3
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/30">
            <Lock className="h-3 w-3" />
            <span>500 🌱 pour améliorer</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            router.push(ECOSYSTEM_PROJECTS_HREF)
          }}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 text-lg font-black text-black shadow-[0_0_20px_rgba(132,204,22,0.2)] transition-transform active:scale-95"
        >
          Soutenir son écosystème
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
