
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target active:scale-95 duration-200',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] shadow-md hover:shadow-lg',
        destructive: 'bg-[var(--error-color)] text-white hover:opacity-90 shadow-sm',
        outline: 'border border-[var(--border-color)] bg-transparent hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
        secondary: 'bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-hover)] shadow-sm',
        ghost: 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        link: 'text-[var(--primary-color)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-[var(--radius-sm)] px-3 text-xs',
        lg: 'h-12 rounded-[var(--radius-md)] px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
