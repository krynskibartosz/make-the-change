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
import { Check } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ProfileFormValues, PasswordFormValues } from './schemas'

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
  t
}: ProfileViewProps) {
  const { register: registerProfile, formState: { errors: profileErrors } } = profileForm
  const { register: registerPassword, formState: { errors: passwordErrors } } = passwordForm

  return (
    <div className="space-y-6">
      {/* Personal Info Form */}
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">{t('personal_info')}</CardTitle>
          <CardDescription className="hidden sm:block">
            Mettez à jour vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            {profileStatus.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {profileStatus.error}
              </div>
            )}
            {profileStatus.success && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <Check className="h-4 w-4" />
                {profileStatus.success}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Input
                  id="firstName"
                  label={t('first_name')}
                  {...registerProfile('firstName')}
                  error={profileErrors.firstName?.message}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="lastName"
                  label={t('last_name')}
                  {...registerProfile('lastName')}
                  error={profileErrors.lastName?.message}
                />
              </div>
            </div>

            <Input
              id="email"
              type="email"
              label={t('email')}
              defaultValue={userEmail || ''}
              disabled
            />

            <Input
              id="phone"
              type="tel"
              label={t('phone')}
              {...registerProfile('phone')}
              error={profileErrors.phone?.message}
            />

            <Input
              id="address"
              label={t('address')}
              {...registerProfile('address')}
              error={profileErrors.address?.message}
            />

            <div className="grid gap-4 sm:grid-cols-3">
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
              <Input
                id="country"
                label={t('country')}
                {...registerProfile('country')}
                error={profileErrors.country?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="bio"
                className="text-sm font-medium text-muted-foreground dark:text-foreground/80"
              >
                Bio
              </label>
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

            <Button type="submit" loading={isProfileSubmitting} className="w-full sm:w-auto">
              {t('save_changes')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Form */}
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">{t('change_password')}</CardTitle>
          <CardDescription className="hidden sm:block">
            Mettez à jour votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
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

            <Button type="submit" loading={isPasswordSubmitting} className="w-full sm:w-auto">
              {t('change_password')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
