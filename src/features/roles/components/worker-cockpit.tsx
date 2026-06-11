'use client'

import { Camera, Clock, Mic, AlertTriangle, CheckCircle2, Loader2, X, Send, Receipt } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { transcribeAudio, extractConstructionData, type ConstructionData } from '@/lib/services/ai-voice-service'

type Status = 'idle' | 'recording' | 'analyzing' | 'success' | 'error'

export function WorkerCockpit() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [result, setResult] = useState<ConstructionData | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  
  const handleRecordStart = async () => {
    if (status === 'analyzing' || status === 'success') return

    try {
      setErrorMsg(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        
        // Arrêter tous les tracks audio pour libérer le micro
        stream.getTracks().forEach(track => track.stop())
        
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setStatus('recording')
    } catch (err) {
      console.error('Erreur accès micro:', err)
      setErrorMsg('Le micro est bloqué')
      setStatus('error')
    }
  }

  const handleRecordStop = () => {
    if (status !== 'recording' || !mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
  }

  const processAudio = async (audioBlob: Blob) => {
    setStatus('analyzing')
    try {
      const transcript = await transcribeAudio(audioBlob)
      const extractedData = await extractConstructionData(transcript)
      setResult(extractedData)
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue pendant l\'analyse IA.')
      setStatus('error')
    }
  }

  const resetState = () => {
    setStatus('idle')
    setResult(null)
    setErrorMsg(null)
  }

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
        
        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="size-12 animate-spin text-primary mb-4" />
            <p className="text-sm font-semibold animate-pulse">Analyse de la note...</p>
            <p className="text-xs text-muted-foreground mt-2 text-center">Extraction des infos</p>
          </div>
        )}

        {status === 'success' && result && (
          <div className="w-full bg-surface border border-primary/30 rounded-2xl p-4 shadow-sm relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
              J'ai compris :
            </div>
            
            <h3 className="font-bold text-lg mb-1">{result.workType !== 'Non précisé' ? result.workType : 'Travail'}</h3>
            <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <div className="text-muted-foreground text-xs">Zone</div>
              <div className="font-medium text-right">{result.zone}</div>
              
              <div className="text-muted-foreground text-xs">Avec</div>
              <div className="font-medium text-right">{result.workers.join(', ') || 'Moi seul'}</div>
              
              <div className="text-muted-foreground text-xs">Durée</div>
              <div className="font-medium text-right">{result.time}</div>
            </div>

            {(result.materials.length > 0 || result.alerts.length > 0) && (
              <div className="border-t border-border pt-3 mb-4 flex flex-col gap-2">
                {result.materials.length > 0 && (
                  <div className="text-sm">
                    <span className="text-xs text-muted-foreground">Matériaux:</span> <span className="font-medium">{result.materials.join(', ')}</span>
                  </div>
                )}
                {result.alerts.length > 0 && (
                  <div className="text-sm text-orange-500">
                    <span className="text-xs font-semibold">Signalement:</span> <span className="font-medium">{result.alerts.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button size="secondary" className="flex-1" variant="primary" leftIcon={<Send className="size-4" />}>
                Envoyer à Christophe
              </Button>
              <Button size="secondary" variant="secondary" className="flex-1" onClick={resetState}>
                Corriger
              </Button>
            </div>
          </div>
        )}

        {(status === 'idle' || status === 'recording' || status === 'error') && (
          <>
            <button
              className={`flex size-40 flex-col items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300 select-none ${
                status === 'recording'
                  ? 'border-red-500 bg-red-500/20 text-red-500 scale-95 shadow-red-500/20' 
                  : 'border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
              }`}
              onPointerDown={(e) => {
                e.preventDefault()
                handleRecordStart()
              }}
              onPointerUp={(e) => {
                e.preventDefault()
                handleRecordStop()
              }}
              onPointerLeave={(e) => {
                if (status === 'recording') {
                  handleRecordStop()
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Mic className={`size-12 mb-2 ${status === 'recording' ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-bold text-center px-4">
                {status === 'recording' ? 'Je t\'écoute...' : 'Maintiens pour dicter'}
              </span>
            </button>
            <p className="text-center text-xs text-muted-foreground mt-6 max-w-[250px]">
              "J'ai bossé de 8h à 12h sur la dalle avec Chris, on a utilisé 4 sacs de ciment."
            </p>
          </
          >
        )}

        {status === 'error' && (
          <div className="mt-4 text-center text-sm text-danger bg-danger/10 border border-danger/20 p-4 rounded-xl max-w-xs animate-in zoom-in-95 w-full">
            <p className="font-bold mb-1 text-base">{errorMsg}</p>
            <p className="text-xs text-danger/80 mb-4">Pour dicter, autorisez le micro dans votre navigateur ou les réglages du téléphone.</p>
            <div className="flex flex-col gap-2">
              <Button size="secondary" variant="primary" className="w-full bg-danger text-danger-foreground hover:bg-danger/90" onClick={handleRecordStart}>
                Réessayer
              </Button>
              <Link href="/ajouter-tache" className="w-full">
                <Button size="secondary" variant="secondary" className="w-full border-danger/30 text-danger hover:bg-danger/10">
                  Écrire une note
                </Button>
              </Link>
            </div>
          </div>
        )}
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
          <Link href="/ajouter-heures" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated">
            <Clock className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Noter mes heures</span>
          </Link>
          <Link href="/ajouter-ticket" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 active:bg-surface-elevated">
            <Receipt className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Scanner un ticket</span>
          </Link>
        </div>
      </div>

      {/* Historique du jour */}
      <div className="mt-4 pb-12">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Envoyé aujourd'hui</h3>
        <div className="flex flex-col gap-2">
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
