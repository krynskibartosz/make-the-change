'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { motion } from 'framer-motion'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { FC } from 'react'
import { LocalizedLink } from '@/components/localized-link'
import { usePathname } from '@/i18n/navigation'

export type AdminSidebarLinkProps = {
  href: string
  icon: LucideIcon
  label: string
  onClick?: () => void
  isHighlighted?: boolean
  isCompact?: boolean
  isPrimary?: boolean
}

export const AdminSidebarLink: FC<AdminSidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  onClick,
  isHighlighted,
  isCompact,
  isPrimary,
}) => {
  const pathname = usePathname()
  const isActive = href === '/admin' ? pathname === href : pathname?.startsWith(href)
  const testId = href.replace('/admin', '').replace('/', '') || 'dashboard'
  const isExternal = href.startsWith('http')

  const LinkComponent = isExternal ? 'a' : LocalizedLink
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      whileHover={isActive ? {} : { scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <LinkComponent
        {...linkProps}
        aria-current={isActive ? 'page' : undefined}
        data-testid={`sidebar-link-${testId}`}
        className={cn(
          'group relative flex items-center gap-4 rounded-2xl transition-all duration-300',
          'overflow-hidden cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
          isCompact ? 'py-3 px-4' : 'py-4 px-5',

          isPrimary && [
            'bg-gradient-to-r from-primary/10 via-primary/5 to-accent/5',
            'border border-primary/20 hover:border-primary/30',
            'shadow-lg shadow-primary/10 hover:shadow-primary/15',
            'font-bold text-foreground',
          ],

          isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/12 to-accent/8 text-foreground font-semibold',
              'border border-primary/25 shadow-lg shadow-primary/10',
              'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
              'before:h-8 before:w-1.5 before:bg-gradient-to-b before:from-primary before:to-accent before:rounded-r-full',
            ],

          isHighlighted &&
            !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/6 to-accent/4 hover:from-primary/10 hover:to-accent/6',
              'border border-primary/15 hover:border-primary/25',
              'font-semibold text-foreground/90 hover:text-foreground',
              'shadow-md hover:shadow-lg hover:shadow-primary/5',
            ],

          !isActive &&
            !isHighlighted &&
            !isPrimary && [
              'text-muted-foreground/80 hover:text-foreground',
              'border border-transparent hover:border-[hsl(var(--border)/0.3)]',
              'hover:bg-muted/30 hover:shadow-sm',
            ],

          isActive && 'hover:scale-100 hover:shadow-none',
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            'relative rounded-xl transition-all duration-300 flex items-center justify-center',
            isCompact ? 'w-9 h-9' : 'w-11 h-11',

            isPrimary && [
              'bg-gradient-to-br from-primary/20 to-accent/15',
              'text-primary shadow-lg shadow-primary/20',
            ],

            isActive &&
              !isPrimary && [
                'bg-gradient-to-br from-primary/20 to-accent/15 text-primary',
                'shadow-lg shadow-primary/20',
              ],

            isHighlighted &&
              !isActive &&
              !isPrimary && [
                'bg-primary/12 text-primary',
                'group-hover:bg-primary/18 group-hover:shadow-md',
              ],

            !isActive &&
              !isHighlighted &&
              !isPrimary && [
                'bg-muted/30 text-muted-foreground/70',
                'group-hover:bg-muted/50 group-hover:text-muted-foreground group-hover:shadow-sm',
              ],
          )}
        >
          <Icon className={cn('transition-all duration-300', isCompact ? 'h-4 w-4' : 'h-5 w-5')} />

          {(isPrimary || isActive || isHighlighted) && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={cn(
              'block font-medium transition-all duration-300 truncate',
              isCompact ? 'text-sm' : 'text-base',
              isPrimary && 'font-bold text-lg',
              isHighlighted && 'font-semibold',
            )}
          >
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <motion.div
              animate={{ scale: 1, rotate: 0 }}
              initial={{ scale: 0, rotate: -180 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'bg-gradient-to-r from-primary to-accent rounded-full',
                isCompact ? 'w-2 h-2' : 'w-2.5 h-2.5',
              )}
            />
          )}

          {isHighlighted && !isActive && (
            <motion.div
              animate={{ scale: 1 }}
              className={cn('bg-primary/60 rounded-full', isCompact ? 'w-1.5 h-1.5' : 'w-2 h-2')}
              initial={{ scale: 0 }}
            />
          )}
        </div>

        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden" />
        )}
      </LinkComponent>
    </motion.div>
  )
}

export type AdminMobileSidebarProps = {
  href: string
  icon: LucideIcon
  label: string
  description?: string
  onClick?: () => void
  isHighlighted?: boolean
  isCompact?: boolean
  isPrimary?: boolean
}

export const AdminMobileSidebarLink: FC<AdminMobileSidebarProps> = ({
  href,
  icon: Icon,
  label,
  description,
  onClick,
  isHighlighted,
  isCompact,
  isPrimary,
}) => {
  const pathname = usePathname()
  const isActive = href === '/admin' ? pathname === href : pathname?.startsWith(href)
  const isExternal = href.startsWith('http')

  const LinkComponent = isExternal ? 'a' : LocalizedLink
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <LinkComponent
        {...linkProps}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-4 rounded-3xl transition-all duration-300 overflow-hidden',
          'active:shadow-lg active:shadow-primary/10',
          isCompact ? 'p-4' : 'p-5',

          isPrimary && [
            'bg-gradient-to-r from-primary/12 via-primary/8 to-accent/6',
            'border border-primary/25 shadow-xl shadow-primary/15',
            'text-foreground font-bold',
          ],

          isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10',
              'border border-primary/25 shadow-xl shadow-primary/15',
              'text-foreground font-semibold',
            ],

          !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-muted/15 to-muted/10 active:from-muted/25 active:to-muted/15',
              'border border-[hsl(var(--border)/0.1)] active:border-[hsl(var(--border)/0.2)]',
              'text-muted-foreground/70 active:text-foreground/90',
            ],

          isHighlighted &&
            !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/10 to-accent/8 active:from-primary/15 active:to-accent/10',
              'border border-primary/25 active:border-primary/35',
              'text-foreground font-semibold shadow-md active:shadow-lg',
            ],

          isActive && 'active:shadow-current active:translate-y-0',
        )}
        onClick={onClick}
      >
        <motion.div
          whileTap={isActive ? {} : { scale: 0.95 }}
          className={cn(
            'relative rounded-2xl transition-all duration-300 flex items-center justify-center',
            isCompact ? 'w-10 h-10' : 'w-12 h-12',

            isPrimary && [
              'bg-gradient-to-br from-primary/25 to-accent/20',
              'text-primary shadow-xl shadow-primary/25',
            ],

            isActive &&
              !isPrimary && [
                'bg-gradient-to-br from-primary/25 to-accent/20 text-primary',
                'shadow-xl shadow-primary/25',
              ],

            isHighlighted &&
              !isActive &&
              !isPrimary && [
                'bg-primary/15 text-primary',
                'group-active:bg-primary/20 group-active:shadow-lg',
              ],

            !isActive &&
              !isHighlighted &&
              !isPrimary && [
                'bg-muted/30 text-muted-foreground/60',
                'group-active:bg-muted/50 group-active:text-muted-foreground/80',
              ],
          )}
        >
          <Icon className={cn('transition-all duration-300', isCompact ? 'h-5 w-5' : 'h-6 w-6')} />

          {(isPrimary || isActive || isHighlighted) && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent rounded-2xl" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'font-semibold truncate transition-colors duration-300',
                  isCompact ? 'text-sm' : 'text-base',
                  isPrimary && 'font-bold text-lg text-foreground',
                  isHighlighted && 'font-bold text-foreground',
                )}
              >
                {label}
              </h3>
              {description && (
                <p
                  className={cn(
                    'text-muted-foreground mt-0.5 truncate opacity-80',
                    isCompact ? 'text-xs' : 'text-xs',
                    isHighlighted && 'text-foreground/60 font-medium',
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            <motion.div
              animate={{ x: isActive ? 0 : -10 }}
              className="flex items-center gap-2"
              initial={false}
            >
              {isActive ? (
                <motion.div
                  animate={{ scale: 1 }}
                  className={cn('bg-primary rounded-full', isCompact ? 'w-1.5 h-1.5' : 'w-2 h-2')}
                  initial={{ scale: 0 }}
                />
              ) : isHighlighted ? (
                <motion.div
                  animate={{ scale: 1 }}
                  className={cn(
                    'bg-primary/60 rounded-full',
                    isCompact ? 'w-1 h-1' : 'w-1.5 h-1.5',
                  )}
                  initial={{ scale: 0 }}
                />
              ) : (
                <ChevronRight className="h-4 w-4 opacity-40 group-active:opacity-80 transition-opacity" />
              )}
            </motion.div>
          </div>
        </div>

        {!isActive && (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none rounded-3xl',
            )}
          />
        )}
      </LinkComponent>
    </motion.div>
  )
}
