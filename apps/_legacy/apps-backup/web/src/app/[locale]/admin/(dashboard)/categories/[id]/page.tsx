'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { CategoryDetailSkeleton } from './components/category-detail-skeleton';
import { useCategoryFormOptimistic } from './hooks/use-category-form-optimistic';
import {
  CategoryCoverSection,
  CategoryEditHeader,
  EssentialInfoSection,
  ConfigurationSection,
  SeoSection,
  MetadataSection,
} from './components';
import type { RawCategoryData } from './types/category-form.types';

/**
 * Category Edit Page - React Hook Form Implementation
 *
 * Architecture (alignée avec partners/biodex):
 * - Uses React Hook Form for form state management
 * - Auto-save with 1.5s debounce + immediate blur flush
 * - Optimistic UI with automatic rollback on error
 * - Error handling with automatic redirect to list page
 * - Cover section with breadcrumb overlay
 * - Sticky header with save status
 */

const AdminCategoryEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const categoryIdParam = typeof params.id === 'string' ? params.id : undefined;

  const {
    data: category,
    isPending: isLoadingCategory,
    error,
  } = trpc.admin.categories.detail.useQuery(
    { id: categoryIdParam ?? '' },
    { enabled: Boolean(categoryIdParam) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/categories',
    entityType: 'category',
  });

  // Conditions APRÈS tous les hooks
  if (!categoryIdParam) {
    return <CategoryDetailSkeleton />;
  }

  if (isLoadingCategory || !category) {
    return <CategoryDetailSkeleton />;
  }

  return (
    <AdminPageLayout>
      <CategoryFormWrapperWithHook
        categoryId={categoryIdParam}
        categoryName={category.name}
        initialData={category}
      />
    </AdminPageLayout>
  );
};

/**
 * Inner component that uses the form hook
 *
 * Layout standard aligné avec partners/biodex:
 * - Cover section avec breadcrumb overlay (full width)
 * - Header avec statut de sauvegarde (PAS de bouton Save manuel)
 * - Scrollable content area avec form sections
 * - Auto-save automatique 1.5s debounce + flush on blur
 */
function CategoryFormWrapperWithHook({
  categoryId,
  categoryName,
  initialData,
}: {
  categoryId: string;
  categoryName: string;
  initialData: RawCategoryData;
}) {
  const { form, autoSave, hasUnsavedChanges } = useCategoryFormOptimistic({
    categoryId,
    initialData,
    debug: process.env.NODE_ENV === 'development',
  });

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full flex-col bg-surface-1 text-text-primary transition-colors duration-300 dark:bg-transparent"
        onSubmit={(event) => {
          event.preventDefault();
          void autoSave.saveNow();
        }}
      >
        {/* All content scrollable together */}
        <div className="content-wrapper content-wrapper-dark flex-1 overflow-y-auto">
          {/* Cover Section - scrolls away */}
          <CategoryCoverSection
            categoryId={categoryId}
            categoryName={categoryName}
            autoSave={autoSave}
          />

          {/* Header - scrolls with content (NO SAVE BUTTON!) */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <CategoryEditHeader
              autoSave={autoSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                <EssentialInfoSection autoSave={autoSave} currentCategoryId={categoryId} />
                <ConfigurationSection autoSave={autoSave} />
                <SeoSection autoSave={autoSave} />
                <MetadataSection category={initialData} />
              </DetailView>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default AdminCategoryEditPage;
