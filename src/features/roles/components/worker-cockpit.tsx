'use client'

import { Camera, Clock, Mic, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui'

export function WorkerCockpit() {
  const [isRecording, setIsRecording] = useState(false)

  const handleRecordDown = () => setIsRecording(true)
  const handleRecordUp = () => setIsRecording(false)

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Profil ouvrier simplifié */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
          H
        </div>
        <div>
          <h2 className="text-lg font-bold">Bonjour Hubert</h2>
          <p className="text-sm text-muted-foreground">Chantier Sparrenlaan</p>
        </div>
      </div>

      {/* Bouton principal Voice First */}
      <div className="flex flex-col items-center justify-center py-8">
        <button
          className={`flex size-40 flex-col items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300 ${
            isRecording 
              ? 'border-red-500 bg-red-500/20 text-red-500 scale-95 shadow-red-500/20' 
              : 'border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
          }`}
          onMouseDown={handleRecordDown}
          onMouseUp={handleRecordUp}
          onTouchStart={handleRecordDown}
          onTouchEnd={handleRecordUp}
        >
          <Mic className={`size-12 mb-2 ${isRecording ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-bold">{isRecording ? 'Enregistrement...' : 'Maintenir pour dicter'}</span>
        </button>
        <p className="text-center text-xs text-muted-foreground mt-6 max-w-[250px]">
          "J'ai bossé de 8h à 12h sur la dalle avec Chris, on a utilisé 4 sacs de ciment."
        </p>
      </div>

      {/* Actions secondaires rapides */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Actions rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/photos/ajouter" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated">
            <Camera className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Prendre une photo</span>
          </Link>
          <Link href="/ajouter-tache" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated">
            <AlertTriangle className="size-6 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500">Signaler problème</span>
          </Link>
          <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated">
            <Clock className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Noter mes heures</span>
          </button>
          <Link href="/interventions/new" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated opacity-70">
            <span className="text-2xl leading-none font-light mb-1">+</span>
            <span className="text-xs font-semibold">Saisie manuelle</span>
          </Link>
        </div>
      </div>

      {/* Historique du jour */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Envoyé aujourd'hui</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
              <Mic className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Note vocale 10:42</p>
              <p className="text-xs text-blue-500">En cours d'analyse IA...</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Démolition extérieur</p>
              <p className="text-xs text-success">Validé par Christophe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
