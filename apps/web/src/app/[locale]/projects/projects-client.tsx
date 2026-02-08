'use client'

import { Calendar, MapPin, Search, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocalizedLink } from '@/components/localized-link'
import { cn } from '@make-the-change/core/shared/utils'

interface Project {
  id: string
  slug: string
  name_default: string
  description_default: string
  long_description_default: string
  target_budget: number
  current_funding: number
  funding_progress: number
  address_city: string
  address_country_code: string
  featured: boolean
  launch_date: string
  maturity_date: string
  hero_image_url?: string
  type: string
  status: string
  created_at: string
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')

      const data = await response.json()
      setProjects(data.items || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name_default.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description_default.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.address_city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProjects(filtered)
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
          <p className="text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Nos Projets Écologiques
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Investissez dans des projets durables qui transforment notre planète et génèrent un impact
          positif mesurable.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Aucun projet trouvé</h2>
          <p className="text-muted-foreground max-w-md">
            {searchTerm
              ? 'Essayez de modifier votre recherche.'
              : 'Nos projets sont en cours de préparation. Revenez bientôt!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border"
            >
              {/* Hero Image */}
              <div className="h-48 bg-gradient-to-br from-primary/80 to-accent/80 relative">
                {project.hero_image_url ? (
                  <img
                    src={project.hero_image_url}
                    alt={project.name_default}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-foreground">
                    <Target className="h-16 w-16" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                    Vedette
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title and Location */}
                <div>
                  <h3 className="text-xl font-bold mb-2">{project.name_default}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {project.address_city}, {project.address_country_code}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-3">{project.description_default}</p>

                {/* Funding Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold text-primary">
                      {calculateProgress(project.current_funding, project.target_budget).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${calculateProgress(project.current_funding, project.target_budget)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatCurrency(project.current_funding)}</span>
                    <span className="font-medium">
                      {formatCurrency(project.target_budget)}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(project.launch_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="capitalize">{project.status}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <LocalizedLink
                    href={`/projects/${project.slug}`}
                    className="flex-1"
                  >
                    <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      En savoir plus
                    </button>
                  </LocalizedLink>
                  <LocalizedLink
                    href={`/projects/${project.slug}`}
                    className="flex-1"
                  >
                    <button className="w-full border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors font-medium">
                      Investir
                    </button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
