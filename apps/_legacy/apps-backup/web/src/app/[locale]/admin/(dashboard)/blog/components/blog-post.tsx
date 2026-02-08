'use client';

import {
  Eye,
  Calendar,
  User,
  Folder,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LocalizedLink } from '@/components/localized-link';
import { trpc } from '@/lib/trpc';
import type { ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  view_count: number;
  created_at: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface BlogPostProps {
  post: BlogPost;
  view: ViewMode;
  queryParams: any;
}

function getStatusBadgeClass(status: BlogPost['status']) {
  switch (status) {
    case 'published':
      return 'badge-success';
    case 'draft':
      return 'badge-warning';
    case 'archived':
      return 'badge-muted';
    default:
      return 'badge-subtle';
  }
}

function getStatusLabel(status: BlogPost['status']) {
  switch (status) {
    case 'published':
      return 'Publié';
    case 'draft':
      return 'Brouillon';
    case 'archived':
      return 'Archivé';
    default:
      return status;
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) return 'Non publié';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BlogPost({ post, view, queryParams }: BlogPostProps) {
  const t = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const deleteMutation = trpc.admin.blogPosts.delete.useMutation({
    onSuccess: () => {
      toast({ 
        variant: 'success', 
        title: 'Article supprimé', 
        description: 'L\'article a été supprimé avec succès' 
      });
      void utils.admin.blogPosts.listPaginated.invalidate();
    },
    onError: (error) => {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur de suppression', 
        description: error.message 
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setIsDeleting(true);
      deleteMutation.mutate({ id: post.id });
    }
  };

  if (view === 'list') {
    return (
      <div className="bg-surface-2 border-border-subtle hover:border-accent/50 group flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
        {/* Thumbnail */}
        <LocalizedLink
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md"
          href={`/admin/blog/${post.id}`}
        >
          {post.cover_image_url ? (
            <img
              alt={post.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              src={post.cover_image_url}
            />
          ) : (
            <div className="bg-surface-3 flex h-full w-full items-center justify-center">
              <Folder className="text-muted-foreground h-8 w-8" />
            </div>
          )}
        </LocalizedLink>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={getStatusBadgeClass(post.status)}>
              {getStatusLabel(post.status)}
            </span>
            <LocalizedLink href={`/admin/blog/${post.id}`}>
              <h3 className="text-text-primary hover:text-accent line-clamp-1 font-semibold transition-colors">
                {post.title}
              </h3>
            </LocalizedLink>
          </div>
          {post.excerpt && (
            <p className="text-text-secondary line-clamp-1 text-sm">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{post.author.name}</span>
              </div>
            )}
            {post.category && (
              <div className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                <span>{post.category.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <LocalizedLink href={`/admin/blog/${post.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </LocalizedLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/blog/${post.slug}`} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir l'article
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-surface-2 border-border-subtle hover:border-accent/50 group relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-glow-sm">
      {/* Cover Image */}
      <LocalizedLink
        className="relative h-48 overflow-hidden"
        href={`/admin/blog/${post.id}`}
      >
        {post.cover_image_url ? (
          <img
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            src={post.cover_image_url}
          />
        ) : (
          <div className="bg-surface-3 flex h-full w-full items-center justify-center">
            <Folder className="text-muted-foreground h-16 w-16" />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <span className={getStatusBadgeClass(post.status)}>
            {getStatusLabel(post.status)}
          </span>
        </div>
      </LocalizedLink>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <LocalizedLink href={`/admin/blog/${post.id}`}>
          <h3 className="text-text-primary hover:text-accent line-clamp-2 text-lg font-semibold transition-colors">
            {post.title}
          </h3>
        </LocalizedLink>

        {post.excerpt && (
          <p className="text-text-secondary line-clamp-3 flex-1 text-sm">{post.excerpt}</p>
        )}

        {/* Footer */}
        <div className="border-border-subtle space-y-2 border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-1">
                {post.author.avatar_url ? (
                  <img
                    alt={post.author.name}
                    className="h-6 w-6 rounded-full object-cover"
                    src={post.author.avatar_url}
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {post.category && (
              <div className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                <span>{post.category.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Menu - Positioned absolutely */}
      <div className="absolute right-3 top-52">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-surface-1/90 shadow-lg backdrop-blur-sm"
              size="sm"
              variant="ghost"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <LocalizedLink href={`/admin/blog/${post.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </LocalizedLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/blog/${post.slug}`} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir l'article
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
