'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormCheckbox, FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import type { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'
import {
  defaultProductValues,
  fulfillmentMethodLabels,
  type ProductFormData,
  productFormSchema,
  tierLabels,
} from '@/lib/validators/product'
import { createProductAction } from '../actions'

type ProductsNewClientProps = {
  categories: Array<{ id: string; name: string }>
  producers: Array<{ id: string; name: string }>
}

const NewProductPage: FC<ProductsNewClientProps> = ({ categories, producers }) => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ProductFormData>({
    defaultValues: defaultProductValues,
    mode: 'onChange',
    resolver: zodResolver(productFormSchema),
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      const result = await createProductAction(value)
      if (!result.success || !result.data?.id) {
        throw new Error(result.error || 'Impossible de créer le produit')
      }

      toast({
        variant: 'success',
        title: 'Produit créé',
        description: 'Le produit a été créé avec succès',
      })
      router.push(`/admin/products/${result.data.id}`)
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer le produit',
      })
    }
  })

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/products"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau produit</h1>
      </div>

      {}
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Informations principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="name"
                  required
                  label="Nom du produit"
                  placeholder="Miel de Lavande Bio"
                />

                <FormInput
                  name="slug"
                  required
                  description="Utilisé dans l'URL du produit"
                  label="Slug (URL)"
                  placeholder="miel-lavande-bio"
                />

                <FormInput
                  name="short_description"
                  label="Description courte"
                  placeholder="Miel artisanal de lavande sauvage"
                />

                <FormTextArea
                  name="description"
                  label="Description détaillée"
                  placeholder="Description complète du produit..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="price_points"
                  required
                  label="Prix en points"
                  min="1"
                  placeholder="450"
                  type="number"
                />

                <FormInput
                  name="stock_quantity"
                  label="Stock initial"
                  min="0"
                  placeholder="25"
                  type="number"
                />

                <FormSelect
                  name="min_tier"
                  label="Niveau minimum requis"
                  options={Object.entries(tierLabels).map(([value, label]) => ({ value, label }))}
                />

                <FormSelect
                  name="fulfillment_method"
                  label="Méthode de livraison"
                  options={Object.entries(fulfillmentMethodLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />

                <FormSelect
                  name="category_id"
                  label="Catégorie"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Sélectionner une catégorie"
                />

                <FormSelect
                  name="producer_id"
                  label="Producteur"
                  options={producers.map((p) => ({ value: p.id, label: p.name }))}
                  placeholder="Sélectionner un producteur"
                />
              </CardContent>
            </Card>
          </div>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FormCheckbox
                  name="is_active"
                  description="Si coché, le produit sera visible et disponible à la vente."
                  falseBadge="Inactif"
                  label="Produit actif"
                  trueBadge="Actif"
                />

                <FormCheckbox
                  name="featured"
                  description="Les produits vedettes peuvent être mis en avant sur certaines pages."
                  falseBadge="Standard"
                  label="Produit vedette"
                  trueBadge="Vedette"
                />
              </div>
            </CardContent>
          </Card>

          {}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>

            <Button
              className="flex items-center gap-2"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Créer le produit
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
export default NewProductPage
