'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import {
  PartnerAddressSectionRHF,
  PartnerContactSectionRHF,
  PartnerCreateHeaderRHF,
  PartnerDescriptionSectionRHF,
  PartnerEssentialSectionRHF,
} from '../[id]/components/rhf';
import { useCreatePartnerFormRHF } from '../[id]/hooks/use-create-partner-form-rhf';

const AdminPartnerCreatePage: FC = () => {
  const { form, submitNow } = useCreatePartnerFormRHF();
  const { isSubmitting, isDirty } = form.formState;

  return (
    <AdminPageLayout>
      <FormProvider {...form}>
        <form
          className="contents"
          onSubmit={event => {
            event.preventDefault();
            void submitNow();
          }}
        >
          <AdminDetailLayout
            headerContent={
              <PartnerCreateHeaderRHF
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={() => void submitNow()}
              />
            }
          >
            <DetailView gridCols={2} spacing="md" variant="cards">
              <PartnerEssentialSectionRHF />
              <PartnerContactSectionRHF />
              <PartnerDescriptionSectionRHF />
              <PartnerAddressSectionRHF />
            </DetailView>
          </AdminDetailLayout>
        </form>
      </FormProvider>
    </AdminPageLayout>
  );
};

export default AdminPartnerCreatePage;

