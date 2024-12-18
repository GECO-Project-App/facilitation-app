import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';

import {RiveAnimation} from '@/components/RiveAnimation';
import {cn} from '@/lib/utils';

const textAreaVariants = cva(
  'bg-white flex min-h-[60px] max-h-[680px] w-full rounded-4xl border-2 border-black p-6  placeholder:text-black/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        shadow: 'shadow-dark mb-3',
      },
    },
    defaultVariants: {
      variant: 'shadow',
    },
  },
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  placeholder?: string;
}

const hideMobileKeyboardOnReturn = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' || e.code === 'Enter') {
    e.preventDefault();
    e.currentTarget.blur();
  }
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, variant, ...props}, ref) => {
    return (
      <textarea
        inputMode="text"
        onKeyDown={hideMobileKeyboardOnReturn}
        className={cn(textAreaVariants({variant, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

const TextareaWithHeader = React.forwardRef<
  HTMLDivElement,
  TextareaProps & {
    title: string;
    subtitle?: string;
  }
>(({className, variant, title, subtitle, ...props}, ref) => {
  return (
    <div className="flex flex-col flex-grow rounded-4xl ">
      <div className="flex flex-col gap-2 bg-pink p-4 rounded-t-4xl border-2 border-black border-b-0 pt-6 relative">
        <RiveAnimation
          src="eyes.riv"
          width={48}
          height={48}
          className=" absolute -top-6 left-0 right-0"
        />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-black/60 ">{subtitle}</p>
      </div>
      <textarea
        {...props}
        className={cn(textAreaVariants({variant, className}), 'rounded-t-none')}
      />
    </div>
  );
});

TextareaWithHeader.displayName = 'TextareaWithHeader';

export {Textarea, TextareaWithHeader};
