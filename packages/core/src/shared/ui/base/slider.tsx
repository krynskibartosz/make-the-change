'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Control className="relative h-2 w-full grow rounded-full bg-muted">
      <SliderPrimitive.Track className="relative h-full w-full rounded-full">
        <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-primary" />
      </SliderPrimitive.Track>
      {children}
    </SliderPrimitive.Control>
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'

const SliderThumb = forwardRef<
  ElementRef<typeof SliderPrimitive.Thumb>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      'block h-5 w-5 rounded-full border border-primary/40 bg-background shadow transition-colors focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60 disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
SliderThumb.displayName = 'SliderThumb'

const SliderControl = SliderPrimitive.Control
const SliderTrack = SliderPrimitive.Track
const SliderIndicator = SliderPrimitive.Indicator
const SliderValue = SliderPrimitive.Value

export { Slider, SliderThumb, SliderControl, SliderTrack, SliderIndicator, SliderValue }
