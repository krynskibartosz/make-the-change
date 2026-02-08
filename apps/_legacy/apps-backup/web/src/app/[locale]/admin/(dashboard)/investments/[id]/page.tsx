'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { InvestmentDetailController } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-detail-controller';
import { InvestmentDetailSkeleton } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-detail-skeleton';
import type { Investment } from '@/lib/types/investment';
import { trpc } from '@/lib/trpc';

const AdminInvestmentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const investmentId = params?.id as string | undefined;
  const utils = trpc.useUtils();

  const {
    data: investment,
    isLoading,
    error,
  } = trpc.admin.investments.detail.useQuery(
    { investmentId: investmentId! },
    {
      enabled: Boolean(investmentId),
      retry: 1,
      retryDelay: 500,
    }
  );

  const update = trpc.admin.investments.update.useMutation({
    onMutate: async vars => {
      await utils.admin.investments.detail.cancel({ investmentId: vars.investmentId });
      await utils.admin.investments.list.cancel();

      const previousDetail = utils.admin.investments.detail.getData({
        investmentId: vars.investmentId,
      });

      const previousList = utils.admin.investments.list.getData({
        page: 1,
        limit: 20,
      });

      if (previousDetail) {
        utils.admin.investments.detail.setData({ investmentId: vars.investmentId }, {
          ...previousDetail,
          ...vars.patch,
        });
      }

      if (previousList) {
        utils.admin.investments.list.setData({ page: 1, limit: 20 }, {
          ...previousList,
          items: previousList.items.map(item =>
            item.id === vars.investmentId ? ({ ...item, ...vars.patch } as typeof item) : item
          ),
        });
      }

      return { previousDetail, previousList };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previousDetail) {
        utils.admin.investments.detail.setData(
          { investmentId: vars.investmentId },
          ctx.previousDetail
        );
      }
      if (ctx?.previousList) {
        utils.admin.investments.list.setData({ page: 1, limit: 20 }, ctx.previousList);
      }
    },
    onSettled: (_data, _error, vars) => {
      utils.admin.investments.detail.invalidate({ investmentId: vars.investmentId });
      utils.admin.investments.list.invalidate();
    },
  });

  const handleSave = async (patch: Partial<Investment>) => {
    if (!investmentId) return;
    await update.mutateAsync({ investmentId, patch });
  };

  const investmentData = useMemo(() => investment ?? null, [investment]);

  if (!investmentId) {
    return <div className="p-8 text-sm text-muted-foreground">Identifiant manquant.</div>;
  }

  if (isLoading && !investmentData) {
    return <InvestmentDetailSkeleton />;
  }

  if (error || !investmentData) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-red-600">Erreur</h3>
        <p className="text-muted-foreground">
          {error?.message ?? "L'investissement est introuvable."}
        </p>
      </div>
    );
  }

  return (
    <InvestmentDetailController investment={investmentData} onSave={handleSave as any} />
  );
};

export default AdminInvestmentDetailPage;
