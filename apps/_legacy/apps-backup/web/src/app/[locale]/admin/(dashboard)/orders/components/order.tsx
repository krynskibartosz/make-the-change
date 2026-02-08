'use client';

import {
  ShoppingCart,
  User,
  Calendar,
  DollarSign,
  Package,
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

type OrderUpdateInput = RouterInputs['admin']['orders']['update']['patch'];
type OrderItem = RouterOutputs['admin']['orders']['list']['items'][number];

type OrderProps = {
  order: OrderItem;
  view: 'grid' | 'list';
  queryParams: {
    search?: string;
    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    sortBy?: 'created_at_desc' | 'created_at_asc' | 'total_points_desc' | 'total_points_asc';
    limit: number;
    page: number;
  };
  onFilterChange?: {
    setStatus: (status: string) => void;
  };
};

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': {
      return 'badge-success';
    }
    case 'shipped': {
      return 'badge-info';
    }
    case 'processing': {
      return 'badge-warning';
    }
    case 'pending': {
      return 'badge-muted';
    }
    case 'cancelled':
    case 'refunded': {
      return 'badge-destructive';
    }
    default: {
      return 'badge-subtle';
    }
  }
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '0.00 €';
  return `${amount.toFixed(2)} €`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const Order: FC<OrderProps> = ({
  order,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.orders');
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  // Pour les commandes, on utilise un gradient coloré comme cover
  // et l'icône de panier comme avatar
  const { coverGradient, avatarContent } = useMemo(() => {
    // Gradient basé sur le statut de la commande
    const gradients: Record<string, string> = {
      delivered: 'from-green-500/20 to-emerald-500/40',
      shipped: 'from-blue-500/20 to-cyan-500/40',
      processing: 'from-orange-500/20 to-amber-500/40',
      pending: 'from-gray-500/20 to-slate-500/40',
      cancelled: 'from-red-500/20 to-rose-500/40',
      refunded: 'from-purple-500/20 to-violet-500/40',
    };

    return {
      coverGradient: gradients[order.status] || gradients.pending,
      avatarContent: (
        <div className="bg-primary/20 flex h-full w-full items-center justify-center">
          <ShoppingCart className="text-primary h-7 w-7" />
        </div>
      ),
    };
  }, [order.status]);

  const resolveStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      case 'refunded':
        return 'Remboursée';
      default:
        return status;
    }
  };

  // Helper to remove focus from parent list item
  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updateOrder = trpc.admin.orders.update.useMutation({
    onMutate: async ({ orderId, patch }) => {
      await utils.admin.orders.list.cancel();
      const previousData = utils.admin.orders.list.getData(queryParams);

      utils.admin.orders.list.setData(queryParams, old => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: OrderItem) => {
            if (item.id === orderId) {
              const updated: OrderItem = { ...item };
              if (patch.status !== undefined) {
                updated.status = patch.status;
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
        utils.admin.orders.list.setData(queryParams, context.previousData);
      }
    },
  });

  const debouncedMutation = (patch: OrderUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    startTransition(() => {
      const currentData = utils.admin.orders.list.getData(queryParams);

      if (currentData?.items) {
        const optimisticData = {
          ...currentData,
          items: currentData.items.map((o: OrderItem) => {
            if (o.id === order.id) {
              const updated: OrderItem = { ...o };
              if (patch.status !== undefined) {
                updated.status = patch.status;
              }
              return updated;
            }
            return o;
          }),
        };
        utils.admin.orders.list.setData(queryParams, optimisticData);
      }
    });

    pendingRequest.current = setTimeout(() => {
      updateOrder.mutate({ orderId: order.id, patch });
      pendingRequest.current = null;
    }, delay);
  };

  const toggleVisibility = () => {
    const newStatus =
      order.status === 'cancelled' || order.status === 'refunded'
        ? 'pending'
        : 'cancelled';
    startTransition(() => {
      debouncedMutation({ status: newStatus as any }, 300);
    });
  };

  const isVisible =
    order.status !== 'cancelled' && order.status !== 'refunded';

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
            checked={isVisible}
            aria-label={isVisible ? 'Annuler' : 'Activer'}
            onCheckedChange={() => {
              toggleVisibility();
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              'flex items-center justify-center transition-colors duration-200',
              isVisible
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {isVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              isVisible
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {isVisible ? 'Active' : 'Annulée'}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/orders/${order.id}`} className="!overflow-visible">
        <DataCard.Header className="pb-0 !block !overflow-visible">
          <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
            {/* Cover avec gradient basé sur le statut */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
              <div
                className={cn(
                  'bg-gradient-to-br h-full w-full',
                  coverGradient
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/8 to-transparent" />

              {/* Numéro de commande en overlay */}
              <div className="absolute top-4 right-4">
                <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border/60 shadow-sm">
                  <span className="text-xs font-mono font-medium">
                    #{order.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>

            {/* Avatar avec icône de panier */}
            <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-end gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
                {avatarContent}
              </div>
            </div>
          </div>
        </DataCard.Header>

        <DataCard.Content className="relative z-10">
          <div className="pt-16 space-y-3">
            <h3 className="text-lg leading-tight font-semibold tracking-tight">
              Commande #{order.id.slice(0, 8)}
            </h3>

            {/* Client */}
            {order.customerName && (
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm">
                  {order.customerName}
                </span>
              </div>
            )}

            {/* Date */}
            {order.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-sm">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            )}

            {/* Montant */}
            <div className="flex items-center gap-2">
              <DollarSign className="text-success h-3.5 w-3.5" />
              <span className="text-success text-sm font-semibold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Status badge cliquable */}
            {order.status && (
              <button
                className={cn(
                  getOrderStatusColor(order.status),
                  'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={`Filtrer par statut: ${resolveStatusLabel(order.status)}`}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setStatus(order.status);
                  }
                }}
              >
                {resolveStatusLabel(order.status)}
              </button>
            )}
          </div>
        </DataCard.Content>

        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  // List view
  return (
    <DataListItem href={`/admin/orders/${order.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              Commande #{order.id.slice(0, 8)}
            </h3>

            <span className="text-muted-foreground/80 font-mono text-xs tracking-wider uppercase">
              {order.id.slice(0, 8)}
            </span>
          </div>
        </div>
      </DataListItem.Header>

      <DataListItem.Content>
        <div className="space-y-3">
          {/* Métriques principales */}
          <div className="flex items-center gap-6">
            {order.customerName && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded">
                  <User className="text-primary h-3 w-3" />
                </div>
                <span className="text-foreground text-sm">
                  {order.customerName}
                </span>
              </div>
            )}

            {order.createdAt && (
              <div className="flex items-center gap-2">
                <div className="bg-muted/40 flex h-5 w-5 items-center justify-center rounded">
                  <Calendar className="text-muted-foreground h-3 w-3" />
                </div>
                <span className="text-foreground text-sm">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <DollarSign className="text-success h-4 w-4" />
              <span className="text-success text-sm font-semibold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Badges cliquables */}
          <div className="flex flex-wrap gap-2">
            {order.status && (
              <button
                className={cn(
                  getOrderStatusColor(order.status),
                  'pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                title={`Filtrer par statut: ${resolveStatusLabel(order.status)}`}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setStatus(order.status);
                  }
                }}
              >
                {resolveStatusLabel(order.status)}
              </button>
            )}
          </div>
        </div>
      </DataListItem.Content>

      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
