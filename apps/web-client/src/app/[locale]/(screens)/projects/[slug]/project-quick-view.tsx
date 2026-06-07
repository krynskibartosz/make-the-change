import { Progress } from '@make-the-change/core/ui'
import {
  BadgeCheck,
  ChevronRight,
  Gift,
  Globe,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Sprout,
} from 'lucide-react'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import type {
  DonationOption,
  ProducerProduct,
  ProjectSpecies,
  SupportRewardTier,
} from '@/app/[locale]/(screens)/projects/_types/project'
import { Link } from '@/i18n/navigation'
import { formatAmountNumber } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getCountryDisplayName, resolveCountryCode } from '@/lib/location'
import { getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { type ProjectDetailTab, ProjectDetailTabs } from './_components/project-detail-tabs'
import { ProjectUpdatesFeed } from './_components/project-updates-feed'
import { ProjectBiodexSheet } from './_components/quick-view/biodex-sheet'
import { ProjectCountrySheet } from './_components/quick-view/country-sheet'
import { ProjectFundingSheet } from './_components/quick-view/funding-sheet'
import { ProjectQuickViewHero } from './_components/quick-view/hero'
import { ProjectImpactPreview } from './_components/quick-view/impact-preview'
import { ProjectPartnerAdvantagesSection } from './_components/shared/partner-advantages'
import { ProjectProducerProductsSection } from './_components/shared/producer-products'
import { SimilarProjectsCarousel } from './_components/shared/similar-projects-carousel'
import { buildProjectImpactItems } from './_utils/build-project-impact-items'
import {
  getProjectGlowTone,
  makeProjectGlowRgba,
  type ProjectGlowTone,
} from './_utils/project-glow'
import type { PublicProject, RelatedProject } from './project-detail-data'
import { getProjectUpdates } from './project-detail-data'

type ProjectQuickViewProps = {
  project: PublicProject
  species: ProjectSpecies[] | null
  producerProducts: ProducerProduct[] | null
  producerAdvantages: Advantage[]
  relatedProjects: RelatedProject[]
}

const PROGRESS_INDICATOR_CLASS: Record<ProjectGlowTone, string> = {
  yellow: 'bg-gradient-to-r from-amber-500/60 to-lime-400/50',
  blue: 'bg-gradient-to-r from-sky-500/60 to-teal-400/50',
  green: 'bg-gradient-to-r from-emerald-600/60 to-emerald-400/50',
}

const getWebsiteLabel = (url: string | null): string | null => {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function getSupportTierHref(projectSlug: string, tier?: SupportRewardTier): string {
  const params = new URLSearchParams({ source: 'quick_view' })
  if (tier) params.set('tier', tier.id)
  return `/projects/${projectSlug}/support?${params.toString()}`
}

function getDonationOptionHref(projectSlug: string, optionId: string): string {
  const params = new URLSearchParams({ source: 'quick_view', option: optionId })
  return `/projects/${projectSlug}/contribute?${params.toString()}`
}

function getSupportRewardImage(
  tier: SupportRewardTier,
  projectType: string | null | undefined,
  fallbackImage?: string,
): string {
  const text = `${tier.id} ${tier.title} ${tier.rewardLabel ?? ''}`.toLowerCase()

  if (projectType === 'orchard' || projectType === 'olive_tree' || text.includes('olive')) {
    if (text.includes('pack')) return '/images/projects/oliveraie-sardaigne.png'
    return '/images/products/huile-leccino.png'
  }

  if (text.includes('habeebee') || text.includes('savon')) {
    if (text.includes('atelier') || tier.rewardType === 'digital') {
      return '/images/producteurs/habeebee/media/story-1-habeebeeculture-formation.webp'
    }
    return '/new-product-img-to-integrate/habeebee-bee-surprised.webp'
  }

  if (text.includes('box') || text.includes('pack') || text.includes('miel')) {
    return '/new-product-img-to-integrate/ilanga-collection-3-miels.webp'
  }

  return fallbackImage ?? '/images/projects/antsirabe-ruchers-1.jpg'
}

function getDonationOptionImage(
  option: DonationOption,
  projectType: string | null | undefined,
  fallbackImage?: string,
): string {
  const text = `${option.id} ${option.name}`.toLowerCase()

  if (projectType === 'reef' || projectType === 'coral' || text.includes('corail')) {
    return '/images/producteurs/trilogy/media/youtube-1-coral-garden.jpg'
  }

  return fallbackImage ?? '/images/projects/coral-karimunjawa.png'
}

function getSupportTierCtaLabel(tier: SupportRewardTier): string {
  if (tier.rewardType === 'none') return 'Choisir ce soutien'
  if (tier.title.toLowerCase().includes('box')) return 'Choisir la box'
  if (tier.title.toLowerCase().includes('pack')) return 'Choisir le pack'
  return 'Choisir cette contrepartie'
}

function getSupportTierBadgeLabel(tier: SupportRewardTier): string | null {
  if (tier.amount === 60 && tier.rewardType !== 'none') return 'Recommandé'
  return null
}

function getOverviewSummary(
  projectType: string | null | undefined,
  locationLabel: string | null,
  fallbackDescription: string,
): string {
  const type = projectType?.toLowerCase() ?? ''
  const place = locationLabel ? `à ${locationLabel}` : 'sur le terrain'

  if (type === 'beehive') {
    return `Ce projet accompagne des apiculteurs ${place} avec du suivi terrain, de l’équipement apicole et une meilleure valorisation du miel.`
  }

  if (type === 'orchard' || type === 'olive_tree') {
    return `Ce projet soutient des producteurs ${place} en renforçant les plantations, le suivi terrain et la valorisation de leur production.`
  }

  if (type === 'reef' || type === 'coral' || type === 'marine') {
    return `Ce projet finance une action terrain ${place}: restauration, suivi scientifique et preuve d’impact après contribution.`
  }

  return (
    fallbackDescription ||
    `Un projet terrain concret ${place}, avec suivi, preuve d’impact et mises à jour après soutien.`
  )
}

function getOverviewUseCases(
  projectType: string | null | undefined,
  isContributionProject: boolean,
): Array<{ icon: ReactNode; title: string; description: string }> {
  const type = projectType?.toLowerCase() ?? ''

  if (type === 'beehive') {
    return [
      {
        icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
        title: 'Suivre les colonies',
        description: 'Financer l’observation terrain des ruches et de leur état sanitaire.',
      },
      {
        icon: <PackageCheck className="h-4 w-4" aria-hidden="true" />,
        title: 'Équiper les apiculteurs',
        description: 'Aider les producteurs à travailler avec du matériel plus fiable et adapté.',
      },
      {
        icon: <Sprout className="h-4 w-4" aria-hidden="true" />,
        title: 'Valoriser le miel',
        description: 'Mieux collecter, préparer et vendre le miel produit localement.',
      },
    ]
  }

  if (type === 'orchard' || type === 'olive_tree') {
    return [
      {
        icon: <Sprout className="h-4 w-4" aria-hidden="true" />,
        title: 'Entretenir les parcelles',
        description: 'Financer les soins, la plantation et le suivi des arbres dans le temps.',
      },
      {
        icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
        title: 'Documenter le terrain',
        description: 'Recevoir des preuves simples sur les actions réalisées et leur avancée.',
      },
      {
        icon: <PackageCheck className="h-4 w-4" aria-hidden="true" />,
        title: 'Valoriser la production',
        description: 'Aider le producteur à mieux transformer et distribuer ses produits.',
      },
    ]
  }

  return [
    {
      icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
      title: isContributionProject ? 'Financer l’action' : 'Soutenir le terrain',
      description: isContributionProject
        ? 'Votre contribution finance directement les étapes utiles du projet.'
        : 'Votre soutien aide le partenaire à avancer sur les actions prioritaires.',
    },
    {
      icon: <BadgeCheck className="h-4 w-4" aria-hidden="true" />,
      title: 'Rendre le suivi lisible',
      description: 'Les actualités et preuves terrain montrent ce qui se passe après le paiement.',
    },
    {
      icon: <Sprout className="h-4 w-4" aria-hidden="true" />,
      title: 'Mesurer l’impact',
      description: 'Les indicateurs résument les effets attendus et les progrès du projet.',
    },
  ]
}

function OverviewUseCaseRow({
  icon,
  title,
  description,
  accentColor,
}: {
  icon: ReactNode
  title: string
  description: string
  accentColor: string
}) {
  return (
    <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 border-b border-white/[0.07] py-4 last:border-b-0">
      <div
        className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.04]"
        style={{ color: accentColor }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-black leading-snug text-white">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  )
}

function EditorialRewardRow({
  href,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  amount,
  ctaLabel,
  meta,
  accentLine,
  badgeLabel,
  mediaIcon,
}: {
  href: string
  imageSrc?: string | null
  imageAlt?: string
  eyebrow: string
  title: string
  description: string
  amount: string
  ctaLabel: string
  meta: ReactNode
  accentLine?: string | null
  badgeLabel?: string | null
  mediaIcon?: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-white/[0.08] px-4 py-5 transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-400/60 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center sm:px-5"
    >
      <div className="relative grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-lg bg-white/[0.04] sm:h-[92px] sm:w-[92px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="92px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(190,242,100,0.18),transparent_42%),rgba(255,255,255,0.025)] text-lime-300">
            {mediaIcon ?? <HeartHandshake className="h-7 w-7" aria-hidden="true" />}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
            {eyebrow}
          </p>
          {badgeLabel ? (
            <span className="rounded-full bg-lime-300/12 px-2 py-0.5 text-[10px] font-black text-lime-300/85">
              {badgeLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3 sm:block">
          <h3 className="text-[17px] font-black leading-tight text-white">{title}</h3>
          <p className="shrink-0 text-[17px] font-black tabular-nums text-lime-300 sm:hidden">
            {amount}
          </p>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">{description}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-white/36">
          {meta}
        </div>
        {accentLine ? (
          <p className="mt-2 text-[11px] font-black leading-snug text-amber-300/78">{accentLine}</p>
        ) : null}
      </div>

      <div className="col-span-2 flex items-center justify-between border-t border-white/[0.06] pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
        <p className="hidden text-2xl font-black tabular-nums text-lime-300 sm:block">{amount}</p>
        <span className="inline-flex items-center gap-1 text-[12px] font-black text-white/50 transition-colors group-hover:text-white sm:mt-3">
          {ctaLabel}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

function resolveProducerPath(producer: { slug: string | null; id: string } | null): string | null {
  if (!producer) return null
  const identifier = producer.slug || producer.id
  return identifier ? `/producers/${identifier}` : null
}

function getSimilarProjectsTitleKey(
  type: string | null | undefined,
): 'detail.similar_ocean' | 'detail.similar_land' | 'detail.similar_pollinators' {
  const t = type?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) {
    return 'detail.similar_ocean'
  }
  if (t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) {
    return 'detail.similar_land'
  }
  return 'detail.similar_pollinators'
}

export async function ProjectQuickView({
  project,
  species,
  producerProducts,
  producerAdvantages,
  relatedProjects,
}: ProjectQuickViewProps) {
  const [t, locale] = await Promise.all([getTranslations('projects'), getLocale()])

  const glowTone = getProjectGlowTone(project.type)
  const glowRgba = makeProjectGlowRgba(project.type)

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress =
    project.funding_progress ??
    (targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0)

  const coverImage =
    sanitizeImageUrl(project.hero_image_url) ??
    (Array.isArray(project.images) && project.images.length > 0
      ? (sanitizeImageUrl(project.images[0]) ?? undefined)
      : undefined)

  const producerImage = project.producer?.visualAssets?.portrait
    ? (sanitizeImageUrl(project.producer.visualAssets.portrait) ?? undefined)
    : project.producer?.images &&
        Array.isArray(project.producer.images) &&
        project.producer.images.length > 0
      ? (sanitizeImageUrl(project.producer.images[0]) ?? undefined)
      : undefined

  const resolvedIso = project.address_country_code
    ? resolveCountryCode(project.address_country_code)
    : null
  const countryName = resolvedIso
    ? getCountryDisplayName(resolvedIso, locale)
    : (project.address_country_code ?? null)
  const projectLocationLabel =
    [project.address_city, countryName].filter(Boolean).join(' · ') || null
  const launchDateFormatted = project.launch_date
    ? new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(project.launch_date),
      )
    : null

  const normalizedStatus = project.status?.toLowerCase() || null
  const isFundingClosed = normalizedStatus === 'completed' || normalizedStatus === 'funded'
  const projectName = getLocalizedContent(project.name_i18n, locale, project.name_default)

  // Short description for the hero (1–2 sentences, decisive)
  const projectDescription = getLocalizedContent(
    project.description_i18n,
    locale,
    project.description_default || '',
  )

  // Narrative description for the story sheet (long_description preferred, falls back to short)
  const narrativeDescription = getLocalizedContent(
    project.long_description_i18n,
    locale,
    project.long_description_default || projectDescription,
  )

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'
  const producerDescription = project.producer
    ? getLocalizedContent(
        project.producer.description_i18n,
        locale,
        project.producer.description_default || '',
      )
    : t('subtitle')
  const websiteUrl = project.producer?.contact_website || null
  const websiteLabel = getWebsiteLabel(websiteUrl)
  const producerHref = resolveProducerPath(project.producer)

  const isContributionProject = !!(project.is_donation_project && project.donation_options?.length)
  const supportPath = isContributionProject
    ? `/projects/${project.slug}/contribute?source=quick_view`
    : `/projects/${project.slug}/support?source=quick_view`
  const rewardTabLabel = isContributionProject ? 'Paliers' : 'Contreparties'
  const supportRewardTiers = project.support_reward_tiers ?? []
  const donationOptions = project.donation_options ?? []

  const galleryMedia = [
    ...new Set([
      ...(project.hero_image_url ? [project.hero_image_url] : []),
      ...(Array.isArray(project.images) ? project.images : []),
    ]),
  ]

  const titleTransitionName = getEntityViewTransitionName('project', project.id, 'title')

  const impactItems = buildProjectImpactItems({
    amount: currentFunding,
    projectType: project.type,
    isContributionProject,
    donationOptions: project.donation_options,
    projectImpact: project.expected_impact,
  })
  const projectUpdates = getProjectUpdates(project.slug)
  const latestProjectUpdate = projectUpdates[0] ?? null

  const partnerLabel = isContributionProject
    ? t('detail.partner_label_contribution')
    : t('detail.partner_label_support')
  const fundingTitle = isContributionProject
    ? t('detail.funding_title_contribution')
    : t('detail.funding_title_support')
  const fundingSubtext = isContributionProject
    ? t('detail.funding_subtext_contribution')
    : t('detail.funding_subtext_support')
  const similarTitle = t(getSimilarProjectsTitleKey(project.type))
  const overviewSummary = getOverviewSummary(project.type, projectLocationLabel, projectDescription)
  const overviewUseCases = getOverviewUseCases(project.type, isContributionProject)
  const overviewTrustText = project.producer
    ? `Projet porté avec ${producerName}${projectLocationLabel ? `, partenaire terrain à ${projectLocationLabel}` : ''}. Le suivi, les actualités et les preuves d’impact permettent de comprendre ce qui se passe après votre soutien.`
    : 'Projet suivi par Make the Change, avec des actualités et des preuves d’impact pour rendre l’avancement lisible après votre soutien.'

  const producerPanel = project.producer ? (
    <div className="px-4 pt-6 sm:px-5">
      <div className="h-px bg-white/[0.06]" />
      <p className="py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
        {partnerLabel}
      </p>
      <div className="h-px bg-white/[0.06]" />

      {producerHref ? (
        <Link
          href={producerHref}
          className="group flex w-full cursor-pointer items-center gap-4 py-4 transition-all duration-200 hover:bg-white/[0.03] active:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-lime-400/60"
        >
          {producerImage ? (
            <Image
              src={producerImage}
              alt={producerName}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
              {producerName?.[0]?.toUpperCase() || 'M'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground underline-offset-4 group-hover:underline">
              {producerName}
            </p>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
              {producerDescription}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/20" aria-hidden="true" />
        </Link>
      ) : (
        <div className="flex w-full items-center gap-4 py-4">
          {producerImage ? (
            <Image
              src={producerImage}
              alt={producerName}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
              {producerName?.[0]?.toUpperCase() || 'M'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{producerName}</p>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
              {producerDescription}
            </p>
          </div>
          {websiteUrl && websiteLabel ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <Globe className="h-3 w-3" aria-hidden="true" />
              {websiteLabel}
            </a>
          ) : null}
        </div>
      )}

      {producerAdvantages.length > 0 ? (
        <div className="mt-10">
          <ProjectPartnerAdvantagesSection
            advantages={producerAdvantages}
            producerName={producerName}
          />
        </div>
      ) : null}

      {!isContributionProject && producerProducts && producerProducts.length > 0 ? (
        <div className="mt-10">
          <ProjectProducerProductsSection products={producerProducts} />
        </div>
      ) : null}
    </div>
  ) : (
    <div className="px-4 pt-6 text-sm text-white/45 sm:px-5">
      Aucun producteur n'est rattaché à ce projet pour le moment.
    </div>
  )

  const fundingPanel = (
    <div className="px-4 sm:px-5">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        {fundingTitle}
      </p>
      <p className="mb-3 text-xs leading-relaxed text-white/40">{fundingSubtext}</p>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span
              className="text-2xl font-bold tabular-nums tracking-tight"
              style={{ color: glowRgba(0.9) }}
            >
              {formatAmountNumber(currentFunding)}{' '}
              <span style={{ color: glowRgba(0.55) }} className="text-lg">
                EUR
              </span>
            </span>
            <span className="ml-2 text-sm font-medium tabular-nums text-white/50">
              / {formatAmountNumber(targetBudget)} EUR
            </span>
          </div>
          <span className="text-sm font-bold tabular-nums tracking-tight text-white">
            {Math.round(fundingProgress)}%
          </span>
        </div>
        <Progress
          value={fundingProgress}
          className="h-2 rounded-full bg-[#141C26]"
          indicatorClassName={PROGRESS_INDICATOR_CLASS[glowTone]}
        />
      </div>
      <ProjectFundingSheet
        targetBudget={targetBudget}
        currentFunding={currentFunding}
        fundingProgress={fundingProgress}
        projectType={project.type}
        isContributionProject={isContributionProject}
        fundingTitle={fundingTitle}
        indicatorClassName={PROGRESS_INDICATOR_CLASS[glowTone]}
      />
    </div>
  )

  const rewardsPanel = (
    <section className="px-4 pt-6 sm:px-5">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        {rewardTabLabel}
      </p>
      <h2 className="text-2xl font-black tracking-tight text-white">
        {isContributionProject
          ? 'Choisir un palier de contribution'
          : 'Choisissez comment soutenir ce projet'}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/48">
        {isContributionProject
          ? 'Ces paliers financent le projet et activent le suivi terrain, sans contrepartie produit.'
          : 'Soutenez sans colis ou choisissez une contrepartie produit. Vous pourrez refuser la contrepartie au paiement.'}
      </p>

      <div className="-mx-4 mt-7 border-t border-white/[0.08] sm:-mx-5">
        {isContributionProject ? (
          donationOptions.map((option) => (
            <EditorialRewardRow
              key={option.id}
              href={getDonationOptionHref(project.slug, option.id)}
              imageSrc={getDonationOptionImage(option, project.type, coverImage)}
              imageAlt={option.name}
              eyebrow="Contribution"
              title={option.name}
              description={
                option.impact.description ?? `${option.quantity} ${option.unitLabel} soutenu(s)`
              }
              amount={`${formatAmountNumber(option.price)} €`}
              ctaLabel="Contribuer"
              meta={
                <>
                  {option.rewards.certificate ? <span>Recu de contribution</span> : null}
                  {option.rewards.photo ? <span>Photos terrain</span> : null}
                  {option.rewards.location ? <span>Localisation</span> : null}
                  {option.rewards.updates ? <span>Actualites incluses</span> : null}
                </>
              }
            />
          ))
        ) : (
          <>
            <EditorialRewardRow
              href={supportPath}
              imageSrc={null}
              mediaIcon={<HeartHandshake className="h-7 w-7" aria-hidden="true" />}
              eyebrow="Soutien sans colis"
              title="Montant au choix"
              description="Vous choisissez votre montant et recevez le suivi terrain, sans contrepartie produit automatique."
              amount="Libre"
              ctaLabel="Soutenir librement"
              meta={
                <>
                  <span>Suivi terrain</span>
                  <span>Trace de soutien</span>
                  <span>Sans livraison</span>
                </>
              }
              accentLine="Avantages partenaires selon le montant"
            />
            {supportRewardTiers.map((tier) => (
              <EditorialRewardRow
                key={tier.id}
                href={getSupportTierHref(project.slug, tier)}
                imageSrc={
                  tier.rewardType === 'none'
                    ? null
                    : getSupportRewardImage(tier, project.type, coverImage)
                }
                imageAlt={tier.rewardLabel ?? tier.title}
                eyebrow={tier.rewardType === 'none' ? 'Soutien sans colis' : 'Contrepartie produit'}
                title={tier.title}
                description={tier.description}
                amount={`${formatAmountNumber(tier.amount)} €`}
                ctaLabel={getSupportTierCtaLabel(tier)}
                badgeLabel={getSupportTierBadgeLabel(tier)}
                mediaIcon={
                  tier.rewardType === 'none' ? (
                    <HeartHandshake className="h-7 w-7" aria-hidden="true" />
                  ) : (
                    <Gift className="h-7 w-7" aria-hidden="true" />
                  )
                }
                meta={
                  <>
                    <span>{tier.impactSummary}</span>
                    {tier.rewardLabel ? (
                      <span>{tier.rewardLabel}</span>
                    ) : (
                      <span>Sans contrepartie produit</span>
                    )}
                    {tier.requiresShipping ? <span>Adresse au paiement</span> : null}
                    {tier.rewardLabel ? <span>Refus possible au paiement</span> : null}
                  </>
                }
                accentLine={tier.unlockedAdvantageLabel ?? null}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )

  const tabs: ProjectDetailTab[] = [
    {
      id: 'overview',
      label: 'Apercu',
      content: (
        <div className="pt-6">
          <section className="px-4 sm:px-5">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              En bref
            </p>
            <div className="rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_18%_0%,rgba(190,242,100,0.11),transparent_34%),rgba(255,255,255,0.035)] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
              <h2 className="text-[22px] font-black leading-[1.08] tracking-tight text-white">
                Pourquoi soutenir ce projet
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-white/62">{overviewSummary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black text-white/42">
                {projectLocationLabel ? (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1">
                    Terrain: {projectLocationLabel}
                  </span>
                ) : null}
                {project.producer ? (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1">
                    Partenaire: {producerName}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mt-7 px-4 sm:px-5">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              Votre soutien sert à
            </p>
            <div className="mt-2 border-y border-white/[0.08]">
              {overviewUseCases.map((item) => (
                <OverviewUseCaseRow
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  accentColor={glowRgba(0.9)}
                />
              ))}
            </div>
          </section>

          <section className="mt-7 px-4 sm:px-5">
            <div className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div
                className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white/[0.045]"
                style={{ color: glowRgba(0.92) }}
              >
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-black leading-snug text-white">
                  Pourquoi faire confiance
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                  {overviewTrustText}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 px-4 sm:px-5">
            <ProjectBiodexSheet
              species={species ?? []}
              projectType={project.type}
              projectSlug={project.slug}
              isContributionProject={isContributionProject}
              description={narrativeDescription}
              producerName={project.producer ? producerName : undefined}
              producerLocation={projectLocationLabel ?? undefined}
            />
          </div>
          <div className="mt-10">{fundingPanel}</div>
          <div className="mt-12 w-full max-w-full overflow-hidden px-4 sm:px-5">
            <SimilarProjectsCarousel
              locale={locale}
              relatedProjects={relatedProjects}
              title={similarTitle}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'impact',
      label: 'Impact',
      content: (
        <div className="px-4 pt-10 sm:px-5">
          {impactItems.length > 0 ? (
            <ProjectImpactPreview
              items={impactItems}
              accentColor={glowRgba(1)}
              projectType={project.type}
              latestUpdate={latestProjectUpdate}
              supportRewardTiers={supportRewardTiers}
            />
          ) : (
            <p className="text-sm text-white/45">
              Aucun indicateur d'impact disponible pour le moment.
            </p>
          )}
        </div>
      ),
    },
    { id: 'producer', label: 'Producteur', content: producerPanel },
    { id: 'rewards', label: rewardTabLabel, content: rewardsPanel },
    {
      id: 'updates',
      label: 'Actualites',
      content: (
        <div className="px-4 pt-6 sm:px-5">
          <ProjectUpdatesFeed updates={projectUpdates} />
        </div>
      ),
    },
    {
      id: 'faq',
      label: 'FAQ',
      content: (
        <section className="px-4 pt-6 sm:px-5">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            FAQ
          </p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <p className="text-sm font-black text-white">
              {isContributionProject
                ? 'Contribution sans contrepartie produit'
                : 'Soutien avec contrepartie optionnelle'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/48">
              {isContributionProject
                ? 'Votre contribution finance le projet, active le suivi terrain et ne constitue pas un achat produit.'
                : 'Les paliers peuvent inclure une contrepartie. Vous pourrez aussi y renoncer au checkout pour laisser davantage de valeur au projet.'}
            </p>
          </div>
        </section>
      ),
    },
  ]

  return (
    <div className="relative flex h-full flex-col overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.12) }}
        />
        <div
          className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.15) }}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden h-full">
        <div
          data-modal-scroll-root
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain overscroll-x-none touch-pan-y"
        >
          {/* 1. Hero */}
          <ProjectQuickViewHero
            coverImage={coverImage}
            media={galleryMedia}
            projectId={project.id}
            projectName={projectName}
            projectSlug={project.slug}
          />

          {/* 2. Intro */}
          <div id="project-overview" className="scroll-mt-20 px-4 pt-5 sm:px-5">
            {project.address_country_code && countryName ? (
              <ProjectCountrySheet
                countryCode={resolvedIso ?? project.address_country_code}
                countryName={countryName}
                city={project.address_city}
                projectType={project.type}
                speciesCount={species?.length ?? 0}
                relatedProjects={relatedProjects}
                latitude={project.latitude}
                longitude={project.longitude}
                locale={locale}
              />
            ) : null}

            <h1
              className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl"
              style={{ viewTransitionName: titleTransitionName }}
            >
              {projectName}
            </h1>

            {projectDescription ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/75 sm:text-base">
                {projectDescription}
              </p>
            ) : null}

            {launchDateFormatted ? (
              <p className="mt-2 text-[11px] text-white/30">
                {t('detail_page.cover.launched_on', { date: launchDateFormatted })}
              </p>
            ) : null}

            <div className="mt-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                {t('detail.support_finances')}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/55">{fundingSubtext}</p>
            </div>
          </div>

          <ProjectDetailTabs
            tabs={tabs}
            isFundingClosed={isFundingClosed}
            isContributionProject={isContributionProject}
            closedLabel={t('detail.funding_closed')}
            contributionCtaLabel={t('detail.cta_contribute')}
            supportCtaLabel="Choisir une contrepartie"
          />
        </div>
      </div>
    </div>
  )
}
