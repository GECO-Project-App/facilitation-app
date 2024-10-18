'use client';

import {cn} from '@/lib/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import React from 'react';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({className, ...props}, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      'overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up w-full p-2 lg:p-4',
      className,
    )}
    {...props}
  />
));

CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName;

export {Collapsible, CollapsibleContent, CollapsibleTrigger};
