'use client'

import type { FC } from 'react'
import { FormProvider } from 'react-hook-form'

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout'

import {
  EssentialInfoSection,
  ImagesSection,
  MetadataSection,
  PricingStatusSection,
  ProductCreateHeaderRHF,
  ProductDetailsSection,
} from '../[id]/components'
import { useCreateProductFormRHF } from '../[id]/hooks/use-create-product-form-rhf'

const AdminProductCreatePage: FC = () => {
  const { form, submitNow } = useCreateProductFormRHF()
  const { isSubmitting, isDirty } = form.formState

  return (
    <AdminPageLayout>
      <FormProvider {...form}>
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            void submitNow()
          }}
        >
          <AdminDetailLayout
            headerContent={
              <ProductCreateHeaderRHF
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSubmit={() => void submitNow()}
              />
            }
          >
            <DetailView gridCols={2} spacing="md" variant="cards">
              <EssentialInfoSection />
              <PricingStatusSection />
              <ProductDetailsSection />
              <ImagesSection />
              <MetadataSection />
            </DetailView>
          </AdminDetailLayout>
        </form>
      </FormProvider>
    </AdminPageLayout>
  )
}

export default AdminProductCreatePage
