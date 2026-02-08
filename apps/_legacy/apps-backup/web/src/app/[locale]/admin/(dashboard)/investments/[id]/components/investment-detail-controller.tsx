'use client';

import { useMemo, useState } from 'react';

import { InvestmentBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-breadcrumbs';
import { InvestmentCompactHeader } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-compact-header';
import { InvestmentDetailLayout } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-detail-layout';
import { InvestmentDetails } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-details';
import { InvestmentReturnsTimeline } from '@/app/[locale]/admin/(dashboard)/investments/[id]/components/investment-returns-timeline';
import type { Investment } from '@/lib/types/investment';

type InvestmentDetailControllerProps = {
  investment: Investment;
  onSave: (patch: Partial<Investment>) => Promise<void>;
};

const editableKeys: Array<keyof Investment> = [
  'status',
  'expected_return_rate',
  'maturity_date',
  'last_return_date',
  'notes',
];

export const InvestmentDetailController = ({
  investment,
  onSave,
}: InvestmentDetailControllerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<Investment>>({});

  const mergedInvestment = useMemo<Investment>(
    () => ({
      ...investment,
      ...pendingData,
    }),
    [investment, pendingData]
  );

  const hasChanges = useMemo(() => {
    return editableKeys.some(key => {
      if (!(key in pendingData)) return false;
      const pendingValue = pendingData[key];
      const currentValue = investment[key];
      return pendingValue !== currentValue;
    });
  }, [pendingData, investment]);

  const handleDataChange = (patch: Partial<Investment>) => {
    setPendingData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const patch: Partial<Investment> = {};
      for (const key of editableKeys) {
        if (key in pendingData) {
          const pendingValue = pendingData[key];
          const currentValue = investment[key];
          if (pendingValue !== currentValue) {
            (patch as any)[key] = pendingValue;
          }
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setPendingData({});
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = (editing: boolean) => {
    setIsEditing(editing);
    if (!editing) {
      setPendingData({});
    }
  };

  return (
    <InvestmentDetailLayout
      breadcrumbs={<InvestmentBreadcrumbs investment={investment} />}
      header={
        <InvestmentCompactHeader
          hasChanges={hasChanges}
          investment={mergedInvestment}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />
      }
      content={
        <div className="space-y-6">
          <InvestmentDetails
            investment={mergedInvestment}
            isEditing={isEditing}
            onChange={handleDataChange}
          />
          <InvestmentReturnsTimeline returns={investment.returns} />
        </div>
      }
    />
  );
};
