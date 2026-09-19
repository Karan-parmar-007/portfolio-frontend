import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all transform-gpu active:scale-95 active:opacity-90 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
  {
    variants: {
      variant: {
        outline: 'border border-green text-green bg-transparent hover:bg-green-tint hover:text-green shadow-none px-7 py-4 font-mono',
        solid: 'bg-green text-navy hover:bg-green/90 px-5 py-2.5 font-medium',
        ghost: 'text-light-slate hover:text-green px-3 py-2',
        destructive:
          'border border-light-slate text-lightest-slate hover:bg-lightest-navy px-5 py-2.5',
      },
      size: {
        default: '',
        sm: 'px-4 py-2 text-xs',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
