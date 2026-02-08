'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import { cn } from '@make-the-change/core/shared/utils';

interface BlogPostEditHeaderProps {
  autoSave: AutoSaveReturn;
  hasUnsavedChanges: boolean;
}

/**
 * Header for blog post edit page
 * Shows save status and back button
 */
export function BlogPostEditHeader({
  autoSave,
  hasUnsavedChanges,
}: BlogPostEditHeaderProps) {
  const router = useRouter();

  const getStatusContent = () => {
    switch (autoSave.status) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-sm text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sauvegarde en cours...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-sm text-success">
            <Check className="h-4 w-4" />
            <span>Sauvegardé</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Erreur de sauvegarde</span>
          </div>
        );
      case 'pending':
        return (
          <div className="text-text-secondary text-sm">
            Modifications en attente...
          </div>
        );
      default:
        return hasUnsavedChanges ? (
          <div className="text-text-secondary text-sm">Non sauvegardé</div>
        ) : (
          <div className="text-muted-foreground text-sm">Aucune modification</div>
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
      <Button
        icon={<ArrowLeft />}
        size="sm"
        variant="ghost"
        onClick={() => router.back()}
      >
        Retour
      </Button>

      <div
        className={cn(
          'transition-opacity duration-300',
          autoSave.status === 'idle' && !hasUnsavedChanges && 'opacity-50'
        )}
      >
        {getStatusContent()}
      </div>
    </div>
  );
}
