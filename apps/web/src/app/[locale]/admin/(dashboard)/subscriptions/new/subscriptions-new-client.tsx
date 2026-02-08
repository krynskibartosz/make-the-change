'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@make-the-change/core/ui'
import { type FC, useState } from 'react'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { createSubscription } from '@/app/[locale]/admin/(dashboard)/subscriptions/actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'

const NewSubscriptionPage: FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    user_id: '',
    stripe_customer_id: '',
    plan_type: 'monthly_standard' as
      | 'monthly_standard'
      | 'monthly_premium'
      | 'annual_standard'
      | 'annual_premium',
    billing_frequency: 'monthly' as 'monthly' | 'annual',
    monthly_points_allocation: 0,
    monthly_price: 0,
    annual_price: 0,
    bonus_percentage: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      const form = new FormData()
      for (const [key, value] of Object.entries(formData)) {
        form.append(key, String(value))
      }

      const result = await createSubscription({ success: false, message: '' }, form)

      if (result.success && result.id) {
        toast({
          title: 'Succès',
          description: 'Abonnement créé avec succès',
        })
        router.push(`/admin/subscriptions/${result.id}`)
        return
      }

      toast({
        title: 'Erreur',
        description: result.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        description="Créer un nouvel abonnement ambassadeur"
        title="Nouvel Abonnement"
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l&apos;abonnement</CardTitle>
            <CardDescription>Configurez les détails du nouvel abonnement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID Utilisateur</label>
              <Input
                required
                placeholder="UUID de l'utilisateur"
                value={formData.user_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Stripe Customer ID</label>
              <Input
                required
                placeholder="cus_..."
                value={formData.stripe_customer_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stripe_customer_id: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Plan</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={formData.plan_type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, plan_type: e.target.value as any }))
                  }
                >
                  <option value="monthly_standard">Mensuel Standard</option>
                  <option value="monthly_premium">Mensuel Premium</option>
                  <option value="annual_standard">Annuel Standard</option>
                  <option value="annual_premium">Annuel Premium</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Fréquence de facturation</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={formData.billing_frequency}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, billing_frequency: e.target.value as any }))
                  }
                >
                  <option value="monthly">Mensuelle</option>
                  <option value="annual">Annuelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Points mensuels</label>
                <Input
                  required
                  type="number"
                  value={formData.monthly_points_allocation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      monthly_points_allocation: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Prix mensuel (€)</label>
                <Input
                  type="number"
                  value={formData.monthly_price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, monthly_price: Number(e.target.value) }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Prix annuel (€)</label>
                <Input
                  type="number"
                  value={formData.annual_price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, annual_price: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Bonus (%)</label>
              <Input
                required
                max="100"
                min="0"
                type="number"
                value={formData.bonus_percentage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bonus_percentage: Number(e.target.value) }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Création...' : 'Créer l&apos;abonnement'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/subscriptions')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </AdminPageContainer>
  )
}

export default NewSubscriptionPage
