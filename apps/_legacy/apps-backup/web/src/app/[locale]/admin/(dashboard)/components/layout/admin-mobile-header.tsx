'use client';

import { Menu } from 'lucide-react';
import { type FC } from 'react';

import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context';
import { CompactThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle';
import { Button } from '@/components/ui/button';

export const AdminMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useAdminSidebar();

  return (
    <header className="sticky top-0 z-[45] flex h-14 items-center justify-between border-b border-border-subtle/70 bg-surface-1/95 px-4 text-text-primary backdrop-blur-md transition-colors duration-300 md:hidden">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Ouvrir le menu de navigation"
          className="min-h-[44px] min-w-[44px] touch-manipulation rounded-2xl p-3"
          size="sm"
          variant="ghost"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="from-primary via-primary to-accent flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-primary-foreground shadow-glow-md">
            <span className="text-sm font-bold">M</span>
          </div>
          <h1 className="text-lg font-bold text-text-primary">Make the CHANGE</h1>
        </div>
      </div>

      <CompactThemeToggle />
    </header>
  );
};
