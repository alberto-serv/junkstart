import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Brand default: Poppins, sentence case, 2px corner (the brand button spec).
  // The `link` variant opts back out to a plain text link in the body face.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-display font-bold tracking-[-0.01em] text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-brand-sm hover:bg-brand-deep',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // The brand's secondary button: white fill, 8px corner, inset flame ring.
        outline:
          'rounded-lg bg-white text-ink shadow-flame-inset hover:bg-flame hover:text-white',
        secondary:
          'bg-flame text-white shadow-flame-glow hover:bg-flame-deep',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'font-sans font-bold tracking-normal text-flame underline-offset-4 hover:translate-y-0 hover:text-flame-deep hover:underline',
      },
      size: {
        default: 'h-11 px-7 py-2 text-base',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
