'use client'

import type { Database } from '@make-the-change/core/database-types'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@make-the-change/core/ui'
import { ArrowLeft, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocalizedLink } from '@/components/localized-link'
import { useRouter } from 'next/navigation'

type Project = Database['public']['Views']['projects']['Row']

interface InvestClientProps {
  slug: Promise<{ slug: string }>
}

export function InvestClient({ slug }: InvestClientProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    try {
      const resolvedSlug = (await slug).slug
      // First try to find by slug, then by name if slug doesn't work
      const response = await fetch(`/api/projects?search=${resolvedSlug}`)

      if (!response.ok) throw new Error('Failed to fetch project')

      const data = await response.json()
      const projects = data.items || []

      // Try to find project by slug or name or id
      let foundProject = projects.find((p: Project) => p.slug === resolvedSlug)
      if (!foundProject) {
        foundProject = projects.find((p: Project) =>
          p.name_default?.toLowerCase().includes(resolvedSlug.toLowerCase()),
        )
      }
      // Also try ID check if resolvedSlug looks like an ID
      if (!foundProject && !isNaN(Number(resolvedSlug))) {
         foundProject = projects.find((p: Project) => String(p.id) === resolvedSlug)
      }

      // If still not found, check the featured projects hardcoded list (fallback for demo)
      if (!foundProject) {
         // This is a hack because the featured section uses hardcoded IDs 1, 2, 3 
         // which might not exist in the API or DB yet.
         // For now, if we don't find it in API, we might show a generic state or error.
         // But let's assume the API returns real projects or we handle the error.
      }

      if (!foundProject) {
        setError('Projet non trouvé')
        return
      }

      setProject(foundProject)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Erreur lors du chargement du projet')
    } finally {
      setLoading(false)
    }
  }

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for investment logic
    alert(`Merci pour votre intention d'investir ${amount}€ dans ${project?.name_default}!`)
    // Redirect to success or dashboard
    // router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Projet non trouvé</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          {error || "Le projet que vous recherchez n'existe pas."}
        </p>
        <LocalizedLink
          href="/projects"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </LocalizedLink>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <LocalizedLink
        href={`/projects/${project.id}`} // Or project.slug if available
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au projet
      </LocalizedLink>

      <Card>
        <CardHeader>
          <CardTitle>Investir dans {project.name_default}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Objectif: {project.target_budget}€</span>
             </div>
             {project.roi_percent && (
               <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>ROI: {project.roi_percent}%</span>
               </div>
             )}
          </div>

          <form onSubmit={handleInvest} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Montant de l'investissement (€)</label>
              <Input
                id="amount"
                type="number"
                min="10"
                placeholder="Ex: 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Montant minimum: 10€</p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Confirmer l'investissement
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
