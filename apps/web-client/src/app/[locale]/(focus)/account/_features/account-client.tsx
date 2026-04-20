'use client'

import { ChevronLeft, ChevronRight, Lock, LogOut, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { logout } from '@/app/[locale]/(auth)/actions'
import { useRouter } from '@/i18n/navigation'
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
            </div>
            <Lock className="h-4 w-4 text-white/30 shrink-0" />
          </div>

          {/* Prénom */}
          <div className="px-4 py-3.5 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
            <label
              htmlFor="firstName"
              className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5"
            >
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              className="w-full bg-transparent text-white text-base focus:outline-none font-medium"
            />
          </div>

          {/* Nom */}
          <div className="px-4 py-3.5 focus-within:bg-white/[0.02] transition-colors">
            <label
              htmlFor="lastName"
              className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              className="w-full bg-transparent text-white text-base focus:outline-none font-medium"
            />
          </div>
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
        <div className="mx-4 flex flex-col gap-3 pb-8">
          <form action={logout}>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#1A1F26] text-white font-bold text-sm transition-all active:bg-white/10 border border-white/5 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4 text-white/50" />
              Se déconnecter
            </button>
          </form>
          <button
            type="button"
            className="w-full py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold text-sm transition-all active:bg-red-500/20 border border-red-500/10 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer mon compte
          </button>
        </div>
      </main>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col">
        <div className="h-8 w-full bg-gradient-to-t from-[#0B0F15] to-transparent pointer-events-none" />
        <div className="bg-[#0B0F15] px-6 pb-8 pt-2 w-full border-t border-white/5">
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
