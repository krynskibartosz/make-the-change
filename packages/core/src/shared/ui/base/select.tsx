'use client'

import { Select } from '@base-ui/react/select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { ComponentPropsWithoutRef, ElementRef, FC } from 'react'
import { forwardRef } from 'react'

const baseTrigger =
  'group flex h-[var(--density-button-height)] w-full items-center justify-between cursor-pointer ' +
  'rounded-[var(--radius-control)] bg-background border border-[hsl(var(--border))] ' +
  'px-[var(--density-spacing-md)] py-[var(--density-spacing-sm)] text-sm font-medium ' +
  'text-foreground leading-relaxed transition-all duration-[var(--transition-normal)] ' +
  'ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:bg-gradient-to-r ' +
  'hover:from-primary/4 hover:to-accent/2 hover:border-primary/40 hover:shadow-[var(--shadow-surface)] ' +
  'hover:scale-[1.01] hover:-translate-y-px focus:outline-none data-[focus-visible]:ring-2 ' +
  'data-[focus-visible]:ring-primary/60 data-[focus-visible]:ring-offset-2 ' +
  'data-[focus-visible]:ring-offset-background focus:border-primary/70 focus:bg-primary/5 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ' +
  'disabled:hover:translate-y-0 data-[popup-open]:bg-primary/8 data-[popup-open]:border-primary/50 ' +
  'data-[popup-open]:shadow-[var(--shadow-card)] placeholder:text-muted-foreground/60 ' +
  'placeholder:font-normal [&>span]:line-clamp-1 [&>span]:tracking-wide'

const SelectRoot = Select.Root
const SelectGroup = Select.Group
const SelectValue = Select.Value

const SelectTrigger = forwardRef<
  ElementRef<typeof Select.Trigger>,
  ComponentPropsWithoutRef<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select.Trigger
    ref={ref}
    className={`${baseTrigger}${className ? ` ${className}` : ''}`}
    {...props}
  >
    {children}
    <Select.Icon className="transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[popup-open]:rotate-180 group-data-[popup-open]:text-primary">
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </Select.Icon>
  </Select.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectScrollUpButton = forwardRef<
  ElementRef<typeof Select.ScrollUpArrow>,
  ComponentPropsWithoutRef<typeof Select.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <Select.ScrollUpArrow
    ref={ref}
    className={`flex cursor-default items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors duration-[var(--transition-fast)]${className ? ` ${className}` : ''}`}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </Select.ScrollUpArrow>
))
SelectScrollUpButton.displayName = 'SelectScrollUpButton'

const SelectScrollDownButton = forwardRef<
  ElementRef<typeof Select.ScrollDownArrow>,
  ComponentPropsWithoutRef<typeof Select.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <Select.ScrollDownArrow
    ref={ref}
    className={`flex cursor-default items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors duration-[var(--transition-fast)]${className ? ` ${className}` : ''}`}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </Select.ScrollDownArrow>
))
SelectScrollDownButton.displayName = 'SelectScrollDownButton'

const SelectContent = forwardRef<
  ElementRef<typeof Select.Popup>,
  ComponentPropsWithoutRef<typeof Select.Popup> & {
    position?: 'popper' | 'item-aligned'
  }
>(({ className, children, position = 'popper', ...props }, ref) => (
  <Select.Portal>
    <Select.Positioner
      alignItemWithTrigger={position !== 'popper'}
      className={`z-[var(--z-overlay)]${position === 'popper'
          ? ' data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
          : ''
        }`}
    >
      <Select.Popup
        ref={ref}
        className={`relative max-h-96 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-background backdrop-blur-xl text-foreground shadow-xl shadow-primary/8 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[open]:duration-300 data-[closed]:duration-200${className ? ` ${className}` : ''
          }`}
        {...props}
      >
        <SelectScrollUpButton />
        <Select.List
          className={`p-[var(--density-spacing-sm)]${position === 'popper' ? ' w-full min-w-[var(--anchor-width)]' : ''
            }`}
        >
          {children}
        </Select.List>
        <SelectScrollDownButton />
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
))
SelectContent.displayName = 'SelectContent'

const SelectLabel = forwardRef<
  ElementRef<typeof Select.GroupLabel>,
  ComponentPropsWithoutRef<typeof Select.GroupLabel>
>(({ className, ...props }, ref) => (
  <Select.GroupLabel
    ref={ref}
    className={`py-[var(--density-spacing-sm)] pl-10 pr-[var(--density-spacing-sm)] text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider leading-tight${className ? ` ${className}` : ''
      }`}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

const SelectItem = forwardRef<
  ElementRef<typeof Select.Item>,
  ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
  <Select.Item
    ref={ref}
    className={`relative flex w-full cursor-pointer select-none items-center rounded-[var(--radius-control)] py-[var(--density-spacing-sm)] pl-10 pr-[var(--density-spacing-sm)] text-sm font-medium text-foreground leading-relaxed tracking-wide outline-none will-change-transform transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-gradient-to-r hover:from-primary/8 hover:to-accent/4 hover:text-foreground hover:scale-[1.02] hover:shadow-sm data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground data-[highlighted]:scale-[1.02] data-[highlighted]:shadow-[var(--shadow-surface)] data-[highlighted]:shadow-primary/10 data-[selected]:bg-primary/15 data-[selected]:text-primary data-[selected]:font-semibold data-[selected]:shadow-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:hover:scale-100 data-[disabled]:hover:bg-transparent${className ? ` ${className}` : ''
      }`}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <Select.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-primary font-bold animate-in zoom-in-75 duration-200" />
      </Select.ItemIndicator>
    </span>
    <Select.ItemText className="flex-1 truncate">{children}</Select.ItemText>
  </Select.Item>
))
SelectItem.displayName = 'SelectItem'

const SelectSeparator = forwardRef<
  ElementRef<typeof Select.Separator>,
  ComponentPropsWithoutRef<typeof Select.Separator>
>(({ className, ...props }, ref) => (
  <Select.Separator
    ref={ref}
    className={`-mx-[var(--density-spacing-sm)] my-[var(--density-spacing-sm)] h-px bg-gradient-to-r from-transparent via-border/60 to-transparent${className ? ` ${className}` : ''
      }`}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'

export {
  SelectRoot as Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

export type SimpleSelectProps = {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  className?: string
  disabled?: boolean
}

export const SimpleSelect: FC<SimpleSelectProps> = ({
  placeholder = 'Sélectionner...',
  value,
  onValueChange,
  options,
  className,
  disabled,
}) => (
  <SelectRoot
    disabled={disabled}
    value={value}
    onValueChange={(nextValue) => onValueChange?.(String(nextValue))}
  >
    <SelectTrigger className={className}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} disabled={option.disabled} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </SelectRoot>
)
