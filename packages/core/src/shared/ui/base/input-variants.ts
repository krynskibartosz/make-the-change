import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  'flex w-full rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/30',
  {
    variants: {
      variant: {
        default:
          'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 focus-visible:border-primary/70 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        outlined:
          'bg-transparent border-2 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        filled:
          'bg-muted/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        ghost:
          'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus-visible:ring-lime-300/30 focus-visible:border-lime-300/50 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
      },
      size: {
        sm: 'h-9 px-3 text-base sm:text-sm',
        md: 'h-11 px-4 text-base sm:text-sm',
        lg: 'h-13 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type InputVariantProps = VariantProps<typeof inputVariants>

export const textareaVariants = cva(
  'flex w-full rounded-xl resize-y transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/30',
  {
    variants: {
      variant: {
        default:
          'bg-background/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        outlined:
          'bg-transparent border-2 border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        filled:
          'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        ghost:
          'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus-visible:ring-lime-300/30 focus-visible:border-lime-300/50',
      },
      size: {
        sm: 'min-h-[80px] text-sm px-3 py-2',
        md: 'min-h-[100px] text-sm px-4 py-3',
        lg: 'min-h-[120px] text-base px-4 py-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type TextAreaVariantProps = VariantProps<typeof textareaVariants>
