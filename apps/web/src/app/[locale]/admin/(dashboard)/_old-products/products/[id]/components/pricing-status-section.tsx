'use client'

import { Coins, DollarSign, Eye, Factory, Package, Sparkles, Star, Truck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useMemo, useRef } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import type { ProductFormData } from '@/app/[locale]/admin/(dashboard)/products/[id]/types/product-form.types'
import { CardCheckbox } from '@/components/CardCheckbox'
import { CardRadioGroup } from '@/components/CardRadioGroup'
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select'
import { InputV2 } from '@/components/ui/input-v2'
import type { WithAutoSaveProps } from './with-auto-save'

const numberOrUndefined = (value: string) => {
  if (value.trim() === '') return undefined
  const next = Number(value)
  return Number.isNaN(next) ? undefined : next
}

export const PricingStatusSection: FC<WithAutoSaveProps> = ({ autoSave }) => {
  const t = useTranslations()
  const { control, formState } = useFormContext<ProductFormData>()

  const fulfillmentMethod = useWatch({ control, name: 'fulfillment_method' })
  const pricePointsValue = useWatch({ control, name: 'price_points' })
  const priceEurValue = useWatch({ control, name: 'price_eur_equivalent' })
  const stockQuantityValue = useWatch({ control, name: 'stock_quantity' })

  // Store initial values for number fields
  const pricePointsInitialRef = useRef<number | undefined | null>(undefined)
  const priceEurInitialRef = useRef<number | undefined | null>(undefined)
  const stockQuantityInitialRef = useRef<number | undefined | null>(undefined)

  useEffect(() => {
    if (pricePointsInitialRef.current === undefined && pricePointsValue !== undefined) {
      pricePointsInitialRef.current = pricePointsValue
    }
  }, [pricePointsValue])

  useEffect(() => {
    if (priceEurInitialRef.current === undefined && priceEurValue !== undefined) {
      priceEurInitialRef.current = priceEurValue
    }
  }, [priceEurValue])

  useEffect(() => {
    if (stockQuantityInitialRef.current === undefined && stockQuantityValue !== undefined) {
      stockQuantityInitialRef.current = stockQuantityValue
    }
  }, [stockQuantityValue])

  const fulfillmentOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'stock',
        title: t('admin.products.edit.fulfillment.stock', {
          defaultValue: 'Stock physique',
        }),
        subtitle: t('admin.products.edit.fulfillment.stock_desc', {
          defaultValue: 'Expédié depuis votre stock existant',
        }),
        icon: <Package className="h-4 w-4 text-primary" />,
      },
      {
        value: 'dropship',
        title: t('admin.products.edit.fulfillment.dropship', {
          defaultValue: 'Dropshipping',
        }),
        subtitle: t('admin.products.edit.fulfillment.dropship_desc', {
          defaultValue: 'Envoyé directement par le partenaire',
        }),
        icon: <Truck className="h-4 w-4 text-secondary" />,
      },
      {
        value: 'ondemand',
        title: t('admin.products.edit.fulfillment.ondemand', {
          defaultValue: 'Sur commande',
        }),
        subtitle: t('admin.products.edit.fulfillment.ondemand_desc', {
          defaultValue: 'Fabriqué à la demande (production agile)',
        }),
        icon: <Factory className="h-4 w-4 text-accent" />,
      },
    ],
    [t],
  )

  return (
    <DetailView.Section
      icon={DollarSign}
      title={t('admin.products.edit.sections.pricing', { defaultValue: 'Prix et statut' })}
    >
      <DetailView.Field
        label={t('admin.products.edit.fields.price_points', { defaultValue: 'Prix en points' })}
        required
        error={formState.errors.price_points?.message}
      >
        <Controller
          name="price_points"
          control={control}
          render={({ field }) => (
            <InputV2
              type="number"
              min={1}
              step={1}
              required
              leadingIcon={<Star className="h-4 w-4 text-primary" />}
              error={formState.errors.price_points?.message}
              value={field.value === undefined || field.value === null ? '' : String(field.value)}
              onChange={(event) => field.onChange(numberOrUndefined(event.target.value))}
              inputMode="numeric"
              onBlur={() => {
                field.onBlur()
                // Only save if the value has actually changed
                if (field.value !== pricePointsInitialRef.current) {
                  pricePointsInitialRef.current = field.value // Update initial value after triggering save
                  autoSave?.saveNow()
                }
              }}
              placeholder="100"
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.price_eur_equivalent', {
          defaultValue: 'Équivalent EUR (optionnel)',
        })}
        error={formState.errors.price_eur_equivalent?.message}
      >
        <Controller
          name="price_eur_equivalent"
          control={control}
          render={({ field }) => (
            <InputV2
              type="number"
              min={0}
              step={0.01}
              leadingIcon={<Coins className="h-4 w-4 text-muted-foreground" />}
              error={formState.errors.price_eur_equivalent?.message}
              value={field.value === undefined || field.value === null ? '' : String(field.value)}
              onChange={(event) => field.onChange(numberOrUndefined(event.target.value))}
              inputMode="decimal"
              onBlur={() => {
                field.onBlur()
                // Only save if the value has actually changed
                if (field.value !== priceEurInitialRef.current) {
                  priceEurInitialRef.current = field.value // Update initial value after triggering save
                  autoSave?.saveNow()
                }
              }}
              placeholder="0.00"
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.fulfillment_method', {
          defaultValue: 'Méthode de livraison',
        })}
        required
        error={formState.errors.fulfillment_method?.message}
      >
        <Controller
          name="fulfillment_method"
          control={control}
          render={({ field }) => (
            <CardRadioGroup
              legend=""
              name="fulfillment_method"
              options={fulfillmentOptions.map((opt) => ({
                value: opt.value,
                title: opt.title,
                icon: opt.icon,
              }))}
              selectedValue={field.value ?? ''}
              onChange={(value: string) => field.onChange(value)}
            />
          )}
        />
      </DetailView.Field>

      {fulfillmentMethod === 'stock' && (
        <DetailView.Field
          label={t('admin.products.edit.fields.stock_quantity', {
            defaultValue: 'Quantité en stock',
          })}
          error={formState.errors.stock_quantity?.message}
        >
          <Controller
            name="stock_quantity"
            control={control}
            render={({ field }) => (
              <InputV2
                type="number"
                min={0}
                step={1}
                leadingIcon={<Package className="h-4 w-4 text-secondary" />}
                error={formState.errors.stock_quantity?.message}
                value={field.value === undefined || field.value === null ? '' : String(field.value)}
                onChange={(event) => field.onChange(numberOrUndefined(event.target.value))}
                inputMode="numeric"
                onBlur={() => {
                  field.onBlur()
                  // Only save if the value has actually changed
                  if (field.value !== stockQuantityInitialRef.current) {
                    stockQuantityInitialRef.current = field.value // Update initial value after triggering save
                    autoSave?.saveNow()
                  }
                }}
                placeholder="0"
              />
            )}
          />
        </DetailView.Field>
      )}

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.products.edit.fields.is_active', { defaultValue: 'Produit actif' })}
          error={formState.errors.is_active?.message}
        >
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <CardCheckbox
                title={t('admin.products.edit.labels.active', {
                  defaultValue: 'Activer ce produit',
                })}
                checked={Boolean(field.value)}
                onChange={(checked) => {
                  field.onChange(checked)
                  field.onBlur()
                }}
                name="is_active"
                icon={<Eye className="h-4 w-4 text-primary" />}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.featured', { defaultValue: 'Produit mis en avant' })}
          error={formState.errors.featured?.message}
        >
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <CardCheckbox
                title={t('admin.products.edit.labels.featured', {
                  defaultValue: 'Mettre en avant ce produit',
                })}
                checked={Boolean(field.value)}
                onChange={(checked) => {
                  field.onChange(checked)
                  field.onBlur()
                }}
                name="featured"
                icon={<Sparkles className="h-4 w-4 text-secondary" />}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  )
}
