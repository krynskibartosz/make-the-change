'use client'

import { type FC, useCallback, useMemo } from 'react'
import { ProductBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-breadcrumbs'
import { ProductCompactHeader } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-compact-header'
import { ProductDetailLayout } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-layout'
import { ProductDetailsEditor } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-details-editor'
import { useOptimisticAutoSave } from '@make-the-change/core/shared/hooks'
import { toast } from '@/hooks/use-toast'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'
import { updateProductAction } from '@/app/[locale]/admin/(dashboard)/products/actions'
import { LanguageSwitcher } from '@/components/admin/translation/language-switcher'
import {
  type TranslationData,
  TranslationProvider,
} from '@/components/admin/translation/translation-context'
import type { ProductFormData } from '@/lib/validators/product'

type ProductDetailControllerProps = {
  productData: ProductFormData & { id: string }
  categories: Array<{ id: string; name: string }>
  producers: Array<{ id: string; name: string }>
}

export const ProductDetailController: FC<ProductDetailControllerProps> = ({
  productData,
  categories,
  producers,
}) => {
  // Fonction de sauvegarde adaptée pour le hook
  const handleSave = useCallback(
    async (data: Partial<ProductFormData>) => {
      // Nettoyage des données avant envoi si nécessaire
      // Ici on envoie directement le patch
      const result = await updateProductAction(productData.id, data)
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde')
      }
    },
    [productData.id],
  )

  // Utilisation du hook optimisé
  const { status, lastSavedAt, errorMessage, saveNow, update, pendingData } = useOptimisticAutoSave(
    {
      saveFn: handleSave,
      debounceMs: 2000, // Un peu plus long pour éviter trop d'appels
      onToast: toast,
    },
  )

  // Données actuelles = données originales + modifications en attente
  const currentData = useMemo(
    () => ({
      ...productData,
      ...pendingData,
    }),
    [productData, pendingData],
  )

  // Gestion des changements de champ
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      const typedField = field as keyof ProductFormData

      // Stratégie de sauvegarde selon le type de champ
      const immediateFields: (keyof ProductFormData)[] = [
        'is_active',
        'featured',
        'min_tier',
        'fulfillment_method',
        'category_id',
        'producer_id',
        'images',
        'tags',
        'allergens',
        'certifications',
      ]

      // Mise à jour via le hook
      // Si c'est un champ immédiat, on pourrait vouloir forcer le save,
      // mais le hook gère le debounce. Pour un save "immédiat" (rapide),
      // on peut appeler saveNow() juste après, mais update() lance déjà le timer.
      // Pour les booléens/selects, on veut souvent que ça parte vite.
      // Le hook ne permet pas (encore) de paramétrer le debounce par appel.
      // Mais 2s c'est ok pour tout, sauf si l'utilisateur quitte la page.
      // Pour les toggles, on voudra peut-être un feedback plus rapide ?
      // On laisse le debounce faire son travail pour l'instant.

      update({ [typedField]: value })

      if (immediateFields.includes(typedField)) {
        // Optionnel : on pourrait forcer le save pour ces champs
        // void saveNow()
        // Mais attention, si on tape vite (ex: tags), on veut debounce.
        // Donc on laisse le debounce global.
      }
    },
    [update],
  )

  // Indicateur de statut mappé vers le format attendu par l'UI
  const saveStatus = useMemo((): SaveStatus => {
    if (status === 'saving') return { type: 'saving', message: 'Sauvegarde...' }
    if (status === 'error')
      return {
        type: 'error',
        message: errorMessage || 'Erreur inconnue',
        retryable: true,
      }
    if (status === 'pending') {
      const count = Object.keys(pendingData).length
      return {
        type: 'modified',
        message: `${count} modification(s) en attente`,
        count,
        fields: Object.keys(pendingData),
      }
    }
    if (status === 'saved' && lastSavedAt) {
      const timeSince = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000)
      return {
        type: 'saved',
        message: `Sauvegardé il y a ${timeSince}s`,
        timestamp: lastSavedAt,
      }
    }
    return {
      type: 'pristine',
      message: 'Tous les changements sont sauvegardés',
    }
  }, [status, errorMessage, pendingData, lastSavedAt])

  // Fonction pour gérer le changement de statut (header)
  const handleStatusChange = useCallback(
    async (newStatus: 'active' | 'inactive') => {
      const isActive = newStatus === 'active'
      update({ is_active: isActive })
      // On force la sauvegarde pour le statut car c'est une action importante
      await saveNow()
    },
    [update, saveNow],
  )

  // Préparation des données de traduction initiales
  const initialTranslations = useMemo(() => {
    const data: TranslationData = {}
    if (productData.name_i18n) data.name = productData.name_i18n as Record<string, string>
    if (productData.description_i18n)
      data.description = productData.description_i18n as Record<string, string>
    if (productData.short_description_i18n)
      data.short_description = productData.short_description_i18n as Record<string, string>
    if (productData.seo_title_i18n)
      data.seo_title = productData.seo_title_i18n as Record<string, string>
    if (productData.seo_description_i18n)
      data.seo_description = productData.seo_description_i18n as Record<string, string>
    return data
  }, [productData])

  // Gestion des changements de traduction
  const handleTranslationChange = useCallback(
    (translations: TranslationData) => {
      const patch: Partial<ProductFormData> = {}

      if (translations.name) patch.name_i18n = translations.name
      if (translations.description) patch.description_i18n = translations.description
      if (translations.short_description)
        patch.short_description_i18n = translations.short_description
      if (translations.seo_title) patch.seo_title_i18n = translations.seo_title
      if (translations.seo_description)
        patch.seo_description_i18n = translations.seo_description

      update(patch)
    },
    [update],
  )

  return (
    <TranslationProvider
      initialTranslations={initialTranslations}
      translatableFields={[
        'name',
        'description',
        'short_description',
        'seo_title',
        'seo_description',
      ]}
      defaultValues={{
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description,
        seo_title: productData.seo_title,
        seo_description: productData.seo_description,
      }}
      onTranslationChange={handleTranslationChange}
    >
      <ProductDetailLayout
        toolbar={<LanguageSwitcher />}
        content={
          <ProductDetailsEditor
            categories={categories}
            pendingChanges={pendingData}
            producers={producers}
            productData={currentData}
            saveStatus={saveStatus}
            onFieldChange={handleFieldChange}
            onFieldBlur={saveNow}
            onSaveAll={saveNow}
          />
        }
        header={
          <>
            <ProductBreadcrumbs productData={productData} />
            <ProductCompactHeader
              productData={currentData}
              saveStatus={saveStatus}
              onSaveAll={saveNow}
              onStatusChange={handleStatusChange}
            />
          </>
        }
      />
    </TranslationProvider>
  )
}
