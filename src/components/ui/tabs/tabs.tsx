'use client';
import {cva, type VariantProps} from 'class-variance-authority';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import {cn} from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex w-full items-center justify-center rounded-full border-2 border-black',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabVariants = cva(
  'inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border-x-2 border-transparent p-4 text-xl font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-black data-[state=active]:shadow first:data-[state=active]:border-r-2 last:data-[state=active]:border-l-2',
  {
    variants: {
      variant: {
        green: 'data-[state=active]:bg-green ',
        yellow: 'data-[state=active]:bg-yellow',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabVariants>
>(({className, variant, ...props}, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn(tabVariants({variant}), className)} {...props} />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export {Tabs, TabsContent, TabsList, TabsTrigger};
