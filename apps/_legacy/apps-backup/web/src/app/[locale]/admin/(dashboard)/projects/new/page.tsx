'use client';

import { type FC } from 'react';
import { FormProvider } from 'react-hook-form';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import {
  ProjectCoverSectionRHF,
  ProjectCreateHeaderRHF,
  ProjectDescriptionSectionRHF,
  ProjectEssentialSectionRHF,
  ProjectFundingSectionRHF,
  ProjectImagesSectionRHF,
} from '../[id]/components/rhf';
import { useCreateProjectFormRHF } from '../[id]/hooks/use-create-project-form-rhf';

const AdminProjectCreatePage: FC = () => {
  const { form, submitNow } = useCreateProjectFormRHF();
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
          <ProjectCoverSectionRHF />

          <AdminDetailLayout
            headerContent={
              <ProjectCreateHeaderRHF
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={() => void submitNow()}
              />
            }
          >
            <DetailView gridCols={2} spacing="md" variant="cards">
              <ProjectEssentialSectionRHF />
              <ProjectFundingSectionRHF />
              <ProjectDescriptionSectionRHF />
              <ProjectImagesSectionRHF />
            </DetailView>
          </AdminDetailLayout>
        </form>
      </FormProvider>
    </AdminPageLayout>
  );
};

export default AdminProjectCreatePage;

