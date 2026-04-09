'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@make-the-change/core/ui'
import {
  BookOpen,
  HelpCircle,
  LogOut,
  Mail,
  Sparkles,
  Store,
  type LucideIcon,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { logout } from '@/app/[locale]/(auth)/actions'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type UserDrawerUser = {
  id: string
  email: string
  avatarUrl?: string | null
  displayName?: string | null
} | null

type UserDrawerProps = {
  user?: UserDrawerUser
  className?: string
  forceUserIcon?: boolean
}

type DrawerLinkTone = 'default' | 'highlight' | 'muted'

type DrawerLinkProps = {
  href: string
  icon: LucideIcon
  label: string
  tone?: DrawerLinkTone
  onSelect: () => void
}

const resolveDisplayName = (user: UserDrawerUser): string => {
  if (!user) return ''
  if (typeof user.displayName === 'string' && user.displayName.trim().length > 0) {
    return user.displayName.trim()
  }

  const localPart = user.email.split('@')[0]?.trim()
  return localPart || 'Membre'
}

const resolveInitials = (value: string): string => {
  const parts = value
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) return '?'
  return parts.map((part) => part.charAt(0).toUpperCase()).join('')
}

function DrawerLink({ href, icon: Icon, label, tone = 'default', onSelect }: DrawerLinkProps) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={cn(
        'flex h-11 items-center gap-3 rounded-xl px-3 transition-colors',
        tone === 'default' && 'text-foreground hover:bg-accent/60',
        tone === 'highlight' && 'bg-lime-500/10 text-lime-400 hover:bg-lime-500/15',
        tone === 'muted' && 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

export function UserDrawer({ user = null, className, forceUserIcon = false }: UserDrawerProps) {
  const [open, setOpen] = useState(false)
  const isAuthenticated = !!user

  const displayName = useMemo(() => resolveDisplayName(user), [user])
  const initials = useMemo(
    () => resolveInitials(displayName || user?.email || '?'),
    [displayName, user?.email],
  )

  const closeDrawer = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={isAuthenticated ? 'Ouvrir le tiroir utilisateur' : 'Ouvrir le menu utilisateur'}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60',
          className,
        )}
      >
        {isAuthenticated && !forceUserIcon ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || undefined} alt="" className="object-cover" />
            <AvatarFallback className="bg-lime-500/15 text-xs font-semibold text-lime-400">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-[min(22rem,88vw)] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-5 pb-4 pt-6 text-left">
            <SheetTitle className="text-base font-semibold">Profil</SheetTitle>
            {isAuthenticated ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/40 p-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={user.avatarUrl || undefined} alt="" className="object-cover" />
                  <AvatarFallback className="bg-lime-500/15 text-sm font-semibold text-lime-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-border/70 bg-card/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Connecte-toi pour suivre ton aventure et accéder à ton espace membre.
                </p>
                <Button
                  asChild
                  className="mt-3 w-full bg-lime-500 text-black hover:bg-lime-400"
                >
                  <Link href="/login" onClick={closeDrawer}>
                    Se connecter
                  </Link>
                </Button>
              </div>
            )}
          </SheetHeader>

          <div className="px-3 pb-3">
            <DrawerLink
              href={isAuthenticated ? '/dashboard/subscription' : '/pricing'}
              icon={Sparkles}
              label="Abonnement / Tarification"
              tone="highlight"
              onSelect={closeDrawer}
            />
          </div>

          <Separator />

          <div className="px-3 py-3">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Écosystème
            </p>
            <div className="space-y-1">
              <DrawerLink href="/producers" icon={Store} label="Nos Producteurs" onSelect={closeDrawer} />
              <DrawerLink href="/blog" icon={BookOpen} label="Le Blog" onSelect={closeDrawer} />
            </div>
          </div>

          <div className="mt-auto">
            <Separator />
            <div className="px-3 py-3">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Support
              </p>
              <div className="space-y-1">
                <DrawerLink
                  href="/faq"
                  icon={HelpCircle}
                  label="FAQ"
                  tone="muted"
                  onSelect={closeDrawer}
                />
                <DrawerLink
                  href="/contact"
                  icon={Mail}
                  label="Nous Contacter"
                  tone="muted"
                  onSelect={closeDrawer}
                />
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <Separator />
                <div className="p-3">
                  <form action={logout}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="h-11 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </form>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
