'use client';

import { memo, useEffect, useState } from 'react';
import {
  Filter,
  Search,
  ChevronLeft,
  X,
  Sparkles,
  Leaf,
  Grape,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { Input } from '@/components/ui/input';
import { cn } from '@make-the-change/core/shared/utils';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import type { ReactNode } from 'react';

export type LegendFilterType = 'all' | 'beehive' | 'olive_tree' | 'vineyard';

export type MapFilterSelectConfig = {
  name: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
  disabled?: boolean;
};

type MapFilterPanelProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  filterCount: number;

  search: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };

  statusSelect: MapFilterSelectConfig;
  typeSelect: MapFilterSelectConfig;
  partnerSelect: MapFilterSelectConfig;
  countrySelect: MapFilterSelectConfig;
  sortSelect: MapFilterSelectConfig;
  impactTypeSelect: Omit<MapFilterSelectConfig, 'value'> & { value?: string };

  selectedImpactTypes: string[];
  onImpactTypeRemove: (value: string) => void;

  activeOnly: {
    value: boolean;
    onChange: (value: boolean) => void;
    label: string;
    disabled?: boolean;
  };

  hasActiveFilters: boolean;
  onClearFilters: () => void;

  legend: {
    label: string;
    description?: string;
    active: LegendFilterType;
    onSelect: (value: LegendFilterType) => void;
    counts: Record<'beehive' | 'olive_tree' | 'vineyard', number>;
  };

  projectCount: number;
  projectLabel: (count: number) => string;
  tagsLabel: string;
};

const formatImpactTypeLabel = (value: string) =>
  value
    .split(/[_-]/g)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const legendConfig: Record<
  Exclude<LegendFilterType, 'all'>,
  { label: string; description: string; color: string; icon: ReactNode }
> = {
  beehive: {
    label: 'Ruches',
    description: 'Apiculture & pollinisation',
    color:
      'bg-[linear-gradient(120deg,#fbbf24,#f59e0b)] text-white shadow-[0_8px_18px_-10px_rgba(245,158,11,0.8)]',
    icon: <Sparkles className="h-4 w-4" />,
  },
  olive_tree: {
    label: 'Oliviers',
    description: 'Agriculture régénérative',
    color:
      'bg-[linear-gradient(120deg,#34d399,#059669)] text-white shadow-[0_8px_18px_-10px_rgba(5,150,105,0.6)]',
    icon: <Leaf className="h-4 w-4" />,
  },
  vineyard: {
    label: 'Vignes',
    description: 'Viticulture durable',
    color:
      'bg-[linear-gradient(120deg,#a855f7,#7c3aed)] text-white shadow-[0_8px_18px_-10px_rgba(124,58,237,0.6)]',
    icon: <Grape className="h-4 w-4" />,
  },
};

const CollapsedTrigger = ({
  onToggle,
  filterCount,
}: {
  onToggle: () => void;
  filterCount: number;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      'glass-card floating group flex items-center gap-2 rounded-2xl border border-white/40',
      'bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_18px_35px_-18px_rgba(30,64,175,0.35)]',
      'backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-[0_22px_40px_-16px_rgba(37,99,235,0.35)]'
    )}
  >
    <Filter className="h-4 w-4 text-primary" />
    <span>Filtres</span>
    {filterCount > 0 && (
      <span className="bg-primary/10 text-primary ring-primary/40 group-hover:bg-primary/15 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold ring-2">
        {filterCount}
      </span>
    )}
  </button>
);

const MapFilterPanelComponent = ({
  collapsed,
  onToggleCollapse,
  filterCount,
  search,
  statusSelect,
  typeSelect,
  partnerSelect,
  countrySelect,
  sortSelect,
  impactTypeSelect,
  selectedImpactTypes,
  onImpactTypeRemove,
  activeOnly,
  hasActiveFilters,
  onClearFilters,
  legend,
  projectCount,
  projectLabel,
  tagsLabel,
}: MapFilterPanelProps) => {
  const { placeholder: searchPlaceholder, value: searchValue, onChange: searchOnChange } = search;
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebouncedValue(localSearch, 400);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (debouncedSearch === searchValue) return;
    searchOnChange(debouncedSearch);
  }, [debouncedSearch, searchOnChange, searchValue]);

  if (collapsed) {
    return <CollapsedTrigger onToggle={onToggleCollapse} filterCount={filterCount} />;
  }

  const legendItems: Array<{
    key: LegendFilterType;
    label: string;
    description?: string;
    color?: string;
    icon?: ReactNode;
    count?: number;
  }> = [
    {
      key: 'all',
      label: 'Tous les projets',
      description: `${legend.counts.beehive + legend.counts.olive_tree + legend.counts.vineyard} au total`,
      color:
        'bg-[linear-gradient(120deg,var(--brand-primary-start),var(--brand-primary-end))] text-white shadow-[0_12px_32px_-16px_rgba(59,130,246,0.35)]',
      icon: <SlidersHorizontal className="h-4 w-4" />,
    },
    {
      key: 'beehive',
      label: legendConfig.beehive.label,
      description: legendConfig.beehive.description,
      color: legendConfig.beehive.color,
      icon: legendConfig.beehive.icon,
      count: legend.counts.beehive,
    },
    {
      key: 'olive_tree',
      label: legendConfig.olive_tree.label,
      description: legendConfig.olive_tree.description,
      color: legendConfig.olive_tree.color,
      icon: legendConfig.olive_tree.icon,
      count: legend.counts.olive_tree,
    },
    {
      key: 'vineyard',
      label: legendConfig.vineyard.label,
      description: legendConfig.vineyard.description,
      color: legendConfig.vineyard.color,
      icon: legendConfig.vineyard.icon,
      count: legend.counts.vineyard,
    },
  ];

  const impactHasSelection = selectedImpactTypes.length > 0;

  return (
    <div
      className={cn(
        'floating glass-card w-[340px] max-w-[85vw] rounded-3xl border border-white/40 bg-white/90 p-6 shadow-[0_28px_60px_-28px_rgba(37,99,235,0.45)] backdrop-blur-2xl',
        'transition-all duration-300'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Carte projets
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            Filtres & légende immersive
          </h3>
          <p className="text-xs text-slate-500">
            Ajuste la vue et explore les initiatives par typologie.
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="ring-offset-transparent hover:scale-105"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 space-y-5">
        <div className="relative">
          <Search className="text-slate-400 pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            value={localSearch}
            onChange={event => setLocalSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'h-11 w-full rounded-2xl border border-white/40 bg-white/65 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-inner shadow-white/20',
              'focus:border-[var(--brand-primary-start)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-primary-start)_45%,transparent)]'
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <CustomSelect
            name={statusSelect.name}
            options={statusSelect.options}
            value={statusSelect.value}
            onChange={statusSelect.onChange}
            placeholder={statusSelect.placeholder}
            contextIcon={statusSelect.icon}
            disabled={statusSelect.disabled}
            className="w-full"
          />
          <CustomSelect
            name={typeSelect.name}
            options={typeSelect.options}
            value={typeSelect.value}
            onChange={typeSelect.onChange}
            placeholder={typeSelect.placeholder}
            contextIcon={typeSelect.icon}
            disabled={typeSelect.disabled}
            className="w-full"
          />
          <CustomSelect
            name={partnerSelect.name}
            options={partnerSelect.options}
            value={partnerSelect.value}
            onChange={partnerSelect.onChange}
            placeholder={partnerSelect.placeholder}
            contextIcon={partnerSelect.icon}
            disabled={partnerSelect.disabled}
            className="w-full"
          />
          <CustomSelect
            name={countrySelect.name}
            options={countrySelect.options}
            value={countrySelect.value}
            onChange={countrySelect.onChange}
            placeholder={countrySelect.placeholder}
            contextIcon={countrySelect.icon}
            disabled={countrySelect.disabled}
            className="w-full"
          />
          <CustomSelect
            name={sortSelect.name}
            options={sortSelect.options}
            value={sortSelect.value}
            onChange={sortSelect.onChange}
            placeholder={sortSelect.placeholder}
            contextIcon={sortSelect.icon}
            disabled={sortSelect.disabled}
            className="w-full"
          />
          <CustomSelect
            name={impactTypeSelect.name}
            options={impactTypeSelect.options}
            value=""
            onChange={impactTypeSelect.onChange}
            placeholder={impactTypeSelect.placeholder}
            contextIcon={impactTypeSelect.icon}
            disabled={impactTypeSelect.disabled}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {tagsLabel}
          </p>
          {impactHasSelection ? (
            <div className="flex flex-wrap gap-2">
              {selectedImpactTypes.map(type => (
                <span
                  key={type}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary',
                    'shadow-[0_10px_24px_-18px_rgba(37,99,235,0.8)] backdrop-blur-sm'
                  )}
                >
                  {formatImpactTypeLabel(type)}
                  <button
                    type="button"
                    onClick={() => onImpactTypeRemove(type)}
                    className="hover:text-primary-dark rounded-full p-1 text-primary transition-colors"
                    aria-label={`Supprimer le filtre ${formatImpactTypeLabel(type)}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-white/50 bg-white/40 px-4 py-3 text-xs text-slate-500">
              Ajouter un type d&apos;impact pour affiner la carte.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-white/30">
          <CheckboxWithLabel
            className="translate-y-[1px]"
            checked={activeOnly.value}
            disabled={activeOnly.disabled}
            label={activeOnly.label}
            onCheckedChange={value =>
              activeOnly.onChange(Boolean(value))
            }
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {legend.label}
            </p>
            {legend.description && (
              <p className="text-xs text-slate-500">{legend.description}</p>
            )}
          </div>

          <div className="space-y-2">
            {legendItems.map(item => {
              const isActive = legend.active === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => legend.onSelect(item.key)}
                  className={cn(
                    'group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-4 py-3 text-left transition-all duration-200',
                    isActive
                      ? item.color
                      : 'border-white/40 bg-white/60 text-slate-600 hover:border-[var(--brand-primary-start)]/80 hover:bg-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-2xl border border-white/30 bg-white/10 shadow-inner shadow-black/10',
                        isActive ? 'text-white' : 'text-[var(--brand-primary-start)]'
                      )}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isActive ? 'text-white' : 'text-slate-700'
                        )}
                      >
                        {item.label}
                      </p>
                      <p
                        className={cn(
                          'text-[11px] font-medium',
                          isActive ? 'text-white/80' : 'text-slate-500'
                        )}
                      >
                        {item.key === 'all'
                          ? `${legend.counts.beehive + legend.counts.olive_tree + legend.counts.vineyard} projets`
                          : `${item.count ?? 0} projet${(item.count ?? 0) > 1 ? 's' : ''}`}
                        {item.description ? ` · ${item.description}` : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold shadow-sm',
                      isActive ? 'text-white' : 'text-slate-500'
                    )}
                  >
                    {item.key === 'all'
                      ? legend.counts.beehive + legend.counts.olive_tree + legend.counts.vineyard
                      : item.count ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Résultats
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {projectLabel(projectCount)}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="border border-white/40 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm hover:bg-white"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export const MapFilterPanel = memo(MapFilterPanelComponent);
MapFilterPanel.displayName = 'MapFilterPanel';
