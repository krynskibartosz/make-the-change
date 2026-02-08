'use client'

import { type FC, useCallback, useMemo } from 'react'
import { ProjectBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/projects/[id]/components/project-breadcrumbs'
import { ProjectCompactHeader } from '@/app/[locale]/admin/(dashboard)/projects/[id]/components/project-compact-header'
import { ProductDetailLayout } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-layout'
import { ProjectDetailsEditor } from '@/app/[locale]/admin/(dashboard)/projects/[id]/components/project-details-editor'
import { useOptimisticAutoSave } from '@make-the-change/core/shared/hooks'
import { toast } from '@/hooks/use-toast'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'
import { updateProjectAction } from '@/app/[locale]/admin/(dashboard)/projects/actions'
import { LanguageSwitcher } from '@/components/admin/translation/language-switcher'
import {
  type TranslationData,
  TranslationProvider,
} from '@/components/admin/translation/translation-context'
import type { ProjectFormData } from '@/lib/validators/project'

type ProjectDetailControllerProps = {
  projectData: ProjectFormData & { id: string }
}

export const ProjectDetailController: FC<ProjectDetailControllerProps> = ({
  projectData,
}) => {
  // Fonction de sauvegarde adaptée pour le hook
  const handleSave = useCallback(
    async (data: Partial<ProjectFormData>) => {
      // Nettoyage des données avant envoi si nécessaire
      // Ici on envoie directement le patch
      const result = await updateProjectAction(projectData.id, data)
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde')
      }
    },
    [projectData.id],
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
      ...projectData,
      ...pendingData,
    }),
    [projectData, pendingData],
  )

  // Gestion des changements de champ
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      const typedField = field as keyof ProjectFormData

      update({ [typedField]: value })
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
    async (newStatus: 'active' | 'draft' | 'funded' | 'completed' | 'archived') => {
      update({ status: newStatus })
      // On force la sauvegarde pour le statut car c'est une action importante
      await saveNow()
    },
    [update, saveNow],
  )

  // Préparation des données de traduction initiales
  const initialTranslations = useMemo(() => {
    const data: TranslationData = {}
    if (projectData.name_i18n) data.name = projectData.name_i18n as Record<string, string>
    if (projectData.description_i18n)
      data.description = projectData.description_i18n as Record<string, string>
    if (projectData.long_description_i18n)
      data.long_description = projectData.long_description_i18n as Record<string, string>
    if (projectData.seo_title_i18n)
      data.seo_title = projectData.seo_title_i18n as Record<string, string>
    if (projectData.seo_description_i18n)
      data.seo_description = projectData.seo_description_i18n as Record<string, string>
    return data
  }, [projectData])

  // Gestion des changements de traduction
  const handleTranslationChange = useCallback(
    (translations: TranslationData) => {
      const patch: Partial<ProjectFormData> = {}

      if (translations.name) patch.name_i18n = translations.name
      if (translations.description) patch.description_i18n = translations.description
      if (translations.long_description)
        patch.long_description_i18n = translations.long_description
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
        'long_description',
        'seo_title',
        'seo_description',
      ]}
      defaultValues={{
        name: projectData.name,
        description: projectData.description,
        long_description: projectData.long_description,
        seo_title: projectData.seo_title,
        seo_description: projectData.seo_description,
      }}
      onTranslationChange={handleTranslationChange}
    >
      <ProductDetailLayout
        toolbar={<LanguageSwitcher />}
        content={
          <ProjectDetailsEditor
            pendingChanges={pendingData}
            projectData={currentData}
            saveStatus={saveStatus}
            onFieldChange={handleFieldChange}
            onFieldBlur={saveNow}
            onSaveAll={saveNow}
          />
        }
        header={
          <>
            <ProjectBreadcrumbs projectData={projectData} />
            <ProjectCompactHeader
              projectData={currentData}
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
