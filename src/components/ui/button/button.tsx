import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'flex flex-row items-center rounded-full border-2 border-black text-black uppercase font-bold text-xl p-6 gap-2',
  {
    variants: {
      variant: {
        // default:
        //   "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        // destructive:
        //   "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // outline:
        //   "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        // secondary:
        //   "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
        // link: "text-primary underline-offset-4 hover:underline",
        checkin: 'bg-pink hover:bg-black [&>*:not(svg)]:hover:bg-pink hover:text-white',
        checkout: 'bg-green hover:bg-black [&>*:not(svg)]:hover:bg-green hover:text-white',
        pass: 'bg-orange hover:bg-black [&>*:not(svg)]:hover:bg-orange hover:text-white',
        back: 'bg-yellow hover:bg-black [&>*:not(svg)]:hover:bg-yellow hover:text-white',
      },
      size: {
        default: '',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'checkin',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hasShadow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, hasShadow = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}), 'group relative')}
        ref={ref}
        {...props}>
        {props.children}

        {hasShadow && (
          <div
            className={cn(
              'absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 transform rounded-full border-2 border-black bg-black',
            )}
          />
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
