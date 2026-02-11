'use client'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Separator, Badge } from '@make-the-change/core/ui'
import { ArrowLeft, Target, ShieldCheck, Leaf, CreditCard, Lock, Check, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { formatCurrency, cn } from '@/lib/utils'

interface Project {
  id: string
  slug: string
  name_default: string
  target_budget: number | null
  current_funding: number | null
  hero_image_url?: string | null
}

interface InvestClientProps {
  project: Project
}

const PRESET_AMOUNTS = [50, 100, 250, 500]

export function InvestClient({ project }: InvestClientProps) {
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const router = useRouter()

  const handlePresetClick = (value: number) => {
    setAmount(value.toString())
    setSelectedPreset(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setSelectedPreset(null)
  }

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For now, just alert and redirect
    // alert(`Merci pour votre intention d'investir ${amount}€ dans ${project.name_default}!`)
    router.push('/dashboard/investments')
    setLoading(false)
  }

  const numericAmount = parseFloat(amount) || 0
  const impactTrees = Math.floor(numericAmount / 10) // Example calculation: 10€ = 1 tree (hypothetical)
  const progressPercent = project.target_budget 
    ? Math.min(((project.current_funding || 0) + numericAmount) / project.target_budget * 100, 100)
    : 0

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl space-y-8 relative z-10">
        {/* Navigation */}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="bg-background/80 backdrop-blur-sm border p-2 rounded-full mr-3 group-hover:scale-110 transition-transform shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Retour au projet
        </Link>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden backdrop-blur-xl bg-background/80">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
          
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Investir dans l'avenir</CardTitle>
            <CardDescription className="text-base mt-2">
              Vous soutenez <span className="font-semibold text-foreground">{project.name_default}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground block text-center">
                Combien souhaitez-vous investir ?
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetClick(val)}
                    className={cn(
                      "relative h-12 rounded-xl border-2 text-sm font-bold transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      selectedPreset === val 
                        ? "border-primary bg-primary/5 text-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]" 
                        : "border-muted bg-background hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {val}€
                    {selectedPreset === val && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-muted-foreground font-bold">€</span>
                </div>
                <Input
                  type="number"
                  min="10"
                  placeholder="Montant libre (min. 10€)"
                  value={amount}
                  onChange={handleInputChange}
                  className="pl-8 h-14 text-lg font-semibold bg-muted/30 border-muted-foreground/20 focus:border-primary focus:bg-background transition-all rounded-xl"
                />
              </div>
            </div>

            {/* Impact Visualization */}
            {numericAmount >= 10 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Impact estimé</p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    ~{impactTrees} arbres plantés ou protégés
                  </p>
                </div>
              </div>
            )}

            {/* Project Goal Context */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Objectif du projet</span>
                <span>{formatCurrency(project.target_budget || 0)}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/30 rounded-full"
                  style={{ width: `${(project.current_funding || 0) / (project.target_budget || 1) * 100}%` }}
                />
                <div 
                  className="h-full bg-primary -mt-2 rounded-full relative animate-pulse"
                  style={{ 
                    width: `${Math.min(numericAmount / (project.target_budget || 1) * 100, 100 - ((project.current_funding || 0) / (project.target_budget || 1) * 100))}%`,
                    left: `${(project.current_funding || 0) / (project.target_budget || 1) * 100}%`
                  }}
                />
              </div>
              {numericAmount > 0 && (
                <p className="text-[10px] text-center text-muted-foreground">
                  Votre contribution ajoutera +{(numericAmount / (project.target_budget || 1) * 100).toFixed(2)}% à l'objectif
                </p>
              )}
            </div>

            <Separator />

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-xs">Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs">Projet vérifié</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pb-8 pt-2">
            <Button 
              onClick={handleInvest} 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all" 
              size="lg"
              disabled={loading || numericAmount < 10}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Confirmer {numericAmount > 0 ? formatCurrency(numericAmount) : ''}
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground px-8">
          En confirmant, vous acceptez nos <Link href="/terms" className="underline hover:text-primary">Conditions Générales d'Investissement</Link>. 
          L'investissement comporte des risques.
        </p>
      </div>
    </div>
  )
}
