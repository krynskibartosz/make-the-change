'use client'

import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Subject = 'bug' | 'partnership' | 'other'

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('bug')
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative pb-10">
      {/* HEADER - Bouton Retour */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/30 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            Nous contacter
          </span>
        </div>
      </header>

      {/* 1. HERO */}
      <div className="px-6 pt-24 pb-8 flex flex-col items-start">
        <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase mb-4">
          GARDONS LE LIEN
        </span>
        <h1 className="text-4xl font-bold text-white tracking-tight leading-[1.1] mb-4">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-gray-400 text-base font-light leading-relaxed mb-6">
          Une idée, un partenariat ou un retour sur l'app ? L'équipe lit chaque message.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-gray-300">Temps de réponse estimé : 24 à 48h</span>
        </div>
      </div>

      {/* 2. FAST-TRACKS - Mini Bento */}
      <div className="px-6 pb-10 grid grid-cols-2 gap-3">
        {/* Carte 1 - Email direct */}
        <a
          href="mailto:hello@makethechange.app"
          className="col-span-2 relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] flex items-center justify-between group cursor-pointer hover:border-white/[0.15] transition"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
              <Mail className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Écrire directement</span>
              <span className="text-sm text-white font-medium">hello@makethechange.app</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </a>

        {/* Carte 2 - FAQ */}
        <a
          href="/faq"
          className="col-span-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white/[0.04] transition"
        >
          <div className="flex items-start justify-between">
            <HelpCircle className="h-6 w-6 text-white/80" />
            <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition" />
          </div>
          <span className="text-sm font-medium text-white">Consulter la FAQ</span>
        </a>

        {/* Carte 3 - Micro Social Hub */}
        <div className="col-span-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between aspect-square">
          <span className="text-sm font-medium text-white">Nos réseaux</span>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition"
            >
              <Linkedin className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition"
            >
              <Instagram className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. FORMULAIRE ORGANIQUE */}
      <div className="mx-6 p-1 rounded-3xl bg-white/[0.02] border border-white/[0.05] mb-20">
        <div className="bg-[#0A0A0A] rounded-[22px] p-6 flex flex-col gap-6">
          {/* A. Sélecteur de Sujet (Chips) */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              C'est à propos de :
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'bug' as Subject, label: 'Bug / Technique' },
                  { id: 'partnership' as Subject, label: 'Partenariat' },
                  { id: 'other' as Subject, label: 'Autre' },
                ]
              ).map((chip) => {
                const isActive = selectedSubject === chip.id
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedSubject(chip.id)}
                    className={
                      isActive
                        ? 'px-4 py-2 rounded-full border border-white/20 bg-white/10 text-sm text-white transition'
                        : 'px-4 py-2 rounded-full border border-white/5 bg-transparent text-sm text-gray-400 hover:text-white hover:border-white/10 transition'
                    }
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* B. Inputs */}
          <input
            type="email"
            placeholder="Votre email"
            className="bg-transparent border-b border-white/10 focus:border-emerald-500 pb-3 text-white placeholder:text-gray-600 outline-none transition-colors w-full text-base"
          />
          <textarea
            placeholder="Votre message"
            className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 pb-3 text-white placeholder:text-gray-600 outline-none transition-colors text-base min-h-[100px] resize-none mt-4"
          />

          {/* C. Bouton Submit */}
          <button
            type="submit"
            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all"
          >
            Envoyer le message
          </button>
        </div>
      </div>
    </div>
  )
}
