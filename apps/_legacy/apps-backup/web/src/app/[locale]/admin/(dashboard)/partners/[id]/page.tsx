'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { PartnerDetailSkeleton } from './components/partner-detail-skeleton';
import { TranslationProvider } from './contexts/translation-context';
import { usePartnerFormOptimistic } from './hooks/use-partner-form-optimistic';
import {
  PartnerCoverSection,
  PartnerEditHeader,
  EssentialInfoSection,
  ContactSection,
  AddressSection,
  MetadataSection,
} from './components/rhf';
import type { EnrichedPartnerData } from './types/partner-form.types';

/**
 * Partner Edit Page - React Hook Form Implementation
 *
 * Architecture:
 * - Uses React Hook Form for form state management
 * - Auto-save with 1.5s debounce + immediate blur flush
 * - Optimistic UI with automatic rollback on error
 * - Translation support via TranslationProvider
 * - Error handling with automatic redirect to list page
 * - Cover image + Avatar with custom scroll layout
 * - Sticky header with breadcrumb overlay on cover
 */
const AdminPartnerEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const partnerIdParam = typeof params.id === 'string' ? params.id : undefined;

  const {
    data: partner,
    isPending: isLoadingPartner,
    error,
  } = trpc.admin.partners.detail_enriched.useQuery(
    { partnerId: partnerIdParam ?? '' },
    { enabled: Boolean(partnerIdParam) }
  );

  useEntityErrorHandler(error, {
    redirectTo: '/admin/partners',
    entityType: 'partner',
  });

  // Conditions APRÈS tous les hooks
  if (!partnerIdParam) {
    return <PartnerDetailSkeleton />;
  }

  if (isLoadingPartner || !partner) {
    return <PartnerDetailSkeleton />;
  }

  // Translatable fields configuration
  const translatableFields = ['description'];
  const defaultValues = {
    description: partner?.description || '',
  };

  return (
    <AdminPageLayout>
      <TranslationProvider
        initialTranslations={partner?.translations || []}
        translatableFields={translatableFields}
        defaultValues={defaultValues}
      >
        <PartnerFormWrapperWithHook
          partnerId={partnerIdParam}
          partnerName={partner.name}
          initialData={partner}
        />
      </TranslationProvider>
    </AdminPageLayout>
  );
};

/**
 * Inner component that uses translation context
 * Must be inside TranslationProvider
 *
 * Layout original restauré:
 * - Cover section avec breadcrumb overlay (full width)
 * - Header avec statut de sauvegarde (PAS de bouton Save manuel)
 * - Scrollable content area avec form sections
 * - Auto-save automatique 1.5s debounce + flush on blur
 */
function PartnerFormWrapperWithHook({
  partnerId,
  partnerName,
  initialData,
}: {
  partnerId: string;
  partnerName: string;
  initialData: EnrichedPartnerData;
}) {
  const translationContext = useTranslationContext();

  const { form, autoSave, hasUnsavedChanges } = usePartnerFormOptimistic({
    partnerId,
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
          <PartnerCoverSection
            partnerId={partnerId}
            partnerName={partnerName}
            autoSave={autoSave}
          />

          {/* Header - scrolls with content (NO SAVE BUTTON!) */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <PartnerEditHeader
              autoSave={autoSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Content */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                <EssentialInfoSection autoSave={autoSave} />
                <ContactSection autoSave={autoSave} />
                <AddressSection autoSave={autoSave} />
                <MetadataSection autoSave={autoSave} />
              </DetailView>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// Import here to avoid circular dependency
import { useTranslationContext } from './contexts/translation-context';

export default AdminPartnerEditPage;
