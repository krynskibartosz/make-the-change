'use client';

import { Info, Calendar, Eye } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { RawBlogPostData } from '../types/blog-post-form.types';

interface MetadataSectionProps {
  post: RawBlogPostData;
}

/**
 * Metadata Section - Read-only metadata display
 *
 * Shows:
 * - Created date
 * - Updated date
 * - View count
 */
export function MetadataSection({ post }: MetadataSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DetailView.Section icon={Info} title="Métadonnées">
      <div className="space-y-4">
        {/* Created At */}
        <div className="flex items-start gap-3">
          <div className="bg-surface-3 rounded-lg p-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium">Date de création</p>
            <p className="text-text-primary mt-1 text-sm">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Updated At */}
        <div className="flex items-start gap-3">
          <div className="bg-surface-3 rounded-lg p-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium">
              Dernière modification
            </p>
            <p className="text-text-primary mt-1 text-sm">{formatDate(post.updated_at)}</p>
          </div>
        </div>

        {/* View Count */}
        <div className="flex items-start gap-3">
          <div className="bg-surface-3 rounded-lg p-2">
            <Eye className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium">Nombre de vues</p>
            <p className="text-text-primary mt-1 text-sm">
              {post.view_count.toLocaleString('fr-FR')} {post.view_count === 1 ? 'vue' : 'vues'}
            </p>
          </div>
        </div>

        {/* ID */}
        <div className="bg-surface-3 border-border-subtle rounded-lg border p-3">
          <p className="text-text-secondary mb-1 text-xs font-medium">ID de l'article</p>
          <code className="text-text-primary text-xs font-mono">{post.id}</code>
        </div>
      </div>
    </DetailView.Section>
  );
}
