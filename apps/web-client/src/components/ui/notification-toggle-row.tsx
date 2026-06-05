'use client'

import { Switch } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

export type NotificationToggleRowProps = {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function NotificationToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: NotificationToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-white/50">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          // Override default Switch theme styles with ghost-dark variant
          'h-6 w-11 shrink-0 rounded-full border-0 transition-colors',
          'data-[checked]:bg-lime-400 data-[unchecked]:bg-white/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
    </div>
  )
}
