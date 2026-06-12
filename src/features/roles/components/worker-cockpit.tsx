'use client'

import {
  AlertTriangle,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Mic,
  Receipt,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { useReducer, useRef } from 'react'
import { Button } from '@/components/ui'
import { appendDemoSubmission, createWorkerSubmission } from '@/features/demo/demo-submissions'
import { ProjectSwitcher } from '@/features/projects/components/project-switcher'
import {
  initialWorkerCockpitState,
  workerCockpitReducer,
  workerStatusLabels,
} from '@/features/roles/worker-cockpit-state'
import { extractConstructionData, transcribeAudio } from '@/lib/services/ai-voice-service'

const statusStyles = {
  ready: 'border-primary/25 bg-primary/5 text-primary',
  recording: 'border-red-500/30 bg-red-500/10 text-red-600',
  analyzing: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  ready_to_send: 'border-primary/25 bg-primary/5 text-primary',
  sent: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
} as const

export function WorkerCockpit() {
  const [{ status, result, errorMessage }, dispatch] = useReducer(
    workerCockpitReducer,
    initialWorkerCockpitState,
  )
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'note-vocale.webm')
      const transcript = await transcribeAudio(formData)
      const extractedData = await extractConstructionData(transcript)
      dispatch({ type: 'analysis_succeeded', result: extractedData })
    } catch (error) {
      dispatch({
        type: 'failed',
        message:
          error instanceof Error ? error.message : "Une erreur est survenue pendant l'analyse.",
      })
    }
  }

  const handleRecordStart = async () => {
    if (status !== 'ready' && status !== 'error') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => {
          track.stop()
        })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      dispatch({ type: 'record_started' })
    } catch (error) {
      console.error('Erreur accès micro :', error)
      dispatch({ type: 'failed', message: 'Le micro est bloqué' })
    }
  }

  const handleRecordStop = () => {
    if (status !== 'recording' || !mediaRecorderRef.current) return
    dispatch({ type: 'record_stopped' })
    mediaRecorderRef.current.stop()
  }

  const resetState = () => dispatch({ type: 'reset' })

  const sendToChristophe = () => {
    if (!result) return
    appendDemoSubmission(window.localStorage, createWorkerSubmission(result))
    dispatch({ type: 'sent_locally' })
  }

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
          H
        </div>
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-lg font-bold leading-none">Bonjour Hubert</h2>
          <ProjectSwitcher />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          aria-live="polite"
          className={`mb-6 flex w-full items-center gap-3 rounded-xl border px-4 py-3 ${statusStyles[status]}`}
          role="status"
        >
          {status === 'analyzing' ? (
            <Loader2 className="size-5 shrink-0 animate-spin" />
          ) : status === 'recording' ? (
            <span className="size-3 shrink-0 animate-pulse rounded-full bg-current" />
          ) : status === 'error' ? (
            <AlertTriangle className="size-5 shrink-0" />
          ) : status === 'sent' ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : status === 'ready_to_send' ? (
            <Send className="size-5 shrink-0" />
          ) : (
            <Mic className="size-5 shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">{workerStatusLabels[status]}</p>
            <p className="text-xs opacity-80">
              {status === 'ready' && 'Maintiens le bouton pendant que tu parles.'}
              {status === 'recording' && "Je t'écoute, relâche quand tu as fini."}
              {status === 'analyzing' && 'Je prépare ta note.'}
              {status === 'ready_to_send' && 'Vérifie rapidement avant l’envoi.'}
              {status === 'sent' && 'La note est marquée comme envoyée sur cet appareil.'}
              {status === 'error' && 'Tu peux réessayer ou écrire une note.'}
            </p>
          </div>
        </div>

        {status === 'analyzing' ? (
          <div className="flex h-40 flex-col items-center justify-center">
            <Loader2 className="mb-4 size-12 animate-spin text-primary" />
            <p className="text-sm font-semibold">Analyse de la note...</p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Les informations utiles sont en cours de préparation.
            </p>
          </div>
        ) : null}

        {status === 'ready_to_send' && result ? (
          <div className="w-full animate-in overflow-hidden rounded-xl border border-primary/30 bg-surface p-4 shadow-sm zoom-in-95">
            <p className="mb-3 text-xs font-bold text-primary">J’ai compris :</p>
            <h3 className="mb-1 text-lg font-bold">
              {result.workType !== 'Non précisé' ? result.workType : 'Travail'}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{result.summary}</p>

            <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-xs text-muted-foreground">Zone</span>
              <span className="text-right font-medium">{result.zone}</span>
              <span className="text-xs text-muted-foreground">Avec</span>
              <span className="text-right font-medium">
                {result.workers.join(', ') || 'Moi seul'}
              </span>
              <span className="text-xs text-muted-foreground">Durée</span>
              <span className="text-right font-medium">{result.time}</span>
            </div>

            {result.materials.length > 0 || result.alerts.length > 0 ? (
              <div className="mb-4 flex flex-col gap-2 border-t border-border pt-3">
                {result.materials.length > 0 ? (
                  <p className="text-sm">
                    <span className="text-xs text-muted-foreground">Matériaux : </span>
                    <span className="font-medium">{result.materials.join(', ')}</span>
                  </p>
                ) : null}
                {result.alerts.length > 0 ? (
                  <p className="text-sm text-orange-600">
                    <span className="text-xs font-semibold">Signalement : </span>
                    <span className="font-medium">{result.alerts.join(', ')}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                leftIcon={<Send className="size-4" />}
                onClick={sendToChristophe}
                size="secondary"
                variant="primary"
              >
                Envoyer à Christophe
              </Button>
              <Button fullWidth onClick={resetState} size="secondary" variant="secondary">
                Corriger
              </Button>
            </div>
          </div>
        ) : null}

        {status === 'sent' && result ? (
          <div className="flex w-full animate-in flex-col items-center rounded-xl border border-success/30 bg-success/10 p-4 text-center zoom-in-95">
            <CheckCircle2 className="mb-3 size-10 text-success" />
            <h3 className="text-lg font-bold text-foreground">Note envoyée à Christophe</h3>
            <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Simulation locale : aucun envoi réseau n’a été effectué.
            </p>
            <Button className="mt-5" onClick={resetState} size="secondary" variant="secondary">
              Dicter une autre note
            </Button>
          </div>
        ) : null}

        {status === 'ready' || status === 'recording' ? (
          <>
            <button
              aria-label={
                status === 'recording'
                  ? "Relâcher pour terminer l'enregistrement"
                  : "Maintenir pour démarrer l'enregistrement"
              }
              className={`flex size-40 select-none flex-col items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300 ${
                status === 'recording'
                  ? 'scale-95 border-red-500 bg-red-500/20 text-red-600 shadow-red-500/20'
                  : 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
              }`}
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => {
                event.preventDefault()
                void handleRecordStart()
              }}
              onPointerLeave={() => {
                if (status === 'recording') handleRecordStop()
              }}
              onPointerUp={(event) => {
                event.preventDefault()
                handleRecordStop()
              }}
              type="button"
            >
              <Mic className={`mb-2 size-12 ${status === 'recording' ? 'animate-pulse' : ''}`} />
              <span className="px-4 text-center text-sm font-bold">
                {status === 'recording' ? "Je t'écoute..." : 'Maintiens pour dicter'}
              </span>
            </button>
            <p className="mt-6 max-w-[280px] text-center text-xs text-muted-foreground">
              Exemple : « J’ai travaillé de 8 h à 12 h sur la dalle avec Chris. »
            </p>
          </>
        ) : null}

        {status === 'error' ? (
          <div className="w-full max-w-sm animate-in rounded-xl border border-danger/20 bg-danger/10 p-4 text-center text-sm text-danger zoom-in-95">
            <p className="mb-1 text-base font-bold">{errorMessage}</p>
            <p className="mb-4 text-xs text-danger/80">
              Autorise le micro dans le navigateur ou dans les réglages du téléphone.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                onClick={() => void handleRecordStart()}
                size="secondary"
                variant="danger"
              >
                Réessayer
              </Button>
              <Link href="/ajouter-tache">
                <Button fullWidth size="secondary" variant="secondary">
                  Écrire une note
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 active:bg-surface-elevated"
            href="/photos/ajouter"
          >
            <Camera className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Prendre une photo</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 active:bg-surface-elevated"
            href="/ajouter-tache"
          >
            <AlertTriangle className="size-6 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600">Signaler un problème</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 active:bg-surface-elevated"
            href="/ajouter-heures"
          >
            <Clock className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Noter mes heures</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 active:bg-surface-elevated"
            href="/ajouter-ticket"
          >
            <Receipt className="size-6 text-foreground" />
            <span className="text-xs font-semibold">Scanner un ticket</span>
          </Link>
        </div>
      </div>

      <div className="mt-4 pb-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Envoyé aujourd’hui
        </h3>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Démolition extérieure</p>
            <p className="text-xs text-success">Validé par Christophe</p>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <Link
          className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors active:bg-primary/10"
          href="/roadmap-viewer"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Consignes du jour</span>
              <span className="text-xs text-muted-foreground">
                Voir ce qui est prévu aujourd’hui
              </span>
            </div>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}
