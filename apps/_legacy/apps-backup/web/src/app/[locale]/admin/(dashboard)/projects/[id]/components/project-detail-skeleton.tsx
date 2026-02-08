import { Info, DollarSign, FileText, ImageIcon, MapPin, Camera, Check } from 'lucide-react';
import Link from 'next/link';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import type { FC } from 'react';

/**
 * Modern shimmer animation for skeleton loading (2025 design)
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Cover section skeleton matching ProjectCoverSectionRHF exactly
 * - Height: h-80 md:h-96
 * - Gradient background when no image
 * - Breadcrumb overlay with gradient from black
 * - Avatar: h-32 w-32 md:h-40 md:w-40 with -mt-16 md:-mt-20
 */
const ProjectCoverSectionSkeleton: FC = () => (
  <section className="relative mb-6">
    {/* Cover Image */}
    <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 md:h-96">
      <div className={`h-full w-full bg-muted/40 ${shimmerClasses}`} />

      {/* Gradient overlay for breadcrumbs */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-6 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/90">
            <Link
              href="/admin/projects"
              className="hover:text-white transition-colors"
            >
              Projets
            </Link>
            <span>/</span>
            <div className={`h-4 w-32 rounded-md bg-white/20 ${shimmerClasses}`} />
          </nav>
        </div>
      </div>

      {/* Upload button skeleton */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="inline-flex items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-sm font-medium text-white">
          <Camera className="h-4 w-4" />
          <span>Modifier la couverture</span>
        </div>
      </div>
    </div>

    {/* Avatar positioned below cover with negative margin */}
    <div className="relative mx-auto -mt-16 flex w-full max-w-6xl flex-col items-start gap-4 px-4 md:-mt-20 md:flex-row md:items-end md:gap-6 md:px-8">
      <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-background bg-background shadow-xl md:h-40 md:w-40">
        <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted/60 ${shimmerClasses}`}>
          <Camera className="text-muted-foreground h-8 w-8" />
        </div>
      </div>
    </div>
  </section>
);

/**
 * Header skeleton matching ProjectEditHeaderRHF exactly
 * - Simple layout: Save status left, Language switcher right
 */
const ProjectEditHeaderSkeleton: FC = () => (
  <div className="flex flex-row items-center justify-between px-4 py-4 md:px-8">
    {/* Left: Save Status Indicator */}
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Check className="h-3 w-3" />
      <span>Tous les changements sont sauvegardés</span>
    </div>

    {/* Right: Action buttons */}
    <div className="flex items-center gap-2">
      <div className={`h-9 w-28 rounded-lg bg-muted/40 ${shimmerClasses}`} />
    </div>
  </div>
);

/**
 * Generic field skeleton for form inputs with leading icons
 */
const FieldSkeleton: FC<{ label?: boolean; tall?: boolean; withIcon?: boolean }> = ({
  label = true,
  tall = false,
  withIcon = true,
}) => (
  <div className="space-y-2">
    {label && (
      <div className={`h-3.5 w-28 rounded-md bg-muted/30 ${shimmerClasses}`} />
    )}
    <div className="relative">
      {withIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className={`h-4 w-4 rounded bg-muted/40 ${shimmerClasses}`} />
        </div>
      )}
      <div
        className={`${tall ? 'h-24' : 'h-10'} w-full rounded-lg ${withIcon ? 'pl-10' : ''} bg-muted/30 ${shimmerClasses}`}
      />
    </div>
  </div>
);

/**
 * Section 1: Essential Info (Informations essentielles)
 * Icon: Info
 * Fields: Name, Slug, Type, Status, Featured
 */
const EssentialInfoSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <Info className="text-primary h-5 w-5" />
        </div>
        Informations essentielles
      </h3>
    </div>

    {/* Content */}
    <div className="px-8 pt-4 pb-8">
      <div className="space-y-4">
        <FieldSkeleton withIcon />
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSkeleton withIcon />
          <FieldSkeleton withIcon />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSkeleton withIcon />
          <FieldSkeleton withIcon={false} />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Section 2: Funding (Financement & configuration)
 * Icon: DollarSign
 * Fields: Target Budget, Partner, Country
 */
const FundingSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <DollarSign className="text-primary h-5 w-5" />
        </div>
        Financement & configuration
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton withIcon />
      <FieldSkeleton withIcon />
      <FieldSkeleton withIcon />
    </div>
  </div>
);

/**
 * Section 3: Description (Description du projet)
 * Icon: FileText
 * Spans 2 columns (lg:col-span-2)
 * Field: Translatable textarea
 */
const DescriptionSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <FileText className="text-primary h-5 w-5" />
        </div>
        Description du projet
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton tall withIcon={false} />
    </div>
  </div>
);

/**
 * Section 4: Images (Galerie du projet)
 * Icon: ImageIcon
 * Spans 2 columns
 * Grid of image placeholders
 */
const ImagesSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <ImageIcon className="text-primary h-5 w-5" />
        </div>
        Galerie du projet
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-6 px-8 pt-4 pb-8">
      <div className="border-border/60 bg-muted/30 text-sm text-muted-foreground rounded-md border border-dashed px-4 py-3">
        Créez le projet avant d'ajouter des images.
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg bg-muted/40 ${shimmerClasses}`}
          />
        ))}
      </div>

      <div className={`h-48 w-full rounded-lg bg-muted/30 ${shimmerClasses}`} />
    </div>
  </div>
);

/**
 * Main skeleton component matching exact project form structure
 *
 * Layout breakdown:
 * 1. Cover section (full width with negative margin avatar)
 * 2. Header (save status + actions)
 * 3. Content (max-w-7xl with DetailView grid)
 *    - Row 1: Essential Info + Funding (2 cols)
 *    - Row 2: Description (span 2 cols)
 *    - Row 3: Images (span 2 cols)
 */
export function ProjectDetailSkeleton() {
  return (
    <AdminPageLayout>
      <div className="flex h-full flex-col bg-surface-1 text-text-primary transition-colors duration-300 dark:bg-transparent">
        {/* All content scrollable together */}
        <div className="content-wrapper content-wrapper-dark flex-1 overflow-y-auto">
          {/* Cover Section - scrolls away */}
          <ProjectCoverSectionSkeleton />

          {/* Header - scrolls with content */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <ProjectEditHeaderSkeleton />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                {/* Row 1: Essential Info + Funding */}
                <EssentialInfoSectionSkeleton />
                <FundingSectionSkeleton />

                {/* Row 2: Description (spans 2 columns) */}
                <DescriptionSectionSkeleton />

                {/* Row 3: Images (spans 2 columns) */}
                <ImagesSectionSkeleton />
              </DetailView>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
