import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'z-10 flex flex-row items-center rounded-full border-2 border-black  font-bold text-xl gap-2 whitespace-nowrap justify-center w-fit',
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
        icon: 'border-none ',
        ghost: 'border-none ',
        checkin: 'bg-pink hover:bg-black [&>*:not(svg)]:hover:bg-pink hover:text-white text-black',
        checkout:
          'bg-green hover:bg-black [&>*:not(svg)]:hover:bg-green hover:text-white text-black',
        pass: 'bg-blue hover:bg-black [&>*:not(svg)]:hover:bg-blue text-white',
        back: 'bg-yellow hover:bg-black [&>*:not(svg)]:hover:bg-yellow hover:text-white text-black',
      },
      size: {
        default: 'p-2 px-6',
        icon: 'p-4',
        ghost: 'p-0',
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
      <div className={cn(className, 'relative w-fit')}>
        {hasShadow && (
          <div
            className={cn(
              '∏translate-x-1.5 absolute inset-0 translate-y-1.5 transform rounded-full border-2 border-black bg-black',
            )}
          />
        )}
        <Comp
          className={cn(buttonVariants({variant, size}), 'group relative')}
          ref={ref}
          {...props}>
          {props.children}
        </Comp>
      </div>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
