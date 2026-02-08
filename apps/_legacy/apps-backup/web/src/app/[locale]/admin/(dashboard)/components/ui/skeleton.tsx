'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted/60',
        'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r',
        'before:from-transparent before:via-foreground/10 before:to-transparent',
        'before:animate-[shimmer_1.8s_infinite]',
        'after:pointer-events-none after:absolute after:inset-0 after:border after:border-border/40 after:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
