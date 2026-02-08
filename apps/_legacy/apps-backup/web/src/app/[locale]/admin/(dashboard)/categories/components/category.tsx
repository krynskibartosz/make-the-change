'use client';
import {
  Folder,
  Eye,
  EyeOff,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, startTransition } from 'react';

import {
  DataCard,
  DataListItem,
} from '@make-the-change/core/ui';
import { InlineToggle } from '@/components/ui/inline-toggle';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from '@make-the-change/core/shared/utils';

type CategoryUpdateInput = RouterInputs['admin']['categories']['update']['patch'];
type CategoryItem = RouterOutputs['admin']['categories']['list'][number];

type CategoryProps = {
  category: CategoryItem;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    parentId?: string;
    limit: number;
  };
  onFilterChange?: {
    setParent: (parentId: string) => void;
  };
};

export const Category: FC<CategoryProps> = ({
  category,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.categories');
  const utils = trpc.useUtils();

  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updateCategory = trpc.admin.categories.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.categories.list.cancel();
      const previousData = utils.admin.categories.list.getData(queryParams);

      utils.admin.categories.list.setData(queryParams, old => {
        if (!old) return old;

        return old.map((item: CategoryItem) => {
          if (item.id === id) {
            const updated: CategoryItem = { ...item };
            if (patch.is_active !== undefined) {
              updated.is_active = patch.is_active;
            }
            if (patch.sort_order !== undefined) {
              updated.sort_order = patch.sort_order;
            }
            return updated;
          }
          return item;
        });
      });

      return { previousData };
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousData) {
        utils.admin.categories.list.setData(queryParams, context.previousData);
      }
    },
  });

  const toggleActive = () => {
    const newActive = !category.is_active;
    startTransition(() => {
      updateCategory.mutate({
        id: category.id,
        patch: { is_active: newActive },
      });
    });
  };

  const actions = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-background dark:bg-card border-border dark:border-border group inline-flex items-center overflow-hidden rounded-xl border shadow-sm dark:shadow-black/10">
          <div className="border-border dark:border-border bg-muted/30 dark:bg-muted/20 relative min-w-[4rem] px-4 py-2 text-center">
            <span className="text-foreground dark:text-foreground text-sm font-semibold tabular-nums">
              {category.sort_order || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeFocusFromParent(e);
          }}
        >
          <InlineToggle
            aria-label={
              category.is_active ? t('visibility.hide') : t('visibility.show')
            }
            checked={category.is_active ?? false}
            onCheckedChange={() => {
              toggleActive();
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              'flex items-center justify-center transition-colors duration-200',
              category.is_active
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {category.is_active ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              category.is_active
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {category.is_active
              ? t('visibility.visible')
              : t('visibility.hidden')}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/categories/${category.id}`}>
        <DataCard.Header>
          <DataCard.Title
            icon={category.parent_id ? Tag : Folder}
            image={category.image_url}
            imageAlt={category.name}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg leading-tight font-semibold tracking-tight">
                {category.name}
              </span>
              {category.slug && (
                <span className="text-muted-foreground/80 text-xs leading-relaxed font-medium">
                  {category.slug}
                </span>
              )}
            </div>
          </DataCard.Title>
        </DataCard.Header>
        <DataCard.Content>
          <div className="space-y-3">
            {category.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {category.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {category.parent_id ? (
                <span className="badge-subtle">
                  Sous-catégorie
                </span>
              ) : (
                <span className="badge-accent">
                  Catégorie principale
                </span>
              )}
            </div>
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  return (
    <DataListItem href={`/admin/categories/${category.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-lg">
              {category.parent_id ? (
                <Tag className="text-primary h-6 w-6" />
              ) : (
                <Folder className="text-accent h-6 w-6" />
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              {category.name}
            </h3>

            <span className="text-muted-foreground/80 font-mono text-xs tracking-wider uppercase">
              {category.slug}
            </span>
          </div>
        </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-3">
          {category.description && (
            <p className="text-muted-foreground text-sm">
              {category.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {category.parent_id ? (
              <span className="badge-subtle">
                Sous-catégorie
              </span>
            ) : (
              <span className="badge-accent">
                Catégorie principale
              </span>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
