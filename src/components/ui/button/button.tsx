import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'z-10 flex flex-row items-center rounded-full border-2 border-black font-bold text-xl gap-2 whitespace-nowrap justify-center w-fit',
  {
    variants: {
      variant: {
        icon: 'border-none',
        ghost: 'border-none',
        checkin: 'bg-pink hover:bg-black hover:text-white text-black ',
        checkout: 'bg-green hover:bg-black hover:text-white text-black',
        pass: 'bg-blue hover:bg-black text-white',
        back: 'bg-yellow hover:bg-black hover:text-white text-black',
      },
      size: {
        default: 'p-4 px-6',
        icon: 'p-4',
        ghost: 'p-0',
        circle: 'w-32 h-32',
      }
    },
    defaultVariants: {
      variant: 'checkin',
      size: 'default',
    },
  },
);

// These need to be named the same as the button variants
const shadowVariants = cva(
  'absolute inset-0 translate-x-1.5 translate-y-1.5 transform rounded-full border-2 border-black bg-black',
  {
    variants: {
      variant: {
        checkin: 'group-hover:bg-pink',
        checkout: ' group-hover:bg-green',
        pass: 'group-hover:bg-blue',
        back: ' group-hover:bg-yellow',
        icon: '',
        ghost: '',
      },
    },
    defaultVariants: {
      variant: 'checkin',
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
      <div className={cn(className, 'group relative w-fit')}>
        <Comp className={cn(buttonVariants({variant, size}), 'relative')} ref={ref} {...props}>
          {props.children}
        </Comp>
        {hasShadow && <div className={cn(shadowVariants({variant}))} />}
      </div>
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
