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
import { Check, Shield, User, MapPin, Key } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ProfileFormValues, PasswordFormValues } from './schemas'
import { SaveStatusIndicator } from '@/components/dashboard/save-status-indicator'
import type { AutoSaveReturn } from '@/hooks/use-optimistic-auto-save'

interface ProfileViewProps {
  profileForm: UseFormReturn<ProfileFormValues>
  passwordForm: UseFormReturn<PasswordFormValues>
  onProfileSubmit: (data: ProfileFormValues) => void
  onPasswordSubmit: (data: PasswordFormValues) => void
  isProfileSubmitting: boolean
  isPasswordSubmitting: boolean
  profileStatus: { error?: string; success?: string }
  passwordStatus: { error?: string; success?: string }
  userEmail?: string
  autoSave: AutoSaveReturn
  t: (key: string) => string
}

export function ProfileView({
  profileForm,
  passwordForm,
  onProfileSubmit,
  onPasswordSubmit,
  isProfileSubmitting,
  isPasswordSubmitting,
  profileStatus,
  passwordStatus,
  userEmail,
  autoSave,
  t
}: ProfileViewProps) {
  const { register: registerProfile, formState: { errors: profileErrors } } = profileForm
  const { register: registerPassword, formState: { errors: passwordErrors } } = passwordForm

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t('edit_profile')}
        </h2>
        <SaveStatusIndicator 
          status={autoSave.status} 
          errorMessage={autoSave.errorMessage}
          pendingChanges={autoSave.pendingChanges}
          onSaveNow={autoSave.saveNow}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Personal Info Card */}
        <Card className="border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">{t('personal_info')}</CardTitle>
                <CardDescription className="text-xs">Identité et contact</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-4 sm:pt-6">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                <Input
                  id="firstName"
                  label={t('first_name')}
                  {...registerProfile('firstName')}
                  error={profileErrors.firstName?.message}
                />
                <Input
                  id="lastName"
                  label={t('last_name')}
                  {...registerProfile('lastName')}
                  error={profileErrors.lastName?.message}
                />
              </div>

              <Input
                id="email"
                type="email"
                label={t('email')}
                defaultValue={userEmail || ''}
                disabled
                description="L'email ne peut pas être modifié pour le moment."
              />

              <Input
                id="phone"
                type="tel"
                label={t('phone')}
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
              />
            </form>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-client-orange-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-client-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">{t('location')}</CardTitle>
                <CardDescription className="text-xs">{t('residence_address')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-4 sm:pt-6">
            <div className="space-y-6">
              <Input
                id="address"
                label={t('address')}
                {...registerProfile('address')}
                error={profileErrors.address?.message}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                <Input
                  id="city"
                  label={t('city')}
                  {...registerProfile('city')}
                  error={profileErrors.city?.message}
                />
                <Input
                  id="postalCode"
                  label={t('postal_code')}
                  {...registerProfile('postalCode')}
                  error={profileErrors.postalCode?.message}
                />
              </div>
              <Input
                id="country"
                label={t('country')}
                {...registerProfile('country')}
                error={profileErrors.country?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio Card (Full Width) */}
        <Card className="xl:col-span-2 border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-client-emerald-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-client-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">{t('bio_impact')}</CardTitle>
                <CardDescription className="text-xs">{t('tell_your_story')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-4 sm:pt-6">
            <div className="space-y-2">
              <textarea
                id="bio"
                rows={4}
                className="w-full rounded-2xl border border-[hsl(var(--border)/0.8)] bg-background/70 px-4 py-3 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
                placeholder="Partagez quelques lignes sur vous et votre impact."
                {...registerProfile('bio')}
              />
              {profileErrors.bio && (
                <p className="text-sm text-destructive">{profileErrors.bio.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Card (Full Width or separate row) */}
        <Card className="xl:col-span-2 border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md border-destructive/20">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Key className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">{t('change_password')}</CardTitle>
                <CardDescription className="text-xs">{t('account_security')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-4 sm:pt-6">
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              {passwordStatus.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {passwordStatus.error}
                </div>
              )}
              {passwordStatus.success && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  {passwordStatus.success}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                <Input
                  id="newPassword"
                  type="password"
                  label={t('new_password')}
                  autoComplete="new-password"
                  {...registerPassword('newPassword')}
                  error={passwordErrors.newPassword?.message}
                />

                <Input
                  id="confirmPassword"
                  type="password"
                  label={t('confirm_new_password')}
                  autoComplete="new-password"
                  {...registerPassword('confirmPassword')}
                  error={passwordErrors.confirmPassword?.message}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={isPasswordSubmitting} variant="destructive">
                  {t('change_password')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
