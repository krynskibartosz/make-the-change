'use client';
import {
  Bug,
  FileText,
  Image as ImageIcon,
  Pencil,
  Trash,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { type FC, useCallback, useState } from 'react';

import {
  DataCard,
  DataListItem,
} from '@make-the-change/core/ui';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from '@make-the-change/core/shared/utils';

type SpeciesItem = RouterOutputs['admin']['species']['list']['items'][number];
type QueryParams = RouterInputs['admin']['species']['list'];

type SpeciesProps = {
  species: SpeciesItem;
  view: 'grid' | 'list';
  queryParams: QueryParams;
};

export const Species: FC<SpeciesProps> = ({ species, view, queryParams }) => {
  const t = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const utils = trpc.useContext();
  const deleteSpecies = trpc.admin.species.delete.useMutation({
    onSuccess: () => {
      utils.admin.species.list.invalidate(queryParams);
    },
  });

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteSpecies.mutateAsync({ id: species.id });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteSpecies, species.id]);

  if (view === 'grid') {
    return (
      <DataCard href={`/admin/biodex/${species.id}`}>
        <DataCard.Header className="pb-0 !block !overflow-visible">
          <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
            {/* Cover image */}
            {species.image_url ? (
              <Image
                alt={species.name}
                className="h-32 w-full object-cover rounded-t-xl"
                height={128}
                src={species.image_url}
                width={384}
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-t-xl bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* Icon */}
            <div className="absolute -bottom-4 left-4">
              {species.icon_url ? (
                <Image
                  alt={`${species.name} icon`}
                  className="h-16 w-16 rounded-full border-2 border-background bg-background object-cover"
                  height={64}
                  src={species.icon_url}
                  width={64}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-background bg-background">
                  <Bug className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start pt-2">
            <div className="space-y-1 pl-20">
              <h3 className="font-semibold leading-none">{species.name}</h3>
              {species.scientific_name && (
                <p className="text-muted-foreground text-sm">
                  {species.scientific_name}
                </p>
              )}
            </div>
          </div>
        </DataCard.Header>

        <DataCard.Content>
          <div className="pt-16 space-y-3">
            <h3 className="text-lg leading-tight font-semibold tracking-tight">
              {species.name}
            </h3>
            {species.scientific_name && (
              <p className="text-muted-foreground text-sm italic">
                {species.scientific_name}
              </p>
            )}
            
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {species.description || t('admin.biodex.species.no_description')}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {Object.keys(species.content_levels || {}).length}{' '}
                  {t('admin.biodex.species.content_levels')}
                </span>
              </div>
            </div>
          </div>
        </DataCard.Content>
      </DataCard>
    );
  }

  return (
    <DataListItem href={`/admin/biodex/${species.id}`}>
      <DataListItem.Header>
        {/* Icon */}
        {species.icon_url ? (
          <Image
            alt={species.name}
            className="h-12 w-12 rounded-full object-cover"
            height={48}
            src={species.icon_url}
            width={48}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Bug className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">{species.name}</span>
            {species.scientific_name && (
              <span className="text-muted-foreground text-sm">
                {species.scientific_name}
              </span>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {species.description || t('admin.biodex.species.no_description')}
          </p>
        </div>
      </DataListItem.Header>
      
      <DataListItem.Actions>
        <LocalizedLink
          href={`/admin/biodex/${species.id}/edit`}
          className={cn(
            'text-muted-foreground hover:text-foreground',
            'transition-colors'
          )}
        >
          <Button size="icon" variant="ghost">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">
              {t('admin.biodex.species.actions.edit')}
            </span>
          </Button>
        </LocalizedLink>

        <Button
          disabled={isDeleting}
          onClick={handleDelete}
          size="icon"
          variant="ghost"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">
            {t('admin.biodex.species.actions.delete')}
          </span>
        </Button>
      </DataListItem.Actions>
    </DataListItem>
  );
};