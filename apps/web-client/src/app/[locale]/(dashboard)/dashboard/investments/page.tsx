import { ArrowRight, Leaf } from 'lucide-react'
import { requireAuth } from '@/app/[locale]/(auth)/_features/auth-guards'
import { Link } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockInvestments } from '@/lib/mock/mock-member-data'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ContributionsShell } from './_features/contributions-shell'

type InvestmentProject = {
  name_default: string | null
  slug: string | null
  status: string | null
  cover_image_url?: string | null
}

type NormalizedInvestment = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: InvestmentProject | null
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  completed: 'Terminé',
  pending: 'En attente',
}

const formatEuros = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

const normalizeProject = (raw: unknown): InvestmentProject | null => {
  const source = Array.isArray(raw) ? raw[0] : raw
  if (!source || typeof source !== 'object') return null
  const record = source as Record<string, unknown>
  return {
    name_default: typeof record.name_default === 'string' ? record.name_default : null,
    slug: typeof record.slug === 'string' ? record.slug : null,
    status: typeof record.status === 'string' ? record.status : null,
    cover_image_url:
      typeof record.cover_image_url === 'string'
        ? record.cover_image_url
        : typeof record.hero_image_url === 'string'
          ? record.hero_image_url
          : null,
  }
}

export default async function InvestmentsPage() {
  const user = await requireAuth()
  const rawInvestments = isMockDataSource
    ? getMockInvestments(user.id)
    : (
        await (await createClient())
          .from('investments')
          .select(`
            id,
            amount_eur_equivalent,
            amount_points,
            returns_received_points,
            status,
            created_at,
            project:public_projects!project_id(
              name_default,
              slug,
              status,
              hero_image_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ).data || []

  const userInvestments: NormalizedInvestment[] = (rawInvestments || []).map((inv) => ({
    id: String(inv.id),
    amount_eur: Number(inv.amount_eur_equivalent || 0),
    amount_points: Number(inv.amount_points || 0),
    status: String(inv.status || 'pending'),
    created_at: String(inv.created_at || new Date().toISOString()),
    project: normalizeProject(inv.project),
  }))

  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount_eur, 0)
  const totalPoints = userInvestments.reduce((sum, inv) => sum + inv.amount_points, 0)

  return (
    <ContributionsShell title="Historique">
      {/* 1. HERO - Titre de la page */}
      <div className="relative z-10 px-6 pt-24 pb-6">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white hyphens-none text-balance leading-[1.1]">
          Mes Contributions
        </h1>
        <p className="text-sm text-gray-400 text-pretty leading-[1.6]">
          L&apos;historique de votre impact sur le terrain.
        </p>
      </div>

      {/* 2. DASHBOARD GLOBAL - Carte Hero */}
      <div className="relative z-10 mx-6 mb-8 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1A1F26] to-[#0B0F15] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Impact Total Généré
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tighter text-white">
              {formatEuros(totalInvested)}
            </span>
            <span className="text-xl font-bold text-lime-400">€</span>
          </div>
          {totalPoints > 0 ? (
            <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg border border-lime-400/20 bg-lime-400/10 px-3 py-1.5">
              <span className="text-xs font-bold text-lime-400">
                + {formatEuros(totalPoints)} Points d&apos;Impact
              </span>
            </div>
          ) : null}
        </div>
        <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10">
          <Leaf className="h-32 w-32 text-lime-400" strokeWidth={1.2} />
        </div>
      </div>

      {/* 3. LISTE DES CONTRIBUTIONS */}
      {userInvestments.length > 0 ? (
        <div className="relative z-10 flex flex-col gap-4 px-6">
          {userInvestments.map((investment) => {
            const project = investment.project
            const href = project?.slug ? `/projects/${project.slug}` : null
            const isActive = investment.status === 'active'
            const statusLabel = STATUS_LABELS[investment.status] || investment.status

            const content = (
              <div className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#1A1F26] p-4 transition-colors hover:bg-white/[0.04]">
                {/* Gauche : Image + Textes */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {project?.cover_image_url ? (
                    // biome-ignore lint/performance/noImgElement: project cover can be remote
                    <img
                      src={project.cover_image_url}
                      alt={project.name_default || 'Projet'}
                      className="h-14 w-14 shrink-0 rounded-xl bg-[#0B0F15] object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">
                      <Leaf className="h-6 w-6 text-lime-400" />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col justify-center">
                    <h3 className="truncate text-base font-bold text-white">
                      {project?.name_default || 'Projet'}
                    </h3>
                    <span className="mt-0.5 text-xs text-gray-400">
                      {formatDate(investment.created_at)}
                    </span>
                  </div>
                </div>

                {/* Droite : Montant + Statut */}
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-base font-bold text-white">
                    {formatEuros(investment.amount_eur)} €
                  </span>
                  <span
                    className={
                      isActive
                        ? 'rounded-md border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-400'
                        : 'rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400'
                    }
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            )

            return href ? (
              <Link key={investment.id} href={href} className="block">
                {content}
              </Link>
            ) : (
              <div key={investment.id}>{content}</div>
            )
          })}
        </div>
      ) : (
        <div className="relative z-10 mx-6 flex flex-col items-center rounded-3xl border border-white/5 bg-[#1A1F26] p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10">
            <Leaf className="h-7 w-7 text-lime-400" />
          </div>
          <p className="mb-2 text-base font-bold text-white">Aucune contribution pour l&apos;instant</p>
          <p className="mb-6 text-sm text-gray-400 text-pretty">
            Soutenez un projet pour commencer à bâtir votre héritage d&apos;impact.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.15)] transition active:scale-[0.98]"
          >
            Découvrir les projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </ContributionsShell>
  )
}
