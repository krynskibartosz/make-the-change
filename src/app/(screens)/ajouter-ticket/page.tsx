'use client'

import { Camera, CheckCircle2, ChevronLeft, Loader2, Receipt } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, StickyActionBar } from '@/components/ui'

type Status = 'idle' | 'scanning' | 'success'

export default function AjouterTicketPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')

  const handleScan = () => {
    setStatus('scanning')
    // Simuler le temps de prise de vue et d'analyse IA
    setTimeout(() => {
      setStatus('success')
    }, 2500)
  }

  const handleFinish = () => {
    router.back()
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-xl font-semibold">Scanner un ticket</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 flex flex-col p-5 max-w-md mx-auto w-full">
        {status === 'idle' && (
          <div className="flex-1 flex flex-col gap-8">
            <p className="text-muted-foreground text-center text-sm">
              Prenez en photo votre ticket de caisse. L'IA en extraira le montant et le fournisseur
              automatiquement.
            </p>

            {/* Fausse zone caméra */}
            <div className="flex-1 min-h-[300px] border-2 border-dashed border-primary/30 rounded-3xl flex flex-col items-center justify-center bg-surface relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <Receipt className="size-16 text-primary/40 mb-4" />
              <span className="text-primary font-medium">Cadrez le ticket ici</span>
            </div>

            <StickyActionBar
              primaryAction={
                <Button
                  size="primary"
                  className="w-full h-16 text-lg rounded-2xl flex items-center justify-center gap-3"
                  onClick={handleScan}
                >
                  <Camera className="size-6" />
                  Prendre la photo
                </Button>
              }
            />
          </div>
        )}

        {status === 'scanning' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in-95">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="bg-surface border-4 border-primary rounded-3xl p-6 relative">
                <Receipt className="size-16 text-primary animate-pulse" />
                {/* Ligne de scan animée */}
                <div
                  className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_8px_2px_hsl(var(--primary))] animate-scan"
                  style={{ top: '50%' }}
                />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Analyse en cours...</h2>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Lecture du montant et du fournisseur
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in slide-in-from-bottom-8">
            <div className="size-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-12 text-emerald-500" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ticket lu par l'IA !</h2>
              <p className="text-muted-foreground mb-6">
                Vérifiez les informations ci-dessous. Elles seront envoyées à Christophe pour
                validation.
              </p>

              <div className="bg-surface border border-border rounded-2xl p-5 text-left flex flex-col gap-3 shadow-sm mb-8 w-full max-w-[280px]">
                <div className="flex justify-between items-center border-b border-border/50 pb-3">
                  <span className="text-muted-foreground text-sm">Type</span>
                  <span className="font-semibold">Repas Midi</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-3">
                  <span className="text-muted-foreground text-sm">Fournisseur</span>
                  <span className="font-semibold">Boulangerie Paul</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Montant</span>
                  <span className="font-bold text-lg text-primary">14.50 €</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 w-full px-5">
                <Button size="primary" className="w-full rounded-xl" onClick={handleFinish}>
                  Envoyer à Christophe
                </Button>
                <Button
                  size="primary"
                  variant="secondary"
                  className="w-full rounded-xl border-border bg-surface text-foreground"
                  onClick={() => setStatus('idle')}
                >
                  Corriger
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation CSS injectée pour le scanner */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `,
        }}
      />
    </main>
  )
}
