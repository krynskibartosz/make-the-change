"use client";

import type { LucideIcon } from "lucide-react";
import { Compass, Gift, Globe, User, Users } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  user?: {
    id: string;
    email: string;
    avatarUrl?: string | null;
    displayName?: string | null;
  } | null;
}

type BottomNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
};

export function MobileBottomNav({ user: _user }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isAdventure = pathname.startsWith("/adventure");
  const isProjects = pathname.startsWith("/projects");
  const isImpact = pathname.startsWith("/impact");
  const isProfile = pathname.startsWith("/profile");
  const isAdvantages = pathname.startsWith("/advantages");

  const navLinkClass =
    "flex h-full min-h-[48px] w-full flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 text-center transition-colors";

  const navItems: BottomNavItem[] = [
    {
      href: "/adventure",
      icon: Compass,
      label: "Aventure",
      isActive: isAdventure,
    },
    {
      href: "/projects",
      icon: Globe,
      label: "Projets",
      isActive: isProjects,
    },
    {
      href: "/impact",
      icon: Users,
      label: "Collectif",
      isActive: isImpact,
    },
    {
      href: "/advantages",
      icon: Gift,
      label: "Avantages",
      isActive: isAdvantages,
    },
    {
      href: "/profile",
      icon: User,
      label: "Profil",
      isActive: isProfile,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0B0F15]/88 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] backdrop-blur-lg md:hidden">
      <nav aria-label="Navigation mobile">
        <ul className="m-0 flex h-[4.5rem] list-none items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex min-w-0 flex-1">
                <Link
                  href={item.href}
                  aria-current={item.isActive ? "page" : undefined}
                  className={cn(
                    navLinkClass,
                    item.isActive
                      ? "text-lime-400"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-12 items-center justify-center rounded-xl transition-all",
                      item.isActive
                        ? "scale-105 bg-lime-400/20 ring-1 ring-lime-400/30"
                        : "bg-transparent",
                    )}
                  >
                    <Icon
                      size={24}
                      fill="none"
                      strokeWidth={item.isActive ? 2.6 : 2.1}
                      className={cn(
                        "h-6 w-6",
                        item.isActive &&
                          "drop-shadow-[0_0_3px_rgba(163,230,53,0.35)]",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "w-full whitespace-nowrap text-center text-[10px] leading-none tracking-wide",
                      item.isActive ? "font-bold" : "font-medium",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
