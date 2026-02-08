import { Calendar, ClipboardList, Coins, FileText, MapPin, PiggyBank, User } from 'lucide-react';
import Link from 'next/link';

import type { FC } from 'react';

/**
 * Modern shimmer animation for skeleton loading (2025 design)
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Breadcrumbs skeleton matching InvestmentBreadcrumbs
 */
const InvestmentBreadcrumbsSkeleton: FC = () => (
  <div className="mx-auto max-w-7xl px-4 pt-6 pb-4 md:px-8">
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/admin/investments" className="hover:text-foreground transition-colors">
        Investissements
      </Link>
      <span>/</span>
      <div className={`h-4 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
    </nav>
  </div>
);

/**
 * Compact Header skeleton matching InvestmentCompactHeader
 */
const InvestmentCompactHeaderSkeleton: FC = () => (
  <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
      {/* Left side: Icon + Title + Investor */}
      <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
        {/* Icon */}
        <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:p-3">
          <PiggyBank className="text-primary h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className={`mb-1 h-7 w-64 rounded-md bg-muted/40 md:h-8 ${shimmerClasses}`} />
          
          {/* Investor name */}
          <div className={`mt-1 h-4 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />

          {/* Badges - Desktop only */}
          <div className="mt-3 hidden flex-wrap items-center gap-3 md:flex">
            {/* Status badge */}
            <div className={`h-7 w-24 rounded-full bg-muted/40 ${shimmerClasses}`} />
            
            {/* Amount EUR */}
            <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
              <Coins className="h-3 w-3 text-muted-foreground" />
              <div className={`h-3 w-20 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>

            {/* Amount Points */}
            <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
              <PiggyBank className="h-3 w-3 text-muted-foreground" />
              <div className={`h-3 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>

            {/* Maturity date */}
            <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <div className={`h-3 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Edit button */}
      <div className="flex flex-shrink-0 items-center">
        <div className={`h-8 w-24 rounded-md bg-muted/40 ${shimmerClasses}`} />
      </div>
    </div>
  </div>
);

/**
 * Generic field skeleton for form inputs
 */
const FieldSkeleton: FC<{ tall?: boolean; withSubtext?: boolean }> = ({ 
  tall = false,
  withSubtext = false,
}) => (
  <div className="space-y-2">
    {/* Label */}
    <div className={`h-3.5 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
    
    {/* Value */}
    <div className={`${tall ? 'h-20' : 'h-5'} w-full rounded-md bg-muted/40 ${shimmerClasses}`} />
    
    {/* Subtext (optional) */}
    {withSubtext && (
      <div className={`h-3 w-32 rounded-md bg-muted/20 ${shimmerClasses}`} />
    )}
  </div>
);

/**
 * Section 1: Synthèse financière (Financial Summary)
 * Icon: PiggyBank
 * Spans 2 columns on large screens
 * Layout: 2 rows of grid-3
 */
const FinancialSummarySectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <PiggyBank className="text-primary h-5 w-5" />
        </div>
        Synthèse financière
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-6 px-8 pt-4 pb-8">
      {/* Row 1: Status, Amount, Returns */}
      <div className="grid gap-4 md:grid-cols-3">
        <FieldSkeleton />
        <FieldSkeleton withSubtext />
        <FieldSkeleton withSubtext />
      </div>

      {/* Row 2: Expected return, Last return, Maturity */}
      <div className="grid gap-4 md:grid-cols-3">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Section 2: Investisseur (Investor)
 * Icon: User
 * Fields: Name, Email
 */
const InvestorSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <User className="text-primary h-5 w-5" />
        </div>
        Investisseur
      </h3>
    </div>

    {/* Content */}
    <div className="px-8 pt-4 pb-8">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Section 3: Projet (Project)
 * Icon: MapPin
 * Fields: Name, Type, Partner, Status
 */
const ProjectSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <MapPin className="text-primary h-5 w-5" />
        </div>
        Projet
      </h3>
    </div>

    {/* Content */}
    <div className="px-8 pt-4 pb-8">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Section 4: Historique (History)
 * Icon: ClipboardList
 * Fields: Created at, Updated at, Returns count
 */
const HistorySectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <ClipboardList className="text-primary h-5 w-5" />
        </div>
        Historique
      </h3>
    </div>

    {/* Content */}
    <div className="px-8 pt-4 pb-8">
      <div className="grid gap-4 md:grid-cols-3">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Section 5: Notes
 * Icon: FileText
 * Field: Textarea for notes
 */
const NotesSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <FileText className="text-primary h-5 w-5" />
        </div>
        Notes
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton tall />
    </div>
  </div>
);

/**
 * Main skeleton component matching exact investment detail structure
 *
 * Layout breakdown:
 * 1. Fixed header with breadcrumbs and compact header
 * 2. Scrollable content area
 * 3. Grid layout with sections (lg:grid-cols-2)
 */
export function InvestmentDetailSkeleton() {
  return (
    <div className="relative h-screen bg-background">
      {/* Fixed Header */}
      <div className="absolute top-0 right-0 left-0 z-40">
        <div
          className="border-border border-b shadow-2xl backdrop-blur-[20px]"
          style={{
            background: 'var(--filters-bg)',
            boxShadow: 'var(--elevation-filters)',
          }}
        >
          <InvestmentBreadcrumbsSkeleton />
          <InvestmentCompactHeaderSkeleton />
          <div className="hidden px-8 pb-4 md:block" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto pt-48 pb-20 sm:pt-48 md:pt-64 md:pb-8 lg:pt-56">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Row 1: Financial Summary (spans 2 columns) */}
            <FinancialSummarySectionSkeleton />

            {/* Row 2: Investor + Project */}
            <InvestorSectionSkeleton />
            <ProjectSectionSkeleton />

            {/* Row 3: History (spans 2 columns) */}
            <HistorySectionSkeleton />

            {/* Row 4: Notes (spans 2 columns) */}
            <NotesSectionSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
