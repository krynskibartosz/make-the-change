'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MobileSheet } from '../shared/mobile-sheet'
import { getTagline, getSupportChips, getReceiveChips } from '../../_utils/project-labels'

type ProjectBiodexSheetProps = {
  species: ProjectSpecies[]
  projectType?: string | null
  projectSlug?: string | null
  isDonationProject?: boolean
  description?: string
  producerName?: string
  producerLocation?: string
}

const SPECIES_THUMBNAILS: Record<string, string> = {
  'species-abeille-noire': '/images/species-thumbnails/abeille-noire.png',
  'species-indri': '/images/species-thumbnails/indri.png',
  'species-sifaka-diademe': '/images/species-thumbnails/sifaka-diademe.png',
  'species-vari-noir-blanc': '/images/species-thumbnails/vari-noir-blanc.png',
  'species-cameleon-parson': '/images/species-thumbnails/cameleon-parson.png',
  'species-cameleon-panthere': '/images/species-thumbnails/cameleon-panthere.png',
  'species-charancon-girafe': '/images/species-thumbnails/charancon-girafe.png',
  'species-grenouille-tomate': '/images/species-thumbnails/grenouille-tomate.png',
  'species-martin-chasseur-pygme': '/images/species-thumbnails/martin-chasseur-pygmee.png',
  'species-coua-bleu': '/images/species-thumbnails/coua-bleu.png',
  'species-gecko-diurne': '/images/species-thumbnails/gecko-diurne.png',
  'species-chouette-cheveche': '/images/species-thumbnails/chouette-cheveche.png',
  'species-liotrigona-bitika': '/images/species-thumbnails/liotrigona-bitika.png',
  'species-coccinelle-7-points': '/images/species-thumbnails/coccinelle-a-7-points.png',
  'species-olivier': '/images/species-thumbnails/olivier.png',
  'species-bourdon-terrestre': '/images/species-thumbnails/bourdon-terrestre.png',
  'species-osmie-rousse': '/images/species-thumbnails/osmie-rousse.png',
  'species-megachile': '/images/species-thumbnails/megachile.png',
  'species-syrphe-ceinture': '/images/species-thumbnails/syrphe-ceinture.png',
  'species-papillon-citron': '/images/species-thumbnails/papillon-citron.png',
  'species-paon-du-jour': '/images/species-thumbnails/paon-du-jour.png',
  'species-herisson-europeen': '/images/species-thumbnails/herisson-europeen.png',
  'species-huppe-fascie': '/images/species-thumbnails/huppe-fasciee.png',
  'species-apis-ligustica': '/images/species-thumbnails/abeille-mellifere-italienne.png',
  'species-acropora-corail-cerf': '/images/species-thumbnails/acropora-corail-cerf.png',
  'species-poisson-clown': '/images/species-thumbnails/poisson-clown.png',
  'species-demoiselle-bleue': '/images/species-thumbnails/demoiselle-bleue.png',
  'species-poisson-papillon': '/images/species-thumbnails/poisson-papillon.png',
  'species-hippocampe': '/images/species-thumbnails/hippocampe.png',
  'species-tortue-verte': '/images/species-thumbnails/tortue-verte.png',
}

// Only shown for threatened species — LC and DD are not meaningful to a general user
const THREATENED_STATUS: Record<string, { label: string; color: string }> = {
  CR: { label: 'En danger critique', color: 'text-red-400/80' },
  EN: { label: 'En danger', color: 'text-orange-400/80' },
  VU: { label: 'Vulnérable', color: 'text-amber-400/80' },
  NT: { label: 'Quasi menacée', color: 'text-yellow-400/70' },
}

type CycleStep = { label: string; description: string }

type KeyElementOverride = {
  name: string
  role: string
  imageUrl?: string
}

type ProjectCycle = {
  subtitle: string
  narrative: string
  steps: [CycleStep, CycleStep, CycleStep, CycleStep]
  keyElementOverride?: KeyElementOverride
}

function getProjectCycle(
  projectType: string | null | undefined,
  projectSlug: string | null | undefined,
): ProjectCycle {
  const slug = projectSlug ?? ''
  const type = projectType?.toLowerCase() ?? ''

  // ── Slug-based matching (beehive subtypes) ──────────────────────────────

  if (slug === 'miellerie-manakara-ilanga-nature') {
    return {
      subtitle: 'Comment votre soutien structure une filière de transformation locale.',
      narrative:
        "La miellerie de Manakara est le maillon manquant entre les ruchers isolés et les marchés. Elle offre aux apiculteurs partenaires un point de collecte, de contrôle et de conditionnement qui valorise leur travail à un prix juste.",
      steps: [
        { label: 'Miel récolté', description: "Les apiculteurs livrent le miel issu de leurs ruches dans des conditions maîtrisées." },
        { label: 'Qualité contrôlée', description: "Le miel est analysé pour vérifier son origine, sa pureté et sa conformité aux normes d'export." },
        { label: 'Miel conditionné', description: "Le miel est filtré, mis en pot et préparé pour la distribution dans une chaîne traçable." },
        { label: 'Valeur redistribuée', description: "La filière permet aux apiculteurs de percevoir un meilleur prix pour leur production." },
      ],
    }
  }

  if (slug === 'habeebee-belgique') {
    return {
      subtitle: 'Comment votre soutien renforce les pollinisateurs en milieu urbain.',
      narrative:
        "Installer des ruches en ville, c'est créer des points d'observation, sensibiliser les habitants et démontrer que les pollinisateurs peuvent cohabiter avec les espaces urbains — bien au-delà de la production de miel.",
      steps: [
        { label: 'Ruches installées', description: "Des ruches sont placées dans des environnements urbains adaptés, suivis par des apiculteurs formés." },
        { label: 'Colonies observées', description: "Les colonies sont surveillées régulièrement pour garantir leur équilibre et prévenir les problèmes sanitaires." },
        { label: 'Ressources florales butinées', description: "Les abeilles utilisent les espaces verts et jardins locaux, contribuant à la pollinisation du territoire urbain." },
        { label: 'Habitants sensibilisés', description: "Le projet rend visible le rôle des pollinisateurs et recrée un lien entre la ville et le vivant." },
      ],
    }
  }

  // ── Type-based matching ─────────────────────────────────────────────────

  if (type === 'equipment') {
    return {
      subtitle: 'Comment votre soutien apporte la transformation directement sur le terrain.',
      narrative:
        "Sans infrastructure fixe accessible, de nombreux apiculteurs isolés peinent à valoriser leur miel. Les mielleries mobiles vont directement à eux — réduisant les pertes, améliorant la qualité et renforçant la filière là où elle est la plus fragile.",
      keyElementOverride: {
        name: 'Miellerie mobile',
        role: 'Collecte et transformation de proximité',
        imageUrl: '/images/projects/miellerie-mobile.png',
      },
      steps: [
        { label: 'Zones reculées rejointes', description: "La miellerie mobile se rapproche des apiculteurs éloignés des infrastructures fixes." },
        { label: 'Miel collecté sur place', description: "Le miel est récupéré près des ruchers, dans de meilleures conditions sanitaires et logistiques." },
        { label: 'Transformation facilitée', description: "Le matériel embarqué permet de filtrer, contrôler et préparer le miel directement sur le terrain." },
        { label: 'Filière renforcée', description: "Les apiculteurs gagnent en accès, en qualité et en valeur pour leur production." },
      ],
    }
  }

  if (type.includes('reef') || type.includes('coral') || type.includes('ocean')) {
    return {
      subtitle: 'Comment votre soutien relance un récif dégradé, étape par étape.',
      narrative:
        "Restaurer un récif, c'est d'abord choisir le bon site, cultiver des fragments en nurserie, puis les transplanter avec soin. Le vrai travail commence après : suivi terrain, implication des communautés locales et protection dans la durée.",
      steps: [
        { label: 'Site identifié et préparé', description: "Une zone dégradée est évaluée par l'équipe terrain avant toute intervention." },
        { label: 'Nurserie marine', description: 'Les fragments de corail sont cultivés en milieu contrôlé avant leur transplantation.' },
        { label: 'Récif revitalisé', description: "Les coraux implantés stabilisent progressivement la zone et créent un habitat pour la faune locale." },
        { label: 'Communauté impliquée', description: "Des équipes locales assurent le suivi à long terme et sensibilisent à la protection du récif." },
      ],
    }
  }

  if (type.includes('orchard') || type.includes('olive')) {
    return {
      subtitle: 'Comment votre soutien préserve un verger et une filière locale.',
      narrative:
        "Derrière chaque bouteille d'huile se trouve un oléiculteur qui entretient des arbres souvent centenaires. Ce projet soutient ce travail discret mais essentiel : entretien des sols, récolte au bon moment et valorisation équitable.",
      steps: [
        { label: 'Producteurs accompagnés', description: "Des oléiculteurs locaux reçoivent un soutien pour entretenir et valoriser leur verger." },
        { label: 'Arbres centenaires préservés', description: "L'entretien évite l'abandon d'oliviers qui peuvent vivre plusieurs siècles et fixer durablement les sols." },
        { label: 'Biodiversité du sol', description: "Les pratiques agroécologiques maintiennent l'équilibre entre racines, faune du sol et couvert végétal." },
        { label: 'Filière tracée et juste', description: "La récolte est transformée et commercialisée dans des conditions qui rémunèrent équitablement les producteurs." },
      ],
    }
  }

  // default: ruchers d'apiculteurs
  return {
    subtitle: 'Comment votre soutien accompagne des apiculteurs et leur territoire.',
    narrative:
      "Au-delà des chiffres, ce projet soutient des familles d'apiculteurs qui travaillent en milieu souvent isolé. Un suivi régulier maintient les colonies en bonne santé, protège la pollinisation locale et permet de valoriser le miel à un prix juste.",
    steps: [
      { label: 'Apiculteurs accompagnés', description: "Des familles d'apiculteurs locaux reçoivent un soutien technique et financier pour maintenir leurs colonies." },
      { label: 'Colonies en bonne santé', description: 'Un suivi régulier protège les ruches face aux parasites, aux maladies et aux aléas climatiques.' },
      { label: 'Pollinisation du territoire', description: "Les abeilles jouent un rôle clé dans la reproduction des plantes locales — un impact qui dépasse largement la production de miel." },
      { label: 'Filière locale valorisée', description: 'Le miel est commercialisé à un prix juste, créant un revenu durable pour les producteurs du territoire.' },
    ],
  }
}

function getSpeciesImageUrl(species: ProjectSpecies): string | null {
  return SPECIES_THUMBNAILS[species.id] ?? sanitizeImageUrl(species.icon)
}

function formatCommonName(name: string): string {
  if (!name) return ''
  const lower = name.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
      {children}
    </p>
  )
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/50">
      {children}
    </span>
  )
}

function ChipCloud({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <Chip key={chip}>{chip}</Chip>
      ))}
    </div>
  )
}

function SpeciesContextCard({
  species,
  compact = false,
}: {
  species: ProjectSpecies
  compact?: boolean
}) {
  const imageUrl = getSpeciesImageUrl(species)
  const statusInfo = THREATENED_STATUS[species.status?.toUpperCase()] ?? null
  const imgSize = compact ? 'h-11 w-11' : 'h-14 w-14'

  return (
    <div className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
      <div className={`${imgSize} shrink-0 overflow-hidden rounded-xl bg-white/[0.06]`}>
        {imageUrl ? (
          <img src={imageUrl} alt={formatCommonName(species.name)} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight text-white">
          {formatCommonName(species.name)}
        </p>
        {species.contextSentence ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-white/55">
            {species.contextSentence}
          </p>
        ) : null}
        {statusInfo ? (
          <p className={`mt-1.5 text-[10px] font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function KeyElementCard({
  name,
  role,
  imageUrl,
}: {
  name: string
  role: string
  imageUrl: string | null | undefined
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-white/[0.04] p-3">
      <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-black leading-tight text-white">{name}</p>
        {role ? <p className="mt-0.5 text-[12px] text-lime-400/80">{role}</p> : null}
        <span className="mt-2 inline-flex rounded-full bg-lime-300/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-lime-300">
          Au cœur du projet
        </span>
      </div>
    </div>
  )
}

function CycleLabels({ steps }: { steps: ProjectCycle['steps'] }) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[10px] font-black text-lime-400/80">
            {index + 1}
          </div>
          <p className="text-[13px] font-bold text-white">{step.label}</p>
        </div>
      ))}
    </div>
  )
}

function CycleSteps({ steps }: { steps: ProjectCycle['steps'] }) {
  return (
    <div>
      {steps.map((step, index) => (
        <div key={step.label} className="flex gap-3 py-2.5">
          <div className="flex flex-col items-center">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[10px] font-black text-lime-400/80">
              {index + 1}
            </div>
            {index < steps.length - 1 ? (
              <div className="mt-1 w-px flex-1 bg-white/[0.06]" style={{ minHeight: '16px' }} />
            ) : null}
          </div>
          <div className="min-w-0 pb-2">
            <p className="text-[13px] font-bold text-white">{step.label}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-white/50">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrackingStep({
  number,
  title,
  body,
  chips,
  isLast,
}: {
  number: number
  title: string
  body?: string
  chips?: string[]
  isLast?: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.08] text-xs font-black text-white">
          {number}
        </div>
        {!isLast && <div className="mt-1.5 h-full min-h-[24px] w-px bg-white/[0.08]" />}
      </div>
      <div className={`min-w-0 ${isLast ? 'pb-0' : 'pb-7'} pt-0.5`}>
        <p className="text-base font-bold text-white">{title}</p>
        {body ? <p className="mt-1 text-sm leading-relaxed text-white/60">{body}</p> : null}
        {chips && chips.length > 0 ? (
          <div className="mt-2">
            <ChipCloud chips={chips} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectBiodexSheet({
  species,
  projectType,
  projectSlug,
  isDonationProject = false,
  description,
  producerName,
  producerLocation,
}: ProjectBiodexSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const cycle = getProjectCycle(projectType, projectSlug)
  const tagline = getTagline(projectType, isDonationProject)
  const actionChips = getSupportChips(projectType, isDonationProject)
  const receiveChips = getReceiveChips(isDonationProject)

  const step1Title = isDonationProject ? 'Vous faites un don' : 'Vous soutenez ce projet'
  const step1Body = isDonationProject
    ? "Votre don est rattaché à ce projet et à l'équipe qui le porte."
    : 'Votre contribution est rattachée à ce projet et au partenaire qui le porte.'
  const step1Disclaimer = isDonationProject
    ? "Ce don n'est pas un achat produit ni une promesse de rendement. Il ne donne pas droit à des Crédits Impact."
    : "Ce soutien n'est pas un achat produit, un investissement financier ou une promesse de rendement."
  const step2Title = isDonationProject ? "L'équipe agit sur le terrain" : 'Le partenaire agit sur le terrain'
  const step2Intro = isDonationProject
    ? 'Le don peut aider à financer ou accompagner certaines actions concrètes :'
    : 'Le soutien peut aider à financer ou accompagner certaines actions concrètes :'
  const step3Title = isDonationProject ? "Vous suivez l'évolution" : 'Vous recevez des nouvelles'

  // Max 2 species on main page — only those with a context sentence
  const speciesWithContext = (species ?? []).filter((sp) => sp.contextSentence)
  const previewSpecies = speciesWithContext.slice(0, 2)

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-5">
        <p className="text-[18px] font-black leading-none tracking-[-0.03em] text-white">
          Comprendre ce projet
        </p>
        <p className="mt-1 text-[12px] leading-snug text-white/50">{cycle.subtitle}</p>
      </div>

      {/* ── Espèces concernées (preview) ── */}
      {previewSpecies.length > 0 ? (
        <div className="mb-5 space-y-2">
          {previewSpecies.map((sp) => (
            <SpeciesContextCard key={sp.id} species={sp} />
          ))}
        </div>
      ) : null}

      {/* ── Cycle : labels seulement ── */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
          Le cycle du projet
        </p>
        <CycleLabels steps={cycle.steps} />
      </div>

      {/* ── Bouton ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 flex w-full items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-white/70">Voir le détail complet</span>
          <span className="text-xs text-white/35">Histoire, cycle détaillé et suivi terrain</span>
        </div>
        <ChevronUp className="h-4 w-4 shrink-0 text-white/25" />
      </button>

      {/* ── Sheet ── */}
      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Comprendre ce projet">

        {/* 1. Histoire */}
        {description ? (
          <div className="mt-2">
            <p className="text-[13px] italic leading-relaxed text-white/40">{tagline}</p>
            <div className="mt-5">
              <SectionLabel>Pourquoi ce projet existe</SectionLabel>
              <p className="text-sm leading-relaxed text-white/70">{description}</p>
              {producerName ? (
                <p className="mt-2 text-[12px] text-white/35">
                  {[`Porté par ${producerName}`, producerLocation].filter(Boolean).join(' · ')}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* 2. Mécanisme */}
        <div className={description ? 'mt-8' : 'mt-2'}>
          {cycle.keyElementOverride ? (
            <>
              <SectionLabel>Au cœur du projet</SectionLabel>
              <KeyElementCard
                name={cycle.keyElementOverride.name}
                role={cycle.keyElementOverride.role}
                imageUrl={cycle.keyElementOverride.imageUrl}
              />
              <div className="mt-5">
                <SectionLabel>Le cycle du projet</SectionLabel>
                <CycleSteps steps={cycle.steps} />
              </div>
            </>
          ) : (
            <>
              <p className="mb-1 text-[13px] leading-relaxed text-white/50">{cycle.narrative}</p>
              <div className="mt-5">
                <SectionLabel>Le cycle du projet</SectionLabel>
                <CycleSteps steps={cycle.steps} />
              </div>
            </>
          )}
        </div>

        {/* 3. Espèces concernées */}
        {speciesWithContext.length > 0 ? (
          <div className="mt-8">
            <SectionLabel>Espèces concernées</SectionLabel>
            <div className="space-y-2">
              {speciesWithContext.map((sp) => (
                <SpeciesContextCard key={sp.id} species={sp} compact />
              ))}
            </div>
          </div>
        ) : null}

        {/* 4. Du soutien au terrain */}
        <div className="mt-8">
          <SectionLabel>Du soutien au terrain</SectionLabel>
          <TrackingStep number={1} title={step1Title} body={step1Body} />
          <TrackingStep number={2} title={step2Title} body={step2Intro} chips={actionChips} />
          <TrackingStep number={3} title={step3Title} chips={receiveChips} isLast />
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            Note de prudence
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/40">
            Le suivi dépend des informations disponibles et transmises par le partenaire. Il
            documente l&apos;avancement du projet, sans garantir un résultat précis.
          </p>
        </div>
        <p className="mt-3 pb-2 text-[10px] leading-relaxed text-white/20">{step1Disclaimer}</p>
      </MobileSheet>
    </>
  )
}
