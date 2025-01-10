import {cva, VariantProps} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '@/lib/utils';

const textareaVariants = cva(
  'flex min-h-64 bg-white w-full h-full rounded-4xl border-2 border-black p-6 text-sm placeholder:text-black/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ',
  {
    variants: {
      variant: {
        default: '',
        feedback: 'shadow-dark mb-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, variant, ...props}, ref) => {
    return <textarea className={cn(textareaVariants({variant, className}))} ref={ref} {...props} />;
  },
);
Textarea.displayName = 'Textarea';

export {Textarea, textareaVariants};
