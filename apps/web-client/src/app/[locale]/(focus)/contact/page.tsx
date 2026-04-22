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
    <div className="fixed inset-0 z-40 bg-[#0B0F15] h-[100dvh] w-full text-white flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain pb-10">
      {/* Halo de lumière en haut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-lime-500/5 blur-[100px] pointer-events-none z-0" />

      {/* HEADER - Bouton Retour */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* 1. HERO */}
      <div className="px-6 pt-24 pb-8 flex flex-col items-start">
        <span className="text-[10px] font-bold tracking-widest text-lime-400 uppercase mb-3 block">
          Gardons le lien
        </span>
        <h1 className="text-4xl font-black text-white hyphens-none tracking-tighter text-balance leading-tight mb-3">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-gray-400 text-sm text-pretty leading-relaxed mb-6">
          Une idée, un partenariat ou un retour sur l'application ? L'équipe lit chaque message avec attention.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shrink-0" />
          <span className="text-xs text-gray-500 font-medium">Temps de réponse estimé : 24 à 48h</span>
        </div>
      </div>

      {/* 2. FAST-TRACKS - Mini Bento */}
      <div className="relative z-10 px-6 pb-10 grid grid-cols-2 gap-3">
        {/* Carte 1 - Email direct */}
        <a
          href="mailto:hello@makethechange.app"
          className="col-span-2 relative p-5 rounded-2xl bg-[#1A1F26] border border-white/5 shadow-sm flex items-center justify-between group cursor-pointer hover:border-white/10 transition"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 shrink-0">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Écrire directement</span>
              <span className="text-sm font-bold text-white">hello@makethechange.app</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </a>

        {/* Carte 2 - FAQ */}
        <a
          href="/faq"
          className="col-span-1 p-5 rounded-2xl bg-[#1A1F26] border border-white/5 flex flex-col justify-between h-32 group cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-start justify-between">
            <HelpCircle className="h-5 w-5 text-white/80" />
            <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition" />
          </div>
          <span className="text-sm font-bold text-white leading-snug">Consulter<br />la FAQ</span>
        </a>

        {/* Carte 3 - Micro Social Hub */}
        <div className="col-span-1 p-5 rounded-2xl bg-[#1A1F26] border border-white/5 flex flex-col justify-between h-32">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nos réseaux</span>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            >
              <Linkedin className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            >
              <Instagram className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. FORMULAIRE - Flat, intégré au fond */}
      <div className="relative z-10 px-6 mb-20 flex flex-col gap-6">
        {/* A. Sélecteur de Sujet (Chips) */}
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
          Ou envoyez un message
        </span>

        {/* Chips sujet */}
        <div className="w-full overflow-x-auto pb-3 flex gap-2">
          {([
            { id: 'bug' as Subject, label: 'Bug / Technique' },
            { id: 'partnership' as Subject, label: 'Partenariat' },
            { id: 'other' as Subject, label: 'Autre' },
          ]).map((chip) => {
            const isActive = selectedSubject === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedSubject(chip.id)}
                className={
                  isActive
                    ? 'whitespace-nowrap px-4 py-2 rounded-full bg-lime-400 text-[#0B0F15] font-bold text-sm transition shrink-0'
                    : 'whitespace-nowrap px-4 py-2 rounded-full border border-white/10 bg-[#1A1F26] text-gray-400 text-sm transition shrink-0'
                }
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* Inset grouped fields */}
        <div className="bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre email</label>
            <input
              type="email"
              placeholder="Pour vous recontacter..."
              className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium"
            />
          </div>
          <div className="px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre message</label>
            <textarea
              rows={4}
              placeholder="Décrivez votre demande en détail..."
              className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-lime-400 text-[#0B0F15] font-black text-lg h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(132,204,22,0.15)] flex items-center justify-center"
        >
          Envoyer le message
        </button>
      </div>
    </div>
  )
}
