'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { MobileSheet } from '../ui/mobile-sheet'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'

type RelatedProject = {
  id: string
  slug: string
  type: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  hero_image_url: string | null
  current_funding: number | null
}

const FRENCH_TO_ISO: Record<string, string> = {
  'madagascar': 'MG',
  'france': 'FR',
  'belgique': 'BE',
  'italie': 'IT',
  'espagne': 'ES',
  'indonésie': 'ID',
  'indonesie': 'ID',
  'portugal': 'PT',
  'allemagne': 'DE',
  'maroc': 'MA',
  'sénégal': 'SN',
  'senegal': 'SN',
  'kenya': 'KE',
  'afrique du sud': 'ZA',
  'brésil': 'BR',
  'bresil': 'BR',
  'mexique': 'MX',
  'inde': 'IN',
  'chine': 'CN',
  'japon': 'JP',
  'australie': 'AU',
  'canada': 'CA',
  'états-unis': 'US',
  'etats-unis': 'US',
  'royaume-uni': 'GB',
  'suisse': 'CH',
  'pays-bas': 'NL',
  'grèce': 'GR',
  'grece': 'GR',
}

type ProjectCountrySheetProps = {
  countryCode: string
  countryName: string
  city?: string | null
  projectType?: string | null
  speciesCount: number
  relatedProjects: RelatedProject[]
  locale: string
}

function resolveIsoCode(code: string): string | null {
  const upper = code.trim().toUpperCase()
  if (/^[A-Z]{2}$/.test(upper)) return upper
  return FRENCH_TO_ISO[code.trim().toLowerCase()] ?? null
}

function countryCodeToFlag(code: string): string {
  const iso = resolveIsoCode(code)
  if (!iso) return ''
  const BASE = 0x1f1e6 - 65
  return [...iso].map((c) => String.fromCodePoint(c.charCodeAt(0) + BASE)).join('')
}

function getEcosystemLabel(projectType: string | null | undefined): string {
  const t = projectType?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef')) return 'Récifs & océans tropicaux'
  if (t.includes('orchard') || t.includes('olive')) return 'Terres agricoles vivantes'
  return 'Pollinisateurs & forêts'
}

function StatPill({
  emoji,
  value,
  label,
}: {
  emoji: string
  value: string | number
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="text-base leading-none">{emoji}</span>
      <div>
        <p className="text-sm font-black leading-tight text-white">{value}</p>
        {label ? <p className="mt-0.5 text-[10px] leading-tight text-white/40">{label}</p> : null}
      </div>
    </div>
  )
}

function MiniProjectCard({ project, locale }: { project: RelatedProject; locale: string }) {
  const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
  const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block w-28 shrink-0 text-left transition-transform active:scale-[0.97]"
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/5">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-tight text-white/80">{title}</p>
    </Link>
  )
}

export function ProjectCountrySheet({
  countryCode,
  countryName,
  city,
  projectType,
  speciesCount,
  relatedProjects,
  locale,
}: ProjectCountrySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const flag = countryCodeToFlag(countryCode)
  const ecosystemLabel = getEcosystemLabel(projectType)
  const totalProjects = relatedProjects.length + 1

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      {/* Country badge — clickable */}
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white/90 active:scale-[0.97]"
        >
          <span className="text-sm leading-none">{flag}</span>
          {countryName}
        </button>
      </div>

      {/* City — non-clickable */}
      {city ? (
        <p className="text-xs text-white/40">
          <span className="mr-1">📍</span>
          {city}
        </p>
      ) : null}

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${flag} ${countryName}`}
      >
        <p className="mt-1 text-sm text-white/50">
          {totalProjects > 1
            ? `${totalProjects} projets liés au vivant dans cette région`
            : 'Un projet lié au vivant dans cette région'}
        </p>

        {/* Map preview — CSS only, no library */}
        <div
          className="relative mt-4 h-28 overflow-hidden rounded-2xl border border-white/8"
          style={{
            background: '#050510',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 55% 45%, rgba(14,165,233,0.12) 0%, transparent 65%)',
            }}
          />
          <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_4px_rgba(14,165,233,0.6)]" />
          </div>
          <p className="absolute bottom-2.5 right-3 text-[10px] font-bold text-white/30">
            {countryName}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <StatPill emoji="🌿" value={totalProjects} label="projets actifs" />
          {speciesCount > 0 ? (
            <StatPill emoji="🦎" value={speciesCount} label="espèces dans le BioDex" />
          ) : null}
          <StatPill emoji="🐝" value={ecosystemLabel} label="écosystème" />
        </div>

        {/* Related projects horizontal scroll */}
        {relatedProjects.length > 0 ? (
          <div className="mt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              Autres projets dans la région
            </p>
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
              {relatedProjects.map((project) => (
                <MiniProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-6 pb-2">
          <Link
            href="/projects"
            className="text-sm font-semibold text-white/40 transition-colors hover:text-white/70"
          >
            Voir la carte complète →
          </Link>
        </div>
      </MobileSheet>
    </div>
  )
}
