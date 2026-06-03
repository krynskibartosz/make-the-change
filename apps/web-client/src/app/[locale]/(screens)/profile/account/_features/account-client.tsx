'use client'

import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Field, FieldControl, FieldError, FieldLabel, Input } from '@make-the-change/core/ui'
import { updateAccount } from './actions'

type AccountClientProps = {
  firstName: string
  lastName: string
  username: string
  email: string
}

export function AccountClient({ firstName, lastName, username, email }: AccountClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({ firstName, lastName })
  const initial = { firstName, lastName }
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const hasChanges = form.firstName !== initial.firstName || form.lastName !== initial.lastName

  const handleSave = () => {
    if (!hasChanges || isPending) return
    startTransition(async () => {
      const fd = new FormData()
      fd.append('firstName', form.firstName)
      fd.append('lastName', form.lastName)
      await updateAccount(fd)
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0B0F15] pb-[200px] text-white">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
            Mon Compte
          </span>
        </div>
      </header>

      <main className="flex-1 pt-[calc(env(safe-area-inset-top)+4rem)] mt-4">
        {/* Section: Identité Publique */}
        <div className="px-6 mb-2">
          <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">
            Identité Publique
          </h2>
        </div>
        <div className="mx-4 mb-8 overflow-hidden rounded-2xl bg-[#1A1F26] border border-white/5">
          {/* Pseudo — read-only */}
          <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between opacity-60">
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">
                Pseudo
              </span>
              <div className="flex items-center">
                <span className="text-white/50 mr-0.5 text-base font-medium">@</span>
                <span className="text-white text-base font-medium">{username}</span>
              </div>
              <span className="mt-0.5 text-[10px] text-white/30">Le pseudo ne peut pas être modifié après création.</span>
            </div>
            <Lock className="h-4 w-4 text-white/30 shrink-0" />
          </div>

          {/* Prénom */}
          <Field name="firstName" className="px-4 py-3.5 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
            <FieldLabel className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
              Prénom
            </FieldLabel>
            <FieldControl
              render={
                <Input
                  variant="ghost"
                  className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium h-auto rounded-none"
                />
              }
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: (e.target as HTMLInputElement).value }))}
            />
            <FieldError className="mt-1 text-xs text-red-400" />
          </Field>

          {/* Nom */}
          <Field name="lastName" className="px-4 py-3.5 focus-within:bg-white/[0.02] transition-colors">
            <FieldLabel className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
              Nom
            </FieldLabel>
            <FieldControl
              render={
                <Input
                  variant="ghost"
                  className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium h-auto rounded-none"
                />
              }
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: (e.target as HTMLInputElement).value }))}
            />
            <FieldError className="mt-1 text-xs text-red-400" />
          </Field>
        </div>

        {/* Section: Sécurité */}
        <div className="px-6 mb-2">
          <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">
            Sécurité
          </h2>
        </div>
        <div className="mx-4 mb-10 overflow-hidden rounded-2xl bg-[#1A1F26] border border-white/5">
          {/* Email — read-only */}
          <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between opacity-70">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">
                Adresse Email
              </span>
              <span className="text-white text-base font-medium">{email}</span>
              <span className="mt-0.5 text-[10px] text-white/30">Pour modifier votre email, contactez le support.</span>
            </div>
            <Lock className="h-4 w-4 text-white/30 shrink-0" />
          </div>

          {/* Modifier mot de passe — placeholder */}
          <button
            type="button"
            className="px-4 py-4 w-full flex items-center justify-between active:bg-white/[0.02] transition-colors"
          >
            <span className="text-white text-base font-medium">Modifier le mot de passe</span>
            <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
          </button>
        </div>

        {/* Danger zone */}
        {showDeleteConfirm ? (
          <div className="mx-4 mt-8 mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm font-bold text-red-400 mb-2">Confirmer la suppression</p>
            <p className="text-xs text-white/50 leading-relaxed mb-5">
              Cette action supprimera votre compte, votre progression et vos données personnelles associées.
              Certaines données de transaction peuvent être conservées pour raisons légales.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/70 transition-colors active:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-red-500/10 border border-red-500/30 py-3 text-sm font-bold text-red-400 transition-colors active:bg-red-500/20"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-8 pb-8">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Supprimer mon compte
            </button>
          </div>
        )}
      </main>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col">
        <div className="h-8 w-full bg-gradient-to-t from-[#0B0F15] to-transparent pointer-events-none" />
        <div className="bg-[#0B0F15] px-6 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))] w-full border-t border-white/5">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className={`w-full h-14 rounded-2xl font-black text-lg transition-all flex items-center justify-center ${
              hasChanges && !isPending
                ? 'bg-lime-400 text-[#0B0F15] shadow-[0_0_20px_rgba(163,230,53,0.2)] cursor-pointer active:scale-[0.98]'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
