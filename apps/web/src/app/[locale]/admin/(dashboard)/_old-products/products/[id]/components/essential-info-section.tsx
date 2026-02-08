'use client'

import { Crown, Folder, Hash, Info, ShieldCheck, Sparkles, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useMemo, useRef } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { useTranslatableField } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/translatable-field'
import type { ProductFormData } from '@/app/[locale]/admin/(dashboard)/products/[id]/types/product-form.types'
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select'
import { InputV2 } from '@/components/ui/input-v2'
import { trpc } from '@/lib/trpc'
import type { WithAutoSaveProps } from './with-auto-save'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const EssentialInfoSection: FC<WithAutoSaveProps> = ({ autoSave }) => {
  const t = useTranslations()
  const { control, setValue, formState } = useFormContext<ProductFormData>()

  const slugAutoRef = useRef('')
  const slugManuallyEditedRef = useRef(false)
  const slugInitialValueRef = useRef<string>('')

  // Use translatable field hook for name with auto-save on blur
  const nameField = useTranslatableField('name', () => autoSave?.saveNow())
  const nameValue = useWatch({ control, name: 'name' })
  const slugValue = useWatch({ control, name: 'slug' })

  // Store initial slug value (only once on mount)
  useEffect(() => {
    if (slugInitialValueRef.current === '' && slugValue) {
      slugInitialValueRef.current = slugValue
    }
  }, [slugValue])

  // Fetch categories from database
  const { data: categories = [], isLoading: isLoadingCategories } =
    trpc.admin.categories.list.useQuery({
      activeOnly: true,
    })

  useEffect(() => {
    const nextAutoSlug = nameValue ? slugify(nameValue) : ''
    const currentSlug = slugValue ?? ''
    const wasAutoSlug = currentSlug === slugAutoRef.current || currentSlug === ''

    slugAutoRef.current = nextAutoSlug

    if (wasAutoSlug && !slugManuallyEditedRef.current) {
      setValue('slug', nextAutoSlug, {
        shouldValidate: true,
        shouldDirty: true,
      })
      slugManuallyEditedRef.current = false
    }
  }, [nameValue, setValue, slugValue])

  useEffect(() => {
    if (slugValue === slugAutoRef.current) {
      slugManuallyEditedRef.current = false
      return
    }

    if (slugValue && slugValue !== slugAutoRef.current) {
      slugManuallyEditedRef.current = true
      return
    }

    if (!slugValue) {
      slugManuallyEditedRef.current = false
    }
  }, [slugValue])

  const categoryOptions = useMemo<SelectOption[]>(() => {
    if (!categories?.length) return []

    const rootCategories = categories.filter((cat) => !cat.parent_id)
    const childCategories = categories.filter((cat) => cat.parent_id)

    const options: SelectOption[] = []

    for (const root of rootCategories) {
      options.push({
        value: root.id,
        title: root.name,
        subtitle: t('admin.products.edit.categories.primary', {
          defaultValue: 'Catégorie principale',
        }),
        icon: <Folder className="h-4 w-4 text-primary" />,
      })

      const children = childCategories.filter((child) => child.parent_id === root.id)
      for (const child of children) {
        options.push({
          value: child.id,
          title: child.name,
          subtitle: t('admin.products.edit.categories.subcategory', {
            defaultValue: 'Sous-catégorie',
          }),
          icon: <Tag className="h-4 w-4 text-accent" />,
        })
      }
    }

    // Fallback for uncategorized items
    const orphanCategories = childCategories.filter(
      (child) =>
        !rootCategories.some((root) => root.id === child.parent_id) &&
        !childCategories.some((other) => other.id === child.parent_id),
    )

    for (const orphan of orphanCategories) {
      options.push({
        value: orphan.id,
        title: orphan.name,
        subtitle: t('admin.products.edit.categories.secondary', {
          defaultValue: 'Catégorie secondaire',
        }),
        icon: <Tag className="h-4 w-4 text-muted-foreground" />,
      })
    }

    return options
  }, [categories, t])

  const tierOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'explorateur',
        title: t('admin.products.edit.tiers.explorateur', {
          defaultValue: 'Explorateur',
        }),
        subtitle: t('admin.products.edit.tiers.explorateur_desc', {
          defaultValue: 'Accès découverte (niveau 1)',
        }),
        icon: <Sparkles className="h-4 w-4 text-primary" />,
      },
      {
        value: 'protecteur',
        title: t('admin.products.edit.tiers.protecteur', {
          defaultValue: 'Protecteur',
        }),
        subtitle: t('admin.products.edit.tiers.protecteur_desc', {
          defaultValue: 'Avantages premium (niveau 2)',
        }),
        icon: <ShieldCheck className="h-4 w-4 text-success" />,
      },
      {
        value: 'ambassadeur',
        title: t('admin.products.edit.tiers.ambassadeur', {
          defaultValue: 'Ambassadeur',
        }),
        subtitle: t('admin.products.edit.tiers.ambassadeur_desc', {
          defaultValue: 'Expérience complète (niveau 3)',
        }),
        icon: <Crown className="h-4 w-4 text-amber-500" />,
      },
    ],
    [t],
  )

  return (
    <DetailView.Section
      icon={Info}
      title={t('admin.products.edit.sections.essential', {
        defaultValue: 'Informations essentielles',
      })}
    >
      <DetailView.Field
        label={t('admin.products.edit.fields.name', { defaultValue: 'Nom du produit' })}
        required
        error={formState.errors.name?.message}
      >
        <InputV2
          leadingIcon={<Sparkles className="h-4 w-4 text-primary" />}
          error={formState.errors.name?.message}
          required
          value={nameField.value}
          onChange={(e) => nameField.onChange(e.target.value)}
          onBlur={nameField.onBlur}
          placeholder={
            nameField.isBaseLang
              ? t('admin.products.edit.placeholders.name', {
                  defaultValue: 'Ex: Miel de Madagascar',
                })
              : `Traduction ${nameField.language.toUpperCase()}...`
          }
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.slug', { defaultValue: 'Slug' })}
        required
        error={formState.errors.slug?.message}
      >
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              leadingIcon={<Hash className="h-4 w-4 text-muted-foreground" />}
              className="font-mono"
              error={formState.errors.slug?.message}
              required
              value={field.value ?? ''}
              placeholder={t('admin.products.edit.placeholders.slug', {
                defaultValue: 'ex-miel-de-madagascar',
              })}
              onChange={(event) => {
                const next = event.target.value
                field.onChange(next)
                slugManuallyEditedRef.current = next !== slugAutoRef.current
              }}
              onBlur={() => {
                field.onBlur()
                // Only save if the value has actually changed
                const currentValue = field.value ?? ''
                if (currentValue !== slugInitialValueRef.current) {
                  slugInitialValueRef.current = currentValue // Update initial value after triggering save
                  autoSave?.saveNow()
                }
              }}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.category_id', { defaultValue: 'Catégorie' })}
        required
        error={formState.errors.category_id?.message}
      >
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              name="category_id"
              id="product-category"
              className="w-full"
              contextIcon={<Folder className="h-5 w-5 text-primary" />}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value)}
              options={categoryOptions}
              placeholder={
                isLoadingCategories
                  ? t('admin.products.edit.placeholders.category_loading', {
                      defaultValue: 'Chargement des catégories...',
                    })
                  : t('admin.products.edit.placeholders.category', {
                      defaultValue: 'Sélectionner une catégorie...',
                    })
              }
              disabled={isLoadingCategories || categoryOptions.length === 0}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.min_tier', { defaultValue: 'Niveau minimum' })}
        required
        error={formState.errors.min_tier?.message}
      >
        <Controller
          name="min_tier"
          control={control}
          render={({ field }) => (
            <CustomSelect
              name="min_tier"
              id="product-min-tier"
              className="w-full"
              contextIcon={<Sparkles className="h-5 w-5 text-secondary" />}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value)}
              options={tierOptions}
              placeholder={t('admin.products.edit.placeholders.minTier', {
                defaultValue: 'Sélectionner un niveau...',
              })}
            />
          )}
        />
      </DetailView.Field>

      <Controller
        name="producer_id"
        control={control}
        render={({ field }) => (
          <input type="hidden" value={field.value ?? ''} onChange={field.onChange} />
        )}
      />
    </DetailView.Section>
  )
}
