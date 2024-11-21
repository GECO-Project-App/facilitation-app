import * as React from 'react';

import {cn} from '@/lib/utils';

// Remove the TextareaProps interface and use the supertype directly
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({className, ...props}, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-3xl border border-black bg-transparent p-6 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export {Textarea};
