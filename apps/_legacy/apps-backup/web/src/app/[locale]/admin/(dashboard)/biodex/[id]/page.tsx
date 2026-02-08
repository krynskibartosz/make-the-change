'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import type { EnrichedSpeciesData } from './types/species-form.types';
import { SpeciesDetailSkeleton } from './components/species-detail-skeleton';
import { SpeciesEditHeader, SpeciesCoverSection, EssentialInfoSection, ContentLevelsSection } from './components/sections';
import { TranslationProvider, useTranslationContext } from './contexts/translation-context';
import { useSpeciesFormOptimistic } from './hooks/use-species-form-optimistic';

/**
 * Species Edit Page - React Hook Form Implementation
 *
 * Architecture (aligned with partners):
 * - Uses React Hook Form for form state management
 * - Auto-save with 1.5s debounce + immediate blur flush via useOptimisticAutoSave
 * - Optimistic UI with automatic rollback on error
 * - Translation support via TranslationProvider
 * - Error handling with automatic redirect to list page
 * - Cover image + Icon with custom scroll layout
 * - Sticky header with breadcrumb overlay on cover
 */
const AdminSpeciesEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const speciesIdParam = typeof params.id === 'string' ? params.id : undefined;

  const {
    data: species,
    isPending: isLoadingSpecies,
    error,
  } = trpc.admin.species.byId.useQuery(
    { id: speciesIdParam ?? '' },
    { enabled: Boolean(speciesIdParam) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/biodex',
    entityType: 'species',
  });

  // Conditions APRÈS tous les hooks
  if (!speciesIdParam) {
    return <SpeciesDetailSkeleton />;
  }

  if (isLoadingSpecies || !species) {
    return <SpeciesDetailSkeleton />;
  }

  // Translatable fields configuration
  const translatableFields = ['name', 'description', 'scientific_name'];
  const defaultValues = {
    name: species?.name || '',
    description: species?.description || '',
    scientific_name: species?.scientific_name || '',
  };

  return (
    <AdminPageLayout>
      <TranslationProvider species={species}>
        <SpeciesFormWrapperWithHook
          speciesId={speciesIdParam}
          speciesName={species.name}
          initialData={species}
        />
      </TranslationProvider>
    </AdminPageLayout>
  );
};

/**
 * Inner component that uses translation context
 * Must be inside TranslationProvider
 *
 * Layout standard aligné avec partners:
 * - Cover section avec breadcrumb overlay (full width)
 * - Header avec statut de sauvegarde (PAS de bouton Save manuel)
 * - Scrollable content area avec form sections
 * - Auto-save automatique 1.5s debounce + flush on blur
 */
function SpeciesFormWrapperWithHook({
  speciesId,
  speciesName,
  initialData,
}: {
  speciesId: string;
  speciesName: string;
  initialData: EnrichedSpeciesData;
}) {
  const translationContext = useTranslationContext();

  const { form, autoSave, hasUnsavedChanges } = useSpeciesFormOptimistic({
    speciesId,
    initialData,
    translationContext,
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
          <SpeciesCoverSection
            speciesId={speciesId}
            speciesName={speciesName}
            autoSave={autoSave}
          />

          {/* Header - scrolls with content (NO SAVE BUTTON!) */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <SpeciesEditHeader
              autoSave={autoSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                <EssentialInfoSection autoSave={autoSave} />
                <ContentLevelsSection autoSave={autoSave} />
              </DetailView>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default AdminSpeciesEditPage;