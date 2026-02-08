'use client';

import { forwardRef } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { LabelHTMLAttributes } from 'react';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  error?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, error = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'flex items-center gap-1 text-sm font-medium transition-colors',
        error
          ? 'text-destructive'
          : 'text-muted-foreground dark:text-foreground/80',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = 'Label';
