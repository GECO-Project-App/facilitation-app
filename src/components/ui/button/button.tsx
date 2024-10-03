import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import * as React from 'react';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  ' gap-4 w-fit inline-flex text-xl items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-black shadow-dark active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none',
  {
    variants: {
      variant: {
        pink: 'bg-pink ',
        blue: 'bg-blue text-white',
        green: 'bg-green',
        yellow: 'bg-yellow',
        red: 'bg-red',
        orange: 'bg-orange',
        purple: 'bg-purple',
        white: 'bg-white',
      },
      size: {
        default: 'px-6 py-4',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'pink',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
