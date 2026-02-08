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
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'

type ProfileFormProps = {
  initialData: {
    id: string
    name: string
    description: string
    website: string
    contact_email: string
    location: string
    status: string
  }
  userEmail: string
}

export const ProfileForm: FC<ProfileFormProps> = ({ initialData, userEmail }) => {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // TODO: Implement save action
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <AdminPageLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mon Profil Producteur</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Ces informations sont liées à votre compte utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" value={userEmail} disabled className="bg-muted/50" />
              </div>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>Ces informations seront affichées publiquement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Nom de l'entreprise
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Votre entreprise"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full min-h-24 px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez votre activité..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="website" className="text-sm font-medium">
                    Site web
                  </label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="text-sm font-medium">
                    Email de contact
                  </label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="contact@..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="text-sm font-medium">
                  Localisation
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Ville, Pays"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : formData.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {formData.status === 'active'
                    ? 'Actif'
                    : formData.status === 'pending'
                      ? 'En attente'
                      : formData.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
