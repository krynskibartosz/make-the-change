'use client';

import { ChevronRight, FileText } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

interface BlogPostCoverSectionProps {
  postId: string;
  postTitle: string;
  coverImageUrl?: string | null;
  autoSave: AutoSaveReturn;
}

/**
 * Cover Section with Breadcrumb Overlay
 *
 * Features:
 * - Full-width cover image or placeholder
 * - Breadcrumb navigation overlay
 * - Smooth scrolling with content
 */
export function BlogPostCoverSection({
  postId,
  postTitle,
  coverImageUrl,
  autoSave,
}: BlogPostCoverSectionProps) {
  return (
    <div className="relative h-64 w-full overflow-hidden">
      {/* Background Image or Gradient */}
      {coverImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        >
          <div className="bg-gradient-to-b from-black/40 via-black/20 to-black/60 absolute inset-0" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-accent/20 via-primary/10 to-success/20 absolute inset-0">
          <div className="bg-gradient-to-b from-black/20 via-transparent to-black/40 absolute inset-0" />
        </div>
      )}

      {/* Breadcrumb Overlay */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-8">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <LocalizedLink
              className="hover:text-white transition-colors"
              href="/admin"
            >
              Admin
            </LocalizedLink>
            <ChevronRight className="h-4 w-4 text-white/60" />
            <LocalizedLink
              className="hover:text-white transition-colors"
              href="/admin/blog"
            >
              Blog
            </LocalizedLink>
            <ChevronRight className="h-4 w-4 text-white/60" />
            <span className="flex items-center gap-2 font-medium text-white">
              <FileText className="h-4 w-4" />
              {postTitle || 'Article'}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image Icon Overlay (when no image) */}
      {!coverImageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="h-24 w-24 text-white/20" />
        </div>
      )}
    </div>
  );
}
