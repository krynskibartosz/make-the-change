'use client';

import { type FC, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';
import type { ProductBlurHash } from '@/types/blur';

import { ProductDetailSkeleton } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-skeleton';
import { TranslationProvider } from '@/app/[locale]/admin/(dashboard)/products/[id]/contexts/translation-context';
import { ProductFormWrapper } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-form-wrapper';

/**
 * Variante React Hook Form de la page d'édition produit.
 * À utiliser pour expérimenter ou comparer avec l'implémentation TanStack Form existante.
 */
const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const productIdParam = typeof params.id === 'string' ? params.id : undefined;

  const {
    data: product,
    isPending: isLoadingProduct,
    error,
  } = trpc.admin.products.detail_enriched.useQuery(
    { productId: productIdParam ?? '' },
    { enabled: Boolean(productIdParam) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/products',
    entityType: 'product',
  });

  const imageBlurMap = useMemo(() => {
    const map = product?.image_blur_map as Record<string, unknown> | undefined;
    if (!map) return {} as Record<string, ProductBlurHash>;

    const normalized: Record<string, ProductBlurHash> = {};
    for (const [url, value] of Object.entries(map)) {
      if (value && typeof value === 'object') {
        const raw = value as Record<string, unknown>;
        normalized[url] = {
          url,
          blurHash: (raw.blurHash as string | undefined) ?? (raw.blur_hash as string | undefined) ?? '',
          blurDataURL:
            (raw.blurDataURL as string | undefined) ??
            (raw.blur_data_url as string | undefined) ??
            undefined,
          width: (raw.width as number | undefined) ?? undefined,
          height: (raw.height as number | undefined) ?? undefined,
          fileSize:
            (raw.fileSize as number | undefined) ??
            (raw.file_size as number | undefined) ??
            undefined,
        };
      }
    }
    return normalized;
  }, [product?.image_blur_map]);

  // Conditions APRÈS tous les hooks
  if (!productIdParam) {
    return <ProductDetailSkeleton />;
  }

  if (isLoadingProduct || !product) {
    return <ProductDetailSkeleton />;
  }

  // Translatable fields configuration
  const translatableFields = ['name', 'short_description', 'description', 'seo_title', 'seo_description'];
  const defaultValues = {
    name: product?.name || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
  };

  return (
    <AdminPageLayout>
      <TranslationProvider
        initialTranslations={product?.translations || []}
        translatableFields={translatableFields}
        defaultValues={defaultValues}
      >
        <ProductFormWrapper
          productId={productIdParam}
          initialData={product}
          imageBlurMap={imageBlurMap}
        />
      </TranslationProvider>
    </AdminPageLayout>
  );
};

export default AdminProductEditPage;
