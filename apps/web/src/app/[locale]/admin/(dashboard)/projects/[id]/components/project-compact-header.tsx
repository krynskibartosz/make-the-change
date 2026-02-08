'use client'

import { cn } from '@make-the-change/core/shared/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@make-the-change/core/ui'
import { Building, ChevronDown, ChevronUp, Info, Folder, Star } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { type FC, useState } from 'react'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'
import { SaveStatusIndicator } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/save-status-indicator'
import { LocalizedLink as Link } from '@/components/localized-link'
import type { ProjectFormData } from '@/lib/validators/project'

type ProjectData = ProjectFormData & { id: string }

type ProjectCompactHeaderProps = {
  projectData: ProjectData
  saveStatus?: SaveStatus | null
  onSaveAll?: () => void
  onStatusChange?: (newStatus: 'active' | 'draft' | 'funded' | 'completed' | 'archived') => void
}

export const ProjectCompactHeader: FC<ProjectCompactHeaderProps> = ({
  projectData,
  saveStatus,
  onSaveAll,
  onStatusChange,
}) => {
  const t = useTranslations()
  const [showMobileDetails, setShowMobileDetails] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // Using simplified status toggle for now (Active/Draft) or maybe strict status flow?
  // For consistency with Product Editor which toggles Active/Inactive, we might need a dropdown for Projects 
  // since they have multiple states. But for now let's keep it simple or use a dropdown if possible.
  // The Product Header has a toggle button. Projects have specific statuses.
  // Let's implement a simple status badge for now, and maybe a toggle if "Active" is the main goal.
  // Actually, let's allow toggling between Draft and Active for simplicity in this generalized pattern.
  const [pendingStatusChange, setPendingStatusChange] = useState<ProjectFormData['status'] | null>(null)

  const status = projectData.status

  const statusConfig: Record<string, { label: string; dotClass: string; pillClass: string }> = {
    active: {
      label: 'Actif',
      dotClass: 'bg-success',
      pillClass: 'bg-success/10 border-success/25 hover:bg-success/15',
    },
    draft: {
      label: 'Brouillon',
      dotClass: 'bg-muted-foreground',
      pillClass: 'bg-muted/30 border-border/60 hover:bg-muted/40',
    },
    funded: {
      label: 'Financé',
      dotClass: 'bg-primary',
      pillClass: 'bg-primary/10 border-primary/25 hover:bg-primary/15',
    },
    completed: {
      label: 'Terminé',
      dotClass: 'bg-success',
      pillClass: 'bg-success/10 border-success/25 hover:bg-success/15',
    },
    archived: {
      label: 'Archivé',
      dotClass: 'bg-muted',
      pillClass: 'bg-muted/30 border-border/60 hover:bg-muted/40',
    },
  }

  const statusInfo = statusConfig[status] || statusConfig.draft

  const handleStatusToggle = () => {
    if (!onStatusChange) return
    // Simple toggle logic for the header button: Draft <-> Active
    // For other transitions, user might use the form selector.
    const newStatus = status === 'active' ? 'draft' : 'active'
    setPendingStatusChange(newStatus)
    setShowConfirmModal(true)
  }

  const confirmStatusChange = async () => {
    if (!onStatusChange || !pendingStatusChange) return
    setShowConfirmModal(false)
    setIsChangingStatus(true)
    try {
      await onStatusChange(pendingStatusChange)
    } finally {
      setIsChangingStatus(false)
      setPendingStatusChange(null)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmModal(false)
    setPendingStatusChange(null)
  }
  
  // Use avatar or first gallery image for thumbnail
  const thumbnail = projectData.avatar_image || (projectData.images && projectData.images[0])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
          {thumbnail ? (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
              <Image
                fill
                alt={projectData.name}
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
                src={thumbnail}
              />
            </div>
          ) : (
            <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
              <Folder className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2">
              {projectData.name}
            </h1>

            <div className="flex md:hidden items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border',
                  'transition-colors transition-shadow',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  statusInfo.pillClass,
                  onStatusChange &&
                    !isChangingStatus &&
                    'hover:shadow-sm motion-reduce:hover:shadow-none cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait',
                )}
                onClick={handleStatusToggle}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    'transition-transform motion-reduce:transition-none',
                    statusInfo.dotClass,
                    isChangingStatus && 'animate-pulse',
                  )}
                />
                {isChangingStatus ? 'Changement...' : statusInfo.label}
              </button>

              {projectData.featured && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3" />
                  <span>Star</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4 flex-wrap">
              <button
                type="button"
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  'transition-colors transition-shadow',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  statusInfo.pillClass,
                  onStatusChange &&
                    !isChangingStatus &&
                    'hover:shadow-sm motion-reduce:hover:shadow-none cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait',
                )}
                onClick={handleStatusToggle}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    'transition-transform motion-reduce:transition-none',
                    statusInfo.dotClass,
                    isChangingStatus && 'animate-pulse',
                  )}
                />
                {isChangingStatus ? 'Changement...' : statusInfo.label}
              </button>

              {projectData.featured && (
                <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Mis en avant
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
          <button
            type="button"
            className="flex md:hidden items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md border border-[hsl(var(--border)/0.4)] hover:border-[hsl(var(--border)/0.6)]"
            onClick={() => setShowMobileDetails(!showMobileDetails)}
          >
            <Info className="h-3 w-3" />
            {showMobileDetails ? (
              <ChevronUp className="h-3 w-3 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-3 w-3 transition-transform duration-200" />
            )}
          </button>

          <SaveStatusIndicator saveStatus={saveStatus} onSaveAll={onSaveAll} />
        </div>
      </div>

      {showMobileDetails && (
        <div className="flex md:hidden mt-3 pt-3 border-t border-[hsl(var(--border)/0.3)] animate-in slide-in-from-top-2 duration-200 ease-out">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <div className="px-2 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
              #{projectData.id}
            </div>
          </div>
        </div>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md" size="sm">
          <DialogHeader>
            <DialogTitle>
              Changer le statut du projet
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment passer ce projet en {pendingStatusChange === 'active' ? 'Actif' : 'Brouillon'} ?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 border border-border/60 rounded-xl">
              {thumbnail ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border/60 bg-background">
                  <Image
                    fill
                    alt={projectData.name}
                    className="object-cover"
                    sizes="64px"
                    src={thumbnail}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-border/60">
                  <Folder className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate text-foreground">
                  {projectData.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">ID: {projectData.id}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cancelStatusChange}>
              Annuler
            </Button>
            <Button
              variant={pendingStatusChange === 'active' ? 'default' : 'secondary'}
              onClick={confirmStatusChange}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
