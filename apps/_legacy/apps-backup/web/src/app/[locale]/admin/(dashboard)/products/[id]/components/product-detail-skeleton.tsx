import { Info, DollarSign, FileText, ImageIcon, Home, Package, ChevronRight } from 'lucide-react';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import type { FC } from 'react';

/**
 * Modern shimmer animation for skeleton loading (2025 design)
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Header skeleton matching AdminDetailHeader structure with real breadcrumbs and icons
 */
const ProductDetailHeaderSkeleton: FC = () => (
  <div className="mx-auto max-w-7xl px-4 md:px-8">
    {/* Breadcrumbs avec vraies icônes */}
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-2 pt-3 pb-1 text-sm"
    >
      <div className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        <span>Tableau de bord</span>
      </div>
      <ChevronRight className="h-4 w-4" />
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        <span>Produits</span>
      </div>
      <ChevronRight className="h-4 w-4" />
      <div className={`h-4 w-32 rounded-md bg-muted/40 ${shimmerClasses}`} />
    </nav>

    {/* Main Header */}
    <div className="flex items-start justify-between py-3 pb-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
        {/* Product image skeleton with icon fallback */}
        <div className="from-primary/20 border-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:h-16 md:w-16 md:p-3">
          <Package className="text-primary h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title with status indicator */}
          <div className="mb-2 flex items-center gap-3">
            <div className={`h-7 w-64 rounded-lg bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-5 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>

          {/* Subtitle */}
          <div className={`h-4 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>

      {/* Actions */}
      <div className="ml-4 flex flex-shrink-0 items-center gap-3">
        {/* Language switcher */}
        <div className={`h-9 w-28 rounded-lg bg-muted/40 ${shimmerClasses}`} />

        {/* Save button */}
        <div className={`h-9 w-32 rounded-lg bg-primary/20 ${shimmerClasses}`} />
      </div>
    </div>
  </div>
);

/**
 * Generic field skeleton for form inputs
 */
const FieldSkeleton: FC<{ label?: boolean; tall?: boolean }> = ({
  label = true,
  tall = false,
}) => (
  <div className="space-y-2">
    {label && (
      <div className={`h-3.5 w-28 rounded-md bg-muted/30 ${shimmerClasses}`} />
    )}
    <div
      className={`${tall ? 'h-24' : 'h-10'} w-full rounded-lg bg-muted/30 ${shimmerClasses}`}
    />
  </div>
);

/**
 * Section 1: Essential Info (Informations essentielles)
 * - Nom du produit
 * - Slug
 * - Catégorie
 * - Niveau minimum
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
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
    </div>
  </div>
);

/**
 * Section 2: Pricing & Configuration (Prix & Configuration)
 * - Prix en points
 * - Équivalent EUR
 * - Méthode de livraison
 * - Quantité en stock (conditional)
 * - Actif / Mis en avant (checkboxes)
 */
const PricingStatusSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <DollarSign className="text-primary h-5 w-5" />
        </div>
        Prix &amp; Configuration
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />

      {/* Checkboxes */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded border bg-muted/30 ${shimmerClasses}`} />
          <div className={`h-3 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded border bg-muted/30 ${shimmerClasses}`} />
          <div className={`h-3 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Section 3: Images (Visuel - position haute)
 * - Image gallery grid
 * - Upload button
 */
const ImagesSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <ImageIcon className="text-primary h-5 w-5" />
        </div>
        Images
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      {/* Image masonry grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl bg-muted/30 ${shimmerClasses}`}
          />
        ))}
      </div>

      {/* Upload area */}
      <div className={`flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-muted/40 bg-muted/10 ${shimmerClasses}`}>
        <div className="text-center">
          <div className={`mx-auto h-12 w-12 rounded-full bg-muted/30 ${shimmerClasses}`} />
          <div className={`mx-auto mt-3 h-4 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Section 4: Product Details (Détails du produit)
 * - Description courte
 * - Description détaillée
 * - Pays d'origine
 */
const ProductDetailsSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <FileText className="text-primary h-5 w-5" />
        </div>
        Détails du produit
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      <FieldSkeleton tall />
      <FieldSkeleton tall />
      <FieldSkeleton />
    </div>
  </div>
);

/**
 * Section 5: Metadata (Métadonnées + SEO)
 * - Catégorie secondaire
 * - Tags
 * - Dates (lancement, retrait)
 * - SEO title & description
 */
const MetadataSectionSkeleton: FC = () => (
  <div className="card-base card-base-dark text-card-foreground lg:col-span-2 rounded-2xl transition-all duration-300">
    {/* Section header EXACT identique à DetailView.Section */}
    <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
      <h3 className="text-foreground flex items-center gap-3 text-lg font-semibold leading-tight tracking-tight">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <Info className="text-primary h-5 w-5" />
        </div>
        Métadonnées
      </h3>
    </div>

    {/* Content */}
    <div className="space-y-4 px-8 pt-4 pb-8">
      {/* Row 1: Category + Tags */}
      <div className="grid grid-cols-2 gap-4">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>

      {/* Row 2: Dates */}
      <div className="grid grid-cols-2 gap-4">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>

      {/* Row 3: SEO fields */}
      <div className="grid grid-cols-2 gap-4">
        <FieldSkeleton />
        <FieldSkeleton tall />
      </div>
    </div>
  </div>
);

/**
 * Main skeleton component matching exact product form structure
 */
export const ProductDetailSkeleton: FC = () => (
  <AdminPageLayout>
    <AdminDetailLayout headerContent={<ProductDetailHeaderSkeleton />}>
      {/* Exact grid structure from ProductFormWrapper */}
      <DetailView gridCols={2} spacing="md" variant="cards">
        {/* Row 1: Essential Info + Pricing/Status */}
        <EssentialInfoSectionSkeleton />
        <PricingStatusSectionSkeleton />

        {/* Row 2: Images (spans 2 columns) */}
        <ImagesSectionSkeleton />

        {/* Row 3: Product Details (single column) */}
        <ProductDetailsSectionSkeleton />

        {/* Row 4: Metadata (spans 2 columns) */}
        <MetadataSectionSkeleton />
      </DetailView>
    </AdminDetailLayout>
  </AdminPageLayout>
);
