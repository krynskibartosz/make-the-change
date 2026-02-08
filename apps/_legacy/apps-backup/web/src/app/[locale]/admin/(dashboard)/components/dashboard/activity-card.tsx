'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { type FC, type ReactNode } from 'react';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

type ActivityCardProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  isLoading?: boolean;
};

export const ActivityCard: FC<ActivityCardProps> = ({
  title,
  icon: Icon,
  children,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="card-base card-base-dark rounded-2xl transition-all duration-300">
        <div className="border-border/50 from-primary/5 to-secondary/5 flex items-center gap-3 border-b bg-gradient-to-r p-6">
          <div className={`h-10 w-10 rounded-lg bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-6 w-40 rounded-md bg-muted/40 ${shimmerClasses}`} />
        </div>
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full bg-muted/30 ${shimmerClasses}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-3/4 rounded-md bg-muted/30 ${shimmerClasses}`} />
                <div className={`h-3 w-1/2 rounded-md bg-muted/20 ${shimmerClasses}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-base card-base-dark rounded-2xl transition-all duration-300">
      <div className="border-border/50 from-primary/5 to-secondary/5 flex items-center gap-3 border-b bg-gradient-to-r p-6">
        <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
          <Icon className="text-primary h-5 w-5" />
        </div>
        <h3 className="text-foreground text-lg font-semibold leading-tight tracking-tight">
          {title}
        </h3>
      </div>
      <div className="space-y-1 p-6">{children}</div>
    </div>
  );
};

type ActivityItemProps = {
  href: string;
  avatar?: string | null;
  icon?: LucideIcon;
  title: ReactNode;
  subtitle: string;
  timestamp: string;
};

export const ActivityItem: FC<ActivityItemProps> = ({
  href,
  avatar,
  icon: Icon,
  title,
  subtitle,
  timestamp,
}) => {
  return (
    <Link
      href={href}
      className="group relative isolate -mx-2 flex items-center gap-3 overflow-hidden rounded-xl border border-transparent px-2 py-2 transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:via-transparent hover:to-primary/5 hover:shadow-md hover:shadow-primary/5"
    >
      {/* Effet shimmer au hover */}
      <div className="pointer-events-none absolute inset-0 z-0 translate-x-[-100%] rounded-xl bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[100%]" />
      
      <div className="relative z-10 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-10 w-10 rounded-full border-2 border-border object-cover transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10"
          />
        ) : Icon ? (
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10">
            <Icon className="text-primary h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
        ) : (
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-muted/80 group-hover:shadow-md">
            ?
          </div>
        )}
      </div>
      <div className="relative z-10 min-w-0 flex-1 transition-all duration-300 group-hover:translate-x-1">
        <p className="text-foreground truncate text-sm font-medium transition-colors duration-300 group-hover:text-primary">
          {title}
        </p>
        <p className="text-muted-foreground truncate text-xs transition-colors duration-300 group-hover:text-foreground/80">
          {subtitle}
        </p>
      </div>
      <div className="text-muted-foreground relative z-10 flex-shrink-0 text-xs transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground/60">
        {timestamp}
        <svg
          className="ml-1 inline-block h-3 w-3 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M9 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};
