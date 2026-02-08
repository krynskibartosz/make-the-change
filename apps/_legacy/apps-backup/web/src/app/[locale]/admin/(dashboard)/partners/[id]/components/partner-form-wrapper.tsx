'use client';

import { FormProvider } from 'react-hook-form';
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout';
import { PartnerEditHeader } from './rhf/partner-edit-header';
import { EssentialInfoSection } from './rhf/essential-info-section';
import { ContactSection } from './rhf/contact-section';
import { AddressSection } from './rhf/address-section';
import { MetadataSection } from './rhf/metadata-section';
import type { UsePartnerFormOptimisticReturn } from '../hooks/use-partner-form-optimistic';

interface PartnerFormWrapperProps {
  partnerId: string;
  partnerName: string;
  formHook: UsePartnerFormOptimisticReturn;
}

/**
 * Partner Form Wrapper Component
 *
 * Wraps the entire partner form with:
 * - FormProvider (React Hook Form context)
 * - AdminDetailLayout (consistent admin UI)
 * - Header with breadcrumbs and save status
 * - All form sections
 *
 * Architecture:
 * - No local state, all state in React Hook Form
 * - Auto-save handled by usePartnerFormOptimistic hook
 * - Sections are isolated and reusable
 */
export function PartnerFormWrapper({
  partnerId,
  partnerName,
  formHook,
}: PartnerFormWrapperProps) {
  const { form, autoSave, executeSave } = formHook;

  return (
    <FormProvider {...form}>
      <AdminDetailLayout
        header={
          <PartnerEditHeader
            partnerId={partnerId}
            partnerName={partnerName}
            autoSave={autoSave}
            executeSave={executeSave}
          />
        }
      >
        <div className="space-y-8">
          {/* Essential Info Section */}
          <EssentialInfoSection autoSave={autoSave} />

          {/* Contact Section */}
          <ContactSection autoSave={autoSave} />

          {/* Address Section */}
          <AddressSection autoSave={autoSave} />

          {/* Metadata Section */}
          <MetadataSection autoSave={autoSave} />
        </div>
      </AdminDetailLayout>
    </FormProvider>
  );
}
