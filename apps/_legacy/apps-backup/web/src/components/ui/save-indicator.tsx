'use client';

import { type FC } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  isDirty?: boolean;
  isSaving?: boolean;
  savedText: string;
  savingText: string;
}

export const SaveIndicator: FC<SaveIndicatorProps> = ({
  isDirty,
  isSaving,
  savedText,
  savingText,
}) => {
  // Don't show anything if form is pristine
  if (!isDirty && !isSaving) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-500">{savingText}</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-500">{savedText}</span>
        </>
      )}
    </div>
  );
};