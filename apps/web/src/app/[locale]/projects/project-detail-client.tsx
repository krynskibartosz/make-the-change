'use client'

import type { Database } from '@make-the-change/core/database-types'
import { ArrowLeft, Calendar, MapPin, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocalizedLink } from '@/components/localized-link'

type Project = Database['public']['Views']['projects']['Row']

interface ProjectDetailClientProps {
  slug: Promise<{ slug: string }>
}

export function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      // Try to find project by slug or name
      let foundProject = projects.find((p: Project) => p.slug === resolvedSlug)
      if (!foundProject) {
        foundProject = projects.find((p: Project) =>
          p.name_default?.toLowerCase().includes(resolvedSlug.toLowerCase()),
        )
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

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Chargement du projet...</p>
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
    <div className="space-y-8">
      {/* Back Button */}
      <LocalizedLink
        href="/projects"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux projets
      </LocalizedLink>

      {/* Hero Section */}
      <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border">
        <div className="h-64 bg-gradient-to-br from-primary/60 to-accent/80 relative">
          {project.hero_image_url ? (
            <img
              src={project.hero_image_url}
              alt={project.name_default || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-foreground">
              <Target className="h-24 w-24" />
            </div>
          )}
          {project.featured && (
            <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              Vedette
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Title and Location */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{project.name_default}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <span>
                {project.address_street && `${project.address_street}, `}
                {project.address_postal_code && `${project.address_postal_code} `}
                {project.address_city}, {project.address_country_code}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.long_description_default || project.description_default}
            </p>
          </div>

          {/* Funding Progress */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Progression du financement</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-bold text-primary">
                  {calculateProgress(
                    project.current_funding ?? 0,
                    project.target_budget ?? 0,
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="w-full bg-input rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${calculateProgress(project.current_funding ?? 0, project.target_budget ?? 0)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">
                  Actuellement: {formatCurrency(project.current_funding ?? 0)}
                </span>
                <span className="font-bold">
                  Objectif: {formatCurrency(project.target_budget ?? 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center text-muted-foreground mb-2">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Lancement</span>
              </div>
              <p className="font-medium">
                {project.launch_date
                  ? new Date(project.launch_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center text-muted-foreground mb-2">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-medium">Statut</span>
              </div>
              <p className="font-medium capitalize">{project.status}</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center text-muted-foreground mb-2">
                <Target className="h-5 w-5 mr-2" />
                <span className="font-medium">Type</span>
              </div>
              <p className="font-medium capitalize">{project.type}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg">
              Investir dans ce projet
            </button>
            <button className="px-6 py-3 border border-input text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-lg">
              Contacter le porteur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
