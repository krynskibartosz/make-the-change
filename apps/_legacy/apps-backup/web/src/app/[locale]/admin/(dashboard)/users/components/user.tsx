'use client';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
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

type UserUpdateInput = RouterInputs['admin']['users']['update']['patch'];
type UserItem = RouterOutputs['admin']['users']['list']['items'][number];

type UserProps = {
  user: UserItem;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    q?: string;
    role?: string;
    is_active?: boolean;
    sortBy?: 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc';
    limit: number;
  };
  onFilterChange?: {
    setRole: (role: string) => void;
    setStatus: (status: string) => void;
  };
};

const getUserStatusColor = (isActive: boolean) => {
  return isActive ? 'badge-success' : 'badge-muted';
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': {
      return 'badge-warning';
    }
    case 'user': {
      return 'badge-accent';
    }
    default: {
      return 'badge-subtle';
    }
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': {
      return 'Admin';
    }
    case 'user': {
      return 'Utilisateur';
    }
    case 'explorateur': {
      return 'Explorateur';
    }
    case 'protecteur': {
      return 'Protecteur';
    }
    case 'ambassadeur': {
      return 'Ambassadeur';
    }
    default: {
      return role;
    }
  }
};

const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const User: FC<UserProps> = ({
  user,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.users');
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  const avatarUrl = useMemo(() => {
    return user.avatar_url || user.images?.[1] || null;
  }, [user.avatar_url, user.images]);

  const coverImage = useMemo(() => {
    return user.images?.[0] ?? null;
  }, [user.images]);

  const resolveStatusLabel = (isActive: boolean) => {
    return isActive ? t('filters.status_active') : t('filters.status_inactive');
  };

  // Helper to remove focus from parent list item
  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updateUser = trpc.admin.users.update.useMutation({
    onMutate: async ({ userId, patch }) => {
      await utils.admin.users.list.cancel();
      const previousData = utils.admin.users.list.getData(queryParams);

      utils.admin.users.list.setData(queryParams, old => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: UserItem) => {
            if (item.id === userId) {
              const updated: UserItem = { ...item };
              // Update is_active based on kyc_status
              if (patch.kyc_status !== undefined) {
                updated.is_active = patch.kyc_status === 'verified' || patch.kyc_status === 'pending';
              }
              if (patch.user_level !== undefined) {
                updated.role = patch.user_level;
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
        utils.admin.users.list.setData(queryParams, context.previousData);
      }
    },
  });

  const debouncedMutation = (patch: UserUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    startTransition(() => {
      const currentData = utils.admin.users.list.getData(queryParams);

      if (currentData?.items) {
        const optimisticData = {
          ...currentData,
          items: currentData.items.map((u: UserItem) => {
            if (u.id === user.id) {
              const updated: UserItem = { ...u };
              // Update is_active based on kyc_status
              if (patch.kyc_status !== undefined) {
                updated.is_active = patch.kyc_status === 'verified' || patch.kyc_status === 'pending';
              }
              if (patch.user_level !== undefined) {
                updated.role = patch.user_level;
              }
              return updated;
            }
            return u;
          }),
        };
        utils.admin.users.list.setData(queryParams, optimisticData);
      }
    });

    pendingRequest.current = setTimeout(() => {
      updateUser.mutate({ userId: user.id, patch });
      pendingRequest.current = null;
    }, delay);
  };

  const toggleStatus = () => {
    // Toggle between 'verified' (active) and 'rejected' (inactive)
    const newKycStatus = user.is_active ? 'rejected' : 'verified';
    startTransition(() => {
      debouncedMutation({ kyc_status: newKycStatus as any }, 300);
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
            checked={user.is_active}
            aria-label={
              user.is_active ? t('visibility.hide') : t('visibility.show')
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
              user.is_active
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {user.is_active ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              user.is_active
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {user.is_active
              ? t('visibility.visible')
              : t('visibility.hidden')}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/users/${user.id}`} className="!overflow-visible">
        <DataCard.Header className="pb-0 !block !overflow-visible">
          <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
            <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
              {coverImage ? (
                <>
                  <Image
                    fill
                    alt={`${user.name} cover`}
                    className="object-cover"
                    sizes="400px"
                    src={coverImage}
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
              )}
            </div>

            <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-end gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
                {avatarUrl ? (
                  <Image
                    fill
                    alt={`${user.name} avatar`}
                    className="object-cover"
                    sizes="64px"
                    src={avatarUrl}
                  />
                ) : (
                  <div className="bg-primary/20 flex h-full w-full items-center justify-center">
                    <UserIcon className="text-primary h-7 w-7" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DataCard.Header>
        <DataCard.Content className="relative z-10">
          <div className="pt-16 space-y-3">
            <h3 className="text-lg leading-tight font-semibold tracking-tight">
              {user.name}
            </h3>
            {/* Email */}
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm font-mono">
                  {user.email}
                </span>
              </div>
            )}

            {/* Role */}
            {user.role && (
              <div className="flex items-center gap-2">
                <Shield className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            )}

            {/* Created at */}
            {user.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm">
                  {formatDate(user.created_at)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Status badge cliquable */}
            <button
              className={cn(
                getUserStatusColor(user.is_active),
                'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
              )}
              title={t('filters_tooltip.status', {
                status: resolveStatusLabel(user.is_active),
              })}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange) {
                  onFilterChange.setStatus(user.is_active ? 'active' : 'inactive');
                }
              }}
            >
              {resolveStatusLabel(user.is_active)}
            </button>

            {/* Role badge cliquable */}
            {user.role && (
              <button
                className={cn(
                  getRoleColor(user.role),
                  'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={t('filters_tooltip.role', {
                  role: getRoleLabel(user.role),
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setRole(user.role);
                  }
                }}
              >
                {getRoleLabel(user.role)}
              </button>
            )}
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  return (
    <DataListItem href={`/admin/users/${user.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60 shadow-sm">
                <Image
                  fill
                  alt={`${user.name} avatar`}
                  className="object-cover"
                  sizes="40px"
                  src={avatarUrl}
                />
              </div>
            ) : (
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              {user.name}
            </h3>
          </div>
        </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-3">
          {/* Métriques principales */}
          <div className="flex items-center gap-6">
            {user.email && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded">
                  <Mail className="text-primary h-3 w-3" />
                </div>
                <span className="text-foreground text-sm font-mono">
                  {user.email}
                </span>
              </div>
            )}

            {user.role && (
              <div className="flex items-center gap-2">
                <div className="bg-muted/40 flex h-5 w-5 items-center justify-center rounded">
                  <Shield className="text-muted-foreground h-3 w-3" />
                </div>
                <span className="text-foreground text-sm">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            )}

            {user.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-foreground text-sm">
                  {formatDate(user.created_at)}
                </span>
              </div>
            )}
          </div>

          {/* Badges cliquables */}
          <div className="flex flex-wrap gap-2">
            <button
              className={cn(
                getUserStatusColor(user.is_active),
                'pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
              )}
              title={t('filters_tooltip.status', {
                status: resolveStatusLabel(user.is_active),
              })}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                removeFocusFromParent(e);
                if (onFilterChange) {
                  onFilterChange.setStatus(user.is_active ? 'active' : 'inactive');
                }
              }}
            >
              {resolveStatusLabel(user.is_active)}
            </button>
            {user.role && (
              <button
                className={cn(
                  getRoleColor(user.role),
                  'pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={t('filters_tooltip.role', {
                  role: getRoleLabel(user.role),
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setRole(user.role);
                  }
                }}
              >
                {getRoleLabel(user.role)}
              </button>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
