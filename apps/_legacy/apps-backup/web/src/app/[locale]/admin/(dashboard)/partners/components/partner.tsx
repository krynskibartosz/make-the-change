'use client';
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, useMemo, useRef, startTransition } from 'react';

import {
  DataCard,
  DataListItem,
} from '@make-the-change/core/ui';
import { InlineToggle } from '@/components/ui/inline-toggle';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from '@make-the-change/core/shared/utils';

type PartnerUpdateInput = RouterInputs['admin']['partners']['update']['data'];
type PartnerItem = RouterOutputs['admin']['partners']['list']['items'][number];

type PartnerProps = {
  partner: PartnerItem;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    status?: 'active' | 'inactive' | 'suspended';
    country?: string;
    sortBy?: 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc';
    limit: number;
  };
  onFilterChange?: {
    setStatus: (status: string) => void;
    setCountry: (country: string) => void;
  };
};

const getPartnerStatusColor = (status: string) => {
  switch (status) {
    case 'active': {
      return 'badge-success';
    }
    case 'inactive': {
      return 'badge-muted';
    }
    case 'suspended': {
      return 'badge-warning';
    }
    default: {
      return 'badge-subtle';
    }
  }
};

const getCountryFlag = (country: string | null | undefined) => {
  if (!country) return '🌍';
  const countryFlags: Record<string, string> = {
    'Belgium': '🇧🇪',
    'France': '🇫🇷',
    'Netherlands': '🇳🇱',
    'Germany': '🇩🇪',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
  };
  return countryFlags[country] || '🌍';
};

export const Partner: FC<PartnerProps> = ({
  partner,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.partners');
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  const { coverImage, avatarImage } = useMemo(() => {
    const images = Array.isArray(partner.images) ? partner.images : [];
    const fallback = partner.cover_image || partner.logo_url || null;

    const resolvedCover = images[0] || partner.cover_image || fallback;
    const resolvedAvatar = images[1] || partner.logo_url || resolvedCover;

    return {
      coverImage: resolvedCover || null,
      avatarImage: resolvedAvatar || null,
    };
  }, [partner.images, partner.cover_image, partner.logo_url]);

  const resolveStatusLabel = (status: string) => {
    switch (status) {
      case 'active': {
        return t('filters.status_active');
      }
      case 'inactive': {
        return t('filters.status_inactive');
      }
      case 'suspended': {
        return t('filters.status_suspended');
      }
      default: {
        return status;
      }
    }
  };

  // Helper to remove focus from parent list item
  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updatePartner = trpc.admin.partners.update.useMutation({
    onMutate: async ({ id, data }) => {
      await utils.admin.partners.list.cancel();
      const previousData = utils.admin.partners.list.getData(queryParams);

      utils.admin.partners.list.setData(queryParams, old => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: PartnerItem) => {
            if (item.id === id) {
              const updated: PartnerItem = { ...item };
              if (data.status !== undefined) {
                updated.status = data.status;
              }
              return updated;
            }
            return item;
          }),
        };
      });

      return { previousData };
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousData) {
        utils.admin.partners.list.setData(queryParams, context.previousData);
      }
    },
  });

  const debouncedMutation = (data: PartnerUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    startTransition(() => {
      const currentData = utils.admin.partners.list.getData(queryParams);

      if (currentData?.items) {
        const optimisticData = {
          ...currentData,
          items: currentData.items.map((p: PartnerItem) => {
            if (p.id === partner.id) {
              const updated: PartnerItem = { ...p };
              if (data.status !== undefined) {
                updated.status = data.status;
              }
              return updated;
            }
            return p;
          }),
        };
        utils.admin.partners.list.setData(queryParams, optimisticData);
      }
    });

    pendingRequest.current = setTimeout(() => {
      updatePartner.mutate({ id: partner.id, data });
      pendingRequest.current = null;
    }, delay);
  };

  const toggleStatus = () => {
    const newStatus = partner.status === 'active' ? 'inactive' : 'active';
    startTransition(() => {
      debouncedMutation({ status: newStatus as any }, 300);
    });
  };

  const actions = (
    <div className="flex w-full items-center justify-between gap-4">
      {/* Status Toggle */}
      <div className="flex items-center gap-2">
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeFocusFromParent(e);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <InlineToggle
            checked={partner.status === 'active'}
            aria-label={
              partner.status === 'active' ? t('visibility.hide') : t('visibility.show')
            }
            onCheckedChange={() => {
              toggleStatus();
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              'flex items-center justify-center transition-colors duration-200',
              partner.status === 'active'
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {partner.status === 'active' ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              partner.status === 'active'
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {partner.status === 'active'
              ? t('visibility.visible')
              : t('visibility.hidden')}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/partners/${partner.id}`} className="!overflow-visible">
        <DataCard.Header className="pb-0 !block !overflow-visible">
          <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
            <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
              {coverImage ? (
                <Image
                  fill
                  alt={`${partner.name} cover`}
                  className="object-cover"
                  sizes="(min-width: 768px) 384px, 100vw"
                  src={coverImage}
                />
              ) : (
                <div className="bg-muted h-full w-full" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/8 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-end gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
                {avatarImage ? (
                  <Image
                    fill
                    alt={`${partner.name} avatar`}
                    className="object-cover"
                    sizes="64px"
                    src={avatarImage}
                  />
                ) : (
                  <div className="bg-primary/20 flex h-full w-full items-center justify-center">
                    <Building2 className="text-primary h-7 w-7" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DataCard.Header>
        <DataCard.Content className="relative z-10">
          <div className="pt-16 space-y-3">
            <h3 className="text-lg leading-tight font-semibold tracking-tight">
              {partner.name}
            </h3>
            {/* Contact Email */}
            {partner.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm font-mono">
                  {partner.contact_email}
                </span>
              </div>
            )}

            {/* Website */}
            {partner.website && (
              <div className="flex items-center gap-2">
                <Globe className="text-muted-foreground h-3.5 w-3.5" />
                <a
                  className="text-primary hover:text-primary/80 text-sm hover:underline"
                  href={partner.website}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  {partner.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {/* Address */}
            {partner.address_city && (
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm">
                  {partner.address_city}
                  {partner.address_country && `, ${partner.address_country}`}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Status badge cliquable */}
            {partner.status && (
              <button
                className={cn(
                  getPartnerStatusColor(partner.status),
                  'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={t('filters_tooltip.status', {
                  status: resolveStatusLabel(partner.status),
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setStatus(partner.status);
                  }
                }}
              >
                {resolveStatusLabel(partner.status)}
              </button>
            )}

            {/* Country badge cliquable */}
            {partner.address_country && (
              <button
                className="badge-accent cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.country', {
                  country: partner.address_country,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setCountry(partner.address_country);
                  }
                }}
              >
                {getCountryFlag(partner.address_country)} {partner.address_country}
              </button>
            )}
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  return (
    <DataListItem href={`/admin/partners/${partner.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            {avatarImage ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60 shadow-sm">
                <Image
                  fill
                  alt={`${partner.name} avatar`}
                  className="object-cover"
                  sizes="40px"
                  src={avatarImage}
                />
              </div>
            ) : (
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Building2 className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              {partner.name}
            </h3>

            {partner.slug && (
              <span className="text-muted-foreground/80 font-mono text-xs tracking-wider uppercase">
                {partner.slug}
              </span>
            )}
          </div>
        </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-3">
          {/* Métriques principales */}
          <div className="flex items-center gap-6">
            {partner.contact_email && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded">
                  <Mail className="text-primary h-3 w-3" />
                </div>
                <span className="text-foreground text-sm font-mono">
                  {partner.contact_email}
                </span>
              </div>
            )}

            {partner.address_city && (
              <div className="flex items-center gap-2">
                <div className="bg-muted/40 flex h-5 w-5 items-center justify-center rounded">
                  <MapPin className="text-muted-foreground h-3 w-3" />
                </div>
                <span className="text-foreground text-sm">
                  {partner.address_city}
                  {partner.address_country && `, ${partner.address_country}`}
                </span>
              </div>
            )}

            {partner.website && (
              <div className="flex items-center gap-2">
                <Globe className="text-muted-foreground h-4 w-4" />
                <a
                  className="text-primary hover:text-primary/80 max-w-[200px] truncate text-sm hover:underline"
                  href={partner.website}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={e => {
                    e.stopPropagation();
                    removeFocusFromParent(e);
                  }}
                >
                  {partner.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

          {/* Badges cliquables */}
          <div className="flex flex-wrap gap-2">
            {partner.status && (
              <button
                className={cn(
                  getPartnerStatusColor(partner.status),
                  'pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={t('filters_tooltip.status', {
                  status: resolveStatusLabel(partner.status),
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setStatus(partner.status);
                  }
                }}
              >
                {resolveStatusLabel(partner.status)}
              </button>
            )}
            {partner.address_country && (
              <button
                className="badge-accent pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.country', {
                  country: partner.address_country,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setCountry(partner.address_country);
                  }
                }}
              >
                {getCountryFlag(partner.address_country)} {partner.address_country}
              </button>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
