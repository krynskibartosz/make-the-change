'use client';

import { ResponsiveLine } from '@nivo/line';
import {
  TrendingUp,
  Users,
  UserPlus,
  UserMinus,
  PiggyBank,
  UserCircle,
  Calendar,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { StatCard } from '@/app/[locale]/admin/(dashboard)/components/dashboard/stat-card';
import {
  ActivityCard,
  ActivityItem,
} from '@/app/[locale]/admin/(dashboard)/components/dashboard/activity-card';
import {
  CustomSelect,
  type SelectOption,
} from '@/components/ui/custom-select';
import { trpc } from '@/lib/trpc';

type PeriodOption = '30days' | '3months' | '1year';

const periodOptions: SelectOption[] = [
  {
    value: '30days',
    title: '30 derniers jours',
    subtitle: 'Vue mensuelle',
    icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: '3months',
    title: '3 derniers mois',
    subtitle: 'Vue trimestrielle',
    icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: '1year',
    title: 'Cette année',
    subtitle: 'Vue annuelle',
    icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value);

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

const getRelativeTime = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `il y a quelques secondes`;
};

const AdminDashboardPage = () => {
  const [period, setPeriod] = useState<PeriodOption>('30days');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch dashboard metrics
  const { data: metricsData, isLoading: isLoadingMetrics } =
    trpc.admin.dashboard.metrics.useQuery(
      { period },
      {
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
      }
    );


  // Fetch recent investments
  const { data: recentInvestments, isLoading: isLoadingInvestments } =
    trpc.admin.dashboard.recentInvestments.useQuery(
      { limit: 5 },
      {
        refetchOnMount: 'always',
      }
    );

  // Fetch recent users
  const { data: recentUsers, isLoading: isLoadingUsers } =
    trpc.admin.dashboard.recentUsers.useQuery(
      { limit: 5 },
      {
        refetchOnMount: 'always',
      }
    );

  // Prepare MRR chart data
  const mrrChartData = useMemo(() => {
    try {
      const history = metricsData?.mrrHistory;
      if (!history || !Array.isArray(history) || history.length === 0) {
        return [];
      }
      const validData = history
        .filter(item => item.date) // Filter out items with null/undefined dates
        .map(item => {
          const date = new Date(item.date);
          // Validate that the date is valid
          if (isNaN(date.getTime())) {
            console.warn('Invalid date in MRR history:', item.date);
            return null;
          }
          return {
            x: date.toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
            }),
            y: item.value || 0,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null); // Remove null entries
      
      if (validData.length === 0) {
        return [];
      }
      
      return [
        {
          id: 'MRR',
          data: validData,
        },
      ];
    } catch (error) {
      console.error('Error preparing MRR chart data:', error);
      return [];
    }
  }, [metricsData?.mrrHistory]) ?? [];

  // Prepare subscribers chart data
  const subscribersChartData = useMemo(() => {
    try {
      const history = metricsData?.subscribersHistory;
      if (!history || !Array.isArray(history) || history.length === 0) {
        return [];
      }
      
      const result = history
        .filter(item => item && item.date)
        .map(item => {
          const date = new Date(item.date);
          if (isNaN(date.getTime())) {
            return null;
          }
          
          const month = date.toLocaleDateString('fr-FR', {
            month: 'short',
          });
          
          if (!month || month === 'Invalid Date') {
            return null;
          }
          
          return {
            month,
            'Nouveaux abonnés': item.newSubscribers || 0,
            'Désabonnements': item.churnedSubscribers || 0,
          };
        })
        .filter((item): item is NonNullable<typeof item> => {
          if (item === null) return false;
          if (!item.month) return false;
          return true;
        });
      
      return result;
    } catch (error) {
      return [];
    }
  }, [metricsData?.subscribersHistory]) ?? [];

  // Final validation for subscribers chart data
  const isSubscribersDataValid = 
    isMounted &&
    !isLoadingMetrics && 
    Array.isArray(subscribersChartData) && 
    subscribersChartData.length > 0 &&
    subscribersChartData.every(item => 
      item && 
      typeof item.month === 'string' && 
      item.month.length > 0 &&
      typeof item['Nouveaux abonnés'] === 'number' &&
      typeof item['Désabonnements'] === 'number'
    );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="flex items-center justify-end">
          <CustomSelect
            name="period-selector"
            contextIcon={<Calendar className="h-5 w-5" />}
            options={periodOptions}
            value={period}
            placeholder="Sélectionner une période"
            className="w-full md:w-64"
            onChange={value => setPeriod(value as PeriodOption)}
          />
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        <div className="space-y-6">
          {/* KPIs Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="MRR"
              value={
                metricsData?.kpis?.mrr
                  ? formatCurrency(metricsData.kpis.mrr)
                  : '—'
              }
              icon={TrendingUp}
              trend={
                metricsData?.kpis?.mrrTrend
                  ? {
                      value: metricsData.kpis.mrrTrend,
                      isPositive: metricsData.kpis.mrrTrend > 0,
                    }
                  : undefined
              }
              isLoading={isLoadingMetrics}
            />

            <StatCard
              title="Abonnés Actifs"
              value={
                metricsData?.kpis?.activeSubscribers
                  ? formatNumber(metricsData.kpis.activeSubscribers)
                  : '—'
              }
              icon={Users}
              trend={
                metricsData?.kpis?.subscribersTrend
                  ? {
                      value: metricsData.kpis.subscribersTrend,
                      isPositive: metricsData.kpis.subscribersTrend > 0,
                    }
                  : undefined
              }
              isLoading={isLoadingMetrics}
            />

            <StatCard
              title="Nouveaux Abonnés"
              value={
                metricsData?.kpis?.newSubscribers !== undefined
                  ? formatNumber(metricsData.kpis.newSubscribers)
                  : '—'
              }
              icon={UserPlus}
              isLoading={isLoadingMetrics}
            />

            <StatCard
              title="Taux de Churn"
              value={
                metricsData?.kpis?.churnRate !== undefined
                  ? formatPercentage(metricsData.kpis.churnRate)
                  : '—'
              }
              icon={UserMinus}
              trend={
                metricsData?.kpis?.churnTrend
                  ? {
                      value: Math.abs(metricsData.kpis.churnTrend),
                      isPositive: metricsData.kpis.churnTrend < 0, // Lower churn is positive
                    }
                  : undefined
              }
              isLoading={isLoadingMetrics}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* MRR Growth Chart */}
            <div className="card-base card-base-dark rounded-2xl p-6 transition-all duration-300">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Croissance du MRR
              </h3>
              <div className="h-80">
                {!isMounted ||
                 isLoadingMetrics || 
                 !Array.isArray(mrrChartData) || 
                 mrrChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Chargement des données...
                    </p>
                  </div>
                ) : (
                  <ResponsiveLine
                    data={mrrChartData}
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    curve="monotoneX"
                    animate={false}
                    isInteractive={false}
                    enableSlices={false}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      format: value => formatCurrency(value as number),
                    }}
                    enableGridX={false}
                    colors={['#10b981']}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    enableArea={false}
                    useMesh={false}
                    theme={{
                      text: {
                        fill: 'var(--color-text-secondary)',
                        fontSize: 11,
                      },
                      grid: {
                        line: {
                          stroke: 'var(--color-border-subtle)',
                          strokeWidth: 1,
                        },
                      },
                      tooltip: {
                        container: {
                          background: 'var(--color-surface-level-1)',
                          color: 'var(--color-text-primary)',
                          fontSize: 12,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          padding: '8px 12px',
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Subscribers Chart */}
            <div className="card-base card-base-dark rounded-2xl p-6 transition-all duration-300">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Acquisition vs. Churn d'Abonnés
              </h3>
              <div className="h-80">
                {!isSubscribersDataValid ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Chargement des données...
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between p-4">
                    {/* Custom Bar Chart - Avoiding Nivo/react-spring bug */}
                    <div className="flex h-full items-end justify-around gap-4">
                      {subscribersChartData.map((item, index) => {
                        const maxValue = Math.max(
                          ...subscribersChartData.flatMap(d => [
                            d['Nouveaux abonnés'],
                            d['Désabonnements'],
                          ])
                        );
                        const newHeight = (item['Nouveaux abonnés'] / maxValue) * 100;
                        const churnHeight = (item['Désabonnements'] / maxValue) * 100;
                        
                        return (
                          <div key={index} className="flex flex-1 flex-col items-center gap-2">
                            <div className="flex w-full items-end justify-center gap-2" style={{ height: '200px' }}>
                              {/* Nouveaux abonnés */}
                              <div className="flex flex-col items-center gap-1" style={{ width: '40%' }}>
                                <span className="text-xs text-muted-foreground">{item['Nouveaux abonnés']}</span>
                                <div
                                  className="w-full rounded-t bg-emerald-500 transition-all"
                                  style={{ height: `${newHeight}%` }}
                                  title={`Nouveaux abonnés: ${item['Nouveaux abonnés']}`}
                                />
                              </div>
                              {/* Désabonnements */}
                              <div className="flex flex-col items-center gap-1" style={{ width: '40%' }}>
                                <span className="text-xs text-muted-foreground">{item['Désabonnements']}</span>
                                <div
                                  className="w-full rounded-t bg-red-500 transition-all"
                                  style={{ height: `${churnHeight}%` }}
                                  title={`Désabonnements: ${item['Désabonnements']}`}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-foreground">{item.month}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-emerald-500" />
                        <span className="text-xs text-muted-foreground">Nouveaux abonnés</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-red-500" />
                        <span className="text-xs text-muted-foreground">Désabonnements</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Investments */}
            <ActivityCard
              title="Derniers Investissements"
              icon={PiggyBank}
              isLoading={isLoadingInvestments}
            >
              {recentInvestments && recentInvestments.length > 0 ? (
                recentInvestments.map(investment => (
                  <ActivityItem
                    key={investment.id}
                    href={`/admin/investments/${investment.id}`}
                    icon={PiggyBank}
                    title={
                      <>
                        <span className="font-semibold">
                          {investment.userName || 'Utilisateur inconnu'}
                        </span>
                        {' a investi '}
                        <span className="font-semibold">
                          {formatNumber(investment.amountPoints)} pts
                        </span>
                        {investment.projectName && (
                          <>
                            {' dans '}
                            <span className="font-semibold">
                              {investment.projectName}
                            </span>
                          </>
                        )}
                      </>
                    }
                    subtitle={`Type: ${investment.investmentType || 'Non défini'}`}
                    timestamp={getRelativeTime(investment.createdAt)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Aucun investissement récent
                </p>
              )}
            </ActivityCard>

            {/* Recent Users */}
            <ActivityCard
              title="Dernières Inscriptions"
              icon={UserCircle}
              isLoading={isLoadingUsers}
            >
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map(user => (
                  <ActivityItem
                    key={user.id}
                    href={`/admin/users/${user.id}`}
                    avatar={user.avatarUrl}
                    title={user.name || user.email}
                    subtitle={user.name ? user.email : 'Nouveau membre'}
                    timestamp={getRelativeTime(user.createdAt)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Aucune inscription récente
                </p>
              )}
            </ActivityCard>
          </div>
        </div>
      </AdminPageLayout.Content>
    </AdminPageLayout>
  );
};

export default AdminDashboardPage;
